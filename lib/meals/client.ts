// Browser-only helpers shared by the meals client components.

/** Same id the server derives from the push endpoint (sha256, first 32 hex chars). */
export async function endpointId(endpoint: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(endpoint));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32);
}

/** The phone's current IANA time zone, e.g. "America/Denver". No location permission needed. */
export function browserTimeZone(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {
    return undefined;
  }
}

/** Short, readable zone name for display: "CDT", "MST", "PDT"… Falls back to the IANA name. */
export function zoneLabel(timeZone: string | null | undefined): string {
  if (!timeZone) return 'Central (default)';
  try {
    const part = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' })
      .formatToParts(new Date())
      .find((p) => p.type === 'timeZoneName');
    return part?.value ?? timeZone;
  } catch {
    return timeZone;
  }
}
