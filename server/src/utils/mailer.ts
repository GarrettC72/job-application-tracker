import nodemailer from "nodemailer";
import { google } from "googleapis";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import config from "./config";

const OAuth2 = google.auth.OAuth2;

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
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: config.EMAIL,
      accessToken: accessToken.token ?? "",
      clientId: config.CLIENT_ID,
      clientSecret: config.CLIENT_SECRET,
      refreshToken: config.REFRESH_TOKEN,
    },
  };

  const transporter = nodemailer.createTransport(options);

  return transporter;
};

const mailer = async (email: string, subject: string, html: string) => {
  if (!config.EMAIL) {
    throw new Error("Missing email for OAuth2 client");
  }

  const emailOptions = {
    from: `Job Application Tracker <${config.EMAIL}>`,
    to: email,
    subject,
    html,
  };

  const emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const link = `${config.WEB_APP_URL}/verify?token=${token}`;
  const subject = "Email Verification";
  const html = `
    <p>
      Thank you for registering with Job Application Tracker. Please verify your email with the link below:<br /><br />
      <a href="${link}">${link}</a><br />
      The link will expire in 24 hours.
    </p>
  `;

  await mailer(email, subject, html);
};

export const resendVerificationEmail = async (email: string, token: string) => {
  const link = `${config.WEB_APP_URL}/verify?token=${token}`;
  const subject = "Email Verification";
  const html = `
    <p>
      A new verification link has been provided. Please verify your email by clicking the link below:<br /><br />
      <a href="${link}">${link}</a><br />
      The link will expire in 24 hours.
    </p>
  `;

  await mailer(email, subject, html);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const link = `${config.WEB_APP_URL}/reset?token=${token}`;
  const subject = "Password Reset";
  const html = `
    <p>
      You have requested a link to reset your password. Please set a new password for your account with the link below:<br /><br />
      <a href="${link}">${link}</a><br />
      The link will expire in 24 hours.
    </p>
  `;

  await mailer(email, subject, html);
};
