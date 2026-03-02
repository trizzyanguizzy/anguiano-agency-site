import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { ContactForm } from '@/components/contact/ContactForm';
import { SITE_CONFIG, SOCIAL_LINKS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch to discuss opportunities, collaborations, or just to say hello.',
};

export default function ContactPage() {
  return (
    <Container className="py-20" size="md">
      <AnimatedSection>
        <h1 className="text-4xl font-bold sm:text-5xl">Get in Touch</h1>
        <p className="mt-6 max-w-2xl text-lg text-foreground-secondary">
          I'm always interested in hearing about new opportunities and projects. Feel free to reach
          out!
        </p>
      </AnimatedSection>

      <div className="mt-16 grid gap-12 lg:grid-cols-3">
        {/* Contact Form */}
        <AnimatedSection delay={0.1} className="lg:col-span-2">
          <ContactForm />
        </AnimatedSection>

        {/* Contact Info */}
        <AnimatedSection delay={0.2} className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold">Contact Information</h2>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground-secondary">Email</p>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="mt-1 block text-lg text-accent-orange hover:underline"
                >
                  {SITE_CONFIG.email}
                </a>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground-secondary">LinkedIn</p>
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-lg text-accent-orange hover:underline"
                >
                  View Profile
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border-default bg-background-tertiary p-6">
            <h3 className="font-medium">Response Time</h3>
            <p className="mt-2 text-sm text-foreground-secondary">
              I typically respond to messages within 24-48 hours. Looking forward to hearing from
              you!
            </p>
          </div>
        </AnimatedSection>
      </div>
    </Container>
  );
}
