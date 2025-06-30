import { Injectable } from '@nestjs/common';
import { mailerConfig } from 'mailer.config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter = nodemailer.createTransport({
    host: mailerConfig.host,
    port: mailerConfig.port,
    secure: mailerConfig.secure,
    auth: mailerConfig.auth,
  });

  async sendMail(to: string, html: string, premium: number) {
    const premiumText =
      premium === 1 ? 'Básico' : premium === 2 ? 'Regular' : 'Premium';
    const subject = `Gracias por tu compra en FindApp. Disfruta tu Paquete ${premiumText}.`;

    return this.transporter.sendMail({
      from: mailerConfig.from,
      to,
      subject,
      html,
      text: subject,
    });
  }
}
