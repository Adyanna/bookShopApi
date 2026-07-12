import { Prisma, Book as PrismaBook } from '@prisma/client';
import { BookRepository } from '../../domain/book/repository/bookRepository';
import { PublishBookUseCaseInput } from '../../domain/book/BookUseCases/PublishUseCase';
import { Book, BookStatus } from '../../domain/book/Book';
import { prismaClient } from '../global/PrismaClient';
import { UpdateBookUseCaseInput } from '../../domain/book/BookUseCases/UpdateUseCase';
import { findBooksUseCaseInput } from '../../domain/book/BookUseCases/CatalogUseCase';
import { file } from 'zod';
import { PriceSuggestionBook } from '../../domain/book/BookUseCases/PriceReductionSuggestion';

export class BookPrismaRepository implements BookRepository {
  private readonly prisma = prismaClient;

  async create(params: PublishBookUseCaseInput): Promise<Book> {
    const newBook = await this.prisma.book.create({
      data: {
        title: params.title,
        description: params.description,
        price: params.price,
        author: params.author,
        ownerId: params.ownerId,
        // status: params.status ?? BookStatus.PUBLISHED,
        // soldAt: null,
      },
    });
    return this.restore(newBook);
  }

  private restore(prismaBook: PrismaBook): Book {
    return new Book({
      id: prismaBook.id,
      title: prismaBook.title,
      description: prismaBook.description,
      price: prismaBook.price,
      author: prismaBook.author,
      status: prismaBook.status as BookStatus,
      ownerId: prismaBook.ownerId,
      soldAt: prismaBook.soldAt,
      createAt: prismaBook.createdAt,
    });
  }
  async update(id: number, params: UpdateBookUseCaseInput): Promise<Book> {
    const newBook = await this.prisma.book.update({
      where: { id },
      data: {
        title: params.title,
        description: params.description,
        price: params.price,
        author: params.author,
      },
    });
    return this.restore(newBook);
  }

  async findById(id: number): Promise<Book | null> {
    const book = await this.prisma.book.findUnique({
      where: {
        id,
      },
    });

    if (!book) {
      return null;
    }

    return this.restore(book);
  }

  async remove(id: number): Promise<void> {
    await this.prisma.book.delete({
      where: {
        id,
      },
    });
  }

  async buy(id: number): Promise<void> {
    await this.prisma.book.update({
      where: {
        id,
      },
      data: {
        status: 'SOLD',
        soldAt: new Date(),
      },
    });
  }

  async findPublished(params: findBooksUseCaseInput): Promise<{ books: Book[]; total: number }> {
    const { page, limit } = params;
    const filters: Prisma.BookWhereInput = { status: 'PUBLISHED' };
    if (params.search) {
      filters.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { author: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    const [bookData, total] = await Promise.all([
      this.prisma.book.findMany({ skip: (page - 1) * limit, take: limit, where: filters }),
      this.prisma.book.count({ where: filters }),
    ]);

    const books = bookData.map((book) => this.restore(book));
    return { books, total };
  }

  async findByOwnerId(ownerId: number): Promise<Book[]> {
    const bookData = await this.prisma.book.findMany({
      where: {
        ownerId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return bookData.map((book) => this.restore(book));
  }

  async findBooksForPriceSuggestion(): Promise<PriceSuggestionBook[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const books = await this.prisma.book.findMany({
      where: {
        status: 'PUBLISHED',
        createdAt: {
          lte: sevenDaysAgo,
        },
      },
      include: {
        user: {
          select: {
            firstName: true,
            email: true,
          },
        },
      },
    });

    return books.map((book) => ({
      title: book.title,
      firstName: book.user.firstName,
      email: book.user.email,
    }));
  }
}
