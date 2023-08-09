import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import config from './config';

const OAuth2 = google.auth.OAuth2;

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    config.CLIENT_ID,
    config.CLIENT_SECRET,
    config.REDIRECT_URI
  );

  oauth2Client.setCredentials({
    refresh_token: config.REFRESH_TOKEN,
  });

  const accessToken = await oauth2Client.getAccessToken();

  const options: SMTPTransport.Options = {
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: config.EMAIL,
      accessToken: accessToken.token ?? '',
      clientId: config.CLIENT_ID,
      clientSecret: config.CLIENT_SECRET,
      refreshToken: config.REFRESH_TOKEN,
    },
  };

  const transporter = nodemailer.createTransport(options);

  return transporter;
};

const mailer = async (emailOptions: EmailOptions) => {
  const emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};

export const sendVerificationEmail = async (email: string, token: string) => {
  if (!config.EMAIL) {
    throw new Error('Missing email for OAuth2 client');
  }

  const link = `${config.WEB_APP_URL}/verify/${token}`;

  const emailOptions = {
    from: `Job Application Tracker <${config.EMAIL}>`,
    to: email,
    subject: 'Email Verification',
    html: `
      <p>
        Thank you for registering with Job Application Tracker. Please verify your email with the link below:<br /><br />
        <a href="${link}">${link}</a><br />
        The link will expire in 24 hours.
      </p>
    `,
  };
  await mailer(emailOptions);
};

export const resendVerificationEmail = async (email: string, token: string) => {
  if (!config.EMAIL) {
    throw new Error('Missing email for OAuth2 client');
  }

  const link = `${config.WEB_APP_URL}/verify/${token}`;

  const emailOptions = {
    from: `Job Application Tracker <${config.EMAIL}>`,
    to: email,
    subject: 'Email Verification',
    html: `
      <p>
        A new verification link has been provided. Please verify your email by clicking the link below:<br /><br />
        <a href="${link}">${link}</a><br />
        The link will expire in 24 hours.
      </p>
    `,
  };
  await mailer(emailOptions);
};
