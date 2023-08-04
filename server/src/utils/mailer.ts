import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
const OAuth2 = google.auth.OAuth2;

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  const accessToken = await oauth2Client.getAccessToken();

  const options: SMTPTransport.Options = {
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL,
      accessToken: accessToken.token ?? '',
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
    },
  };

  const transporter = nodemailer.createTransport(options);

  return transporter;
};

const mailer = async (emailOptions: EmailOptions) => {
  const emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};

export const sendVerificationEmail = async (email: string) => {
  if (!process.env.EMAIL) {
    throw new Error('Missing email for OAuth2 client');
  }

  const emailOptions = {
    from: `Job Application Tracker <${process.env.EMAIL}>`,
    to: email,
    subject: 'Email Verification',
    html: '<p>Thank you for signing up with this email. Please verify your email with this link.</p>',
  };
  await mailer(emailOptions);
};
