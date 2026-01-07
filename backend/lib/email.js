import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const FROM = 'Your App <onboarding@resend.dev>';

export async function sendEmail({ to, subject, html }) {
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  try {
    const resend = new Resend(resendApiKey);
    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html
    });

    if (error) {
      console.error('Failed to send email with Resend:', error);
      throw new Error('Unable to send email');
    }

    return data;
  } catch (err) {
    console.error('sendEmail error:', err);
    throw err;
  }
}
