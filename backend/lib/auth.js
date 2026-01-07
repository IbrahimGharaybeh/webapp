import dotenv from 'dotenv';
import { betterAuth } from 'better-auth';
import { randomUUID } from 'crypto';
import { pool } from '../utils/db.js';
import { sendEmail } from './email.js';

dotenv.config();

const {
  BETTER_AUTH_SECRET,
  BETTER_AUTH_URL = 'http://localhost:3001',
  FRONTEND_URL = 'http://localhost:5173'
} = process.env;

const verificationEmailHtml = (url, name = 'there') => `
  <div style="font-family: Arial, sans-serif; line-height: 1.5;">
    <h2>Email Verification</h2>
    <p>Hi ${name},</p>
    <p>Please verify your email to finish setting up your account.</p>
    <p><a href="${url}" style="padding: 10px 16px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 6px;">Verify Email</a></p>
    <p>If the button does not work, copy and paste this link into your browser:</p>
    <p>${url}</p>
  </div>
`;

const resetPasswordHtml = (url, name = 'there') => `
  <div style="font-family: Arial, sans-serif; line-height: 1.5;">
    <h2>Password Reset</h2>
    <p>Hi ${name},</p>
    <p>We received a request to reset your password. Click the button below to continue.</p>
    <p><a href="${url}" style="padding: 10px 16px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 6px;">Reset Password</a></p>
    <p>If you did not request this, you can safely ignore this email.</p>
    <p>Reset link: ${url}</p>
  </div>
`;

export const auth = betterAuth({
  secret: BETTER_AUTH_SECRET,
  baseURL: BETTER_AUTH_URL,
  database: pool,
  trustedOrigins: [FRONTEND_URL],
  emailVerification: {
    // TEMP: disable verification requirement while testing
    sendOnSignUp: false,
    sendOnSignIn: false,
    async sendVerificationEmail(data) {
      const verificationUrl =
        data.url || `${FRONTEND_URL.replace(/\/$/, '')}/verify-email?token=${data.token}`;

      await sendEmail({
        to: data.user.email,
        subject: 'Verify your email',
        html: verificationEmailHtml(verificationUrl, data.user.name)
      });
    },
    async afterEmailVerification(data) {
      const email = data?.user?.email || data?.email;
      if (email) {
        console.log(`Email verified for ${email}`);
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    // TEMP: disable verification requirement while testing
    requireEmailVerification: false,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    resetPasswordTokenExpiresIn: 3600,
    async sendResetPassword(data) {
      // TEMP: only allow password reset emails for verified users
      if (!data.user?.emailVerified) {
        try {
          await pool.query(
            'DELETE FROM "verification" WHERE identifier = $1',
            [`reset-password:${data.token}`]
          );
        } catch (err) {
          console.warn('Failed to cleanup reset token for unverified user', err);
        }
        return;
      }

      const resetUrl =
        data.url || `${FRONTEND_URL.replace(/\/$/, '')}/reset-password?token=${data.token}`;

      await sendEmail({
        to: data.user.email,
        subject: 'Reset your password',
        html: resetPasswordHtml(resetUrl, data.user.name)
      });
    },
    async onPasswordReset({ user }) {
      console.log(`Password reset for ${user.email}`);
    }
  },
  advanced: {
    database: {
      generateId: () => randomUUID()
    }
  }
});

export const authHandler = auth.handler;
