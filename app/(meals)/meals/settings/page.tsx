import { MealsNav } from '@/components/meals/MealsNav';
import { ReminderSetup } from '@/components/meals/ReminderSetup';

export default function SettingsPage() {
  return (
    <main>
      <MealsNav active="/meals/settings" />
      <header className="mb-4">
        <h1 className="text-3xl font-semibold">Reminders</h1>
        <p className="mt-1 text-foreground-secondary">
          Lunch between 11 and noon, dinner between 5 and 6, and a freezer-to-fridge reminder between 9 and 10
          the night before. Times follow whatever time zone your phone is in.
        </p>
      </header>
      <ReminderSetup vapidPublicKey={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''} />
    </main>
  );
}
