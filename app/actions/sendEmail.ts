'use server';

import { Resend } from 'resend';
import { ContactEmail } from '@/lib/email-templates';
import { verifyRecaptcha } from './verifyRecaptcha';
import { contactSchema } from '@/lib/schemas';
import { SITE_CONFIG } from '@/lib/constants';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  try {
    // Extract data from FormData
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
      recaptchaToken: formData.get('recaptchaToken') as string,
    };

    // Validate form data
    const validated = contactSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: 'Invalid form data. Please check your inputs.',
      };
    }

    // Verify reCAPTCHA
    const recaptchaValid = await verifyRecaptcha(data.recaptchaToken);
    if (!recaptchaValid) {
      return {
        success: false,
        error: 'reCAPTCHA verification failed. Please try again.',
      };
    }

    // Send email
    const result = await resend.emails.send({
      from: `Portfolio Contact <${SITE_CONFIG.email}>`,
      to: SITE_CONFIG.email,
      replyTo: validated.data.email,
      subject: `Portfolio Contact: ${validated.data.name}`,
      react: ContactEmail(validated.data),
    });

    if (result.error) {
      console.error('Email send error:', result.error);
      return {
        success: false,
        error: 'Failed to send email. Please try again later.',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Contact form error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
}
