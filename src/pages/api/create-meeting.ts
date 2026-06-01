import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { title, start, end, googleToken } = await request.json();

    if (!googleToken) {
      return new Response(JSON.stringify({ error: 'No Google token' }), { status: 401 });
    }

    // Crear evento en Google Calendar con conferenceData (Meet real)
    const requestId = crypto.randomUUID();

    const res = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${googleToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: title,
          start:   { dateTime: start },
          end:     { dateTime: end },
          conferenceData: {
            createRequest: {
              requestId,
              conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.error('Google Calendar error:', err);
      return new Response(JSON.stringify({ error: err.error?.message || 'Calendar API error' }), { status: 500 });
    }

    const event = await res.json();
    const meetLink = event.conferenceData?.entryPoints?.find(
      (ep: any) => ep.entryPointType === 'video'
    )?.uri || '';

    return new Response(JSON.stringify({
      meetLink,
      eventId: event.id,
      gcalLink: event.htmlLink,
    }), { status: 200 });

  } catch (e: any) {
    console.error('create-meeting error:', e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};