import { MealsNav } from '@/components/meals/MealsNav';
import { ReminderSetup } from '@/components/meals/ReminderSetup';

export default function SettingsPage() {
  return (
    <main>
      <MealsNav active="/meals/settings" />
      <header className="mb-4">
        <h1 className="text-3xl font-semibold">Reminders</h1>
        <p className="mt-1 text-foreground-secondary">
          Lunch around 10, dinner around 3, and a freezer-to-fridge reminder around 8 the night before.
        </p>
      </header>
      <ReminderSetup vapidPublicKey={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''} />
    </main>
  );
}
