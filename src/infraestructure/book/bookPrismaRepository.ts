import { Book as PrismaBook } from '@prisma/client';
import { BookRepository } from '../../domain/book/repository/bookRepository';
import { PublishBookUseCaseInput } from '../../domain/book/BookUseCases/PublishUseCase';
import { Book, BookStatus } from '../../domain/book/Book';
import { prismaClient } from '../global/PrismaClient';
import { UpdateBookUseCaseInput } from '../../domain/book/BookUseCases/UpdateUseCase';

export class PublishBookPrismaRepository implements BookRepository {
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
}
