import nodemailer from "nodemailer";
import { guardarLogError } from "./logs";

const {EMAIL_USER, EMAIL_PASSWORD} = process.env

export const sendMail = async (asunto: string, destinatarios: string[] | string, plantilla: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      secure: false, // use SSL/TLS
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: EMAIL_USER,
      to: destinatarios,
      subject: asunto,
      html: plantilla,
    };

    const info = await transporter.sendMail(mailOptions);

    return info.accepted.length > 0;
  } catch (error: any) {
    const message = error.message as string;
    guardarLogError("Error en sendMail(): " + message);
    return null;
  }
};
