import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import EventDetails from "../components/EventDetails";
import RegistrationForm from "../components/RegistrationForm";
import { supabaseRequest } from "../event";

export default function EventPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = event ? `${event.title} | Mellemrum` : "Event | Mellemrum";
  }, [event]);

  useEffect(() => {
    async function getEvent() {
      try {
        const data = await supabaseRequest(`/events?id=eq.${eventId}&select=*`);
        if (!data[0]) {
          throw new Error("Eventet blev ikke fundet.");
        }
        setEvent(data[0]);
      } catch (eventError) {
        setError(eventError.message);
      } finally {
        setIsLoading(false);
      }
    }

    getEvent();
  }, [eventId]);

  if (isLoading) {
    return <main className="event-page">Henter event...</main>;
  }

  if (error || !event) {
    return (
      <main className="event-page">{error || "Eventet blev ikke fundet."}</main>
    );
  }

  return (
    <>
      <main className="event-page">
        <Link className="back-link" to="/">
          ← Alle events
        </Link>

        <EventDetails event={event} />
        <RegistrationForm eventId={eventId} />
      </main>
    </>
  );
}
