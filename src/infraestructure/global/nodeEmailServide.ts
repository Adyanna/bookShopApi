import { emailService } from '../../domain/global/emailService';
import { environmentService } from './EnvironmentService';
import nodemailer from 'nodemailer';

export class nodeEmailService implements emailService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    const { MAILDEV_HOST, MAILDEV_PORT } = environmentService.get();

    this.transporter = nodemailer.createTransport({
      host: MAILDEV_HOST,
      port: MAILDEV_PORT,
      secure: false,
      ignoreTLS: true,
    });
  }

  async send(params: { email: string; message: string; subjectText?: string }): Promise<void> {
    await this.verifyConnection();
    this.transporter.sendMail({
      from: 'BookShop <noreplay@bookshop.com>',
      subject: params.subjectText,
      to: params.email,
      text: params.message,
    });
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
    } catch (error) {
      throw error;
    }
  }
}
