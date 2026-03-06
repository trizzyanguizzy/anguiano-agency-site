import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about my background, experience, and approach to software engineering.',
};

export default function AboutPage() {
  return (
    <Container className="py-20" size="md">
      <AnimatedSection>
        <h1 className="text-4xl font-bold sm:text-5xl">About Me</h1>
        <p className="mt-6 text-lg text-foreground-secondary">
          Platform Engineer passionate about building accessible, scalable web applications.
        </p>
      </AnimatedSection>

      <div className="mt-12 grid gap-12 lg:grid-cols-3">
        <AnimatedSection delay={0.1} className="lg:col-span-2">
          <div className="space-y-6 text-lg leading-relaxed text-foreground-secondary">
            <p>
              I'm a Software Engineer, and I focus on improving developer experience and
              ensuring applications are accessible to everyone. With over 7 years of experience
              in software engineering, I've worked across the full stack but have found my passion in
              platform engineering and frontend development.
            </p>

            <p>
              My journey in tech started at the University of Nebraska at Omaha, where I earned my
              Bachelor of Science in Management Information Systems. Since then, I've had the
              opportunity to work with companies ranging from Fortune 500 enterprises to fast-growing
              startups, each experience teaching me valuable lessons about building quality software.
            </p>

            <p>
              When I'm not coding, you can find me exploring new technologies, contributing to open
              source, or mentoring junior engineers. I'm always eager to learn and share knowledge
              with the community.
            </p>
          </div>

          <div className="mt-8">
            {/* <a href="/resume.pdf" download>
              <Button size="lg">Download Resume</Button>
            </a> */}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2} className="space-y-8">
          {/* Profile Image Placeholder */}
          <img className='rounded-xl' src="https://ur18ygzmshmoaei4.public.blob.vercel-storage.com/anguianoHeadshot.png" />


          {/* Quick Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Quick Info</h3>
            <div className="space-y-3 text-sm">
              {/* <div>
                <p className="font-medium text-foreground-primary">Current Role</p>
                <p className="text-foreground-secondary">Platform Engineer at Hudl</p>
              </div> */}
              <div>
                <p className="font-medium text-foreground-primary">Location</p>
                <p className="text-foreground-secondary">Remote - Omaha, NE</p>
              </div>
              <div>
                <p className="font-medium text-foreground-primary">Education</p>
                <p className="text-foreground-secondary">BS in MIS</p>
                <p className="text-foreground-secondary">
                  University of Nebraska at Omaha
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground-primary">Email</p>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-accent-orange hover:underline transition-colors"
                >
                  {SITE_CONFIG.email}
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </Container>
  );
}
