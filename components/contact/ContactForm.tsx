'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormData } from '@/lib/schemas';
import { sendContactEmail } from '@/app/actions/sendEmail';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

function ContactFormInner() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const { executeRecaptcha } = useGoogleReCaptcha();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    if (!executeRecaptcha) {
      setErrorMessage('reCAPTCHA not loaded. Please refresh the page.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // Get reCAPTCHA token
      const token = await executeRecaptcha('contact_form');

      // Create FormData
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('message', data.message);
      formData.append('recaptchaToken', token);

      // Submit
      const result = await sendContactEmail(formData);

      if (result.success) {
        setStatus('success');
        reset();
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Name"
        placeholder="John Doe"
        {...register('name')}
        error={errors.name?.message}
        disabled={status === 'loading'}
      />

      <Input
        label="Email"
        type="email"
        placeholder="john@example.com"
        {...register('email')}
        error={errors.email?.message}
        disabled={status === 'loading'}
      />

      <Textarea
        label="Message"
        rows={6}
        placeholder="Tell me about your project or opportunity..."
        {...register('message')}
        error={errors.message?.message}
        disabled={status === 'loading'}
      />

      <Button type="submit" size="lg" disabled={status === 'loading'} className="w-full sm:w-auto">
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </Button>

      {/* Status Messages */}
      {status === 'success' && (
        <div
          className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20"
          role="alert"
          aria-live="polite"
        >
          <p className="text-sm font-medium text-green-800 dark:text-green-200">
            Message sent successfully! I'll get back to you soon.
          </p>
        </div>
      )}

      {status === 'error' && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
          role="alert"
          aria-live="assertive"
        >
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            {errorMessage || 'Failed to send message. Please try again.'}
          </p>
        </div>
      )}

      <p className="text-xs text-gray-600 dark:text-gray-400">
        This site is protected by reCAPTCHA and the Google{' '}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary-600"
        >
          Privacy Policy
        </a>{' '}
        and{' '}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary-600"
        >
          Terms of Service
        </a>{' '}
        apply.
      </p>
    </form>
  );
}

export function ContactForm() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          Contact form is not configured. Please contact me directly at anguiano.dev@gmail.com
        </p>
      </div>
    );
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
      <ContactFormInner />
    </GoogleReCaptchaProvider>
  );
}
