import { ReminderSetup } from '@/components/family/ReminderSetup';

export const metadata = { title: 'Settings' };

export default function SettingsPage() {
  return (
    <main>
      <h1 className="mb-6 text-3xl font-semibold">Settings</h1>
      <section>
        <h2 className="text-lg font-semibold">Reminders</h2>
        <p className="mb-4 mt-1 text-foreground-secondary">
          Lunch between 11 and noon, dinner between 5 and 6, and a freezer-to-fridge reminder between 9 and 10 the
          night before. Times follow whatever time zone your phone is in.
        </p>
        <ReminderSetup vapidPublicKey={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''} />
      </section>
    </main>
  );
}
