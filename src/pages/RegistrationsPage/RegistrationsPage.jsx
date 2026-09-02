import { useEffect, useMemo, useState } from "react";
import { IconCalendarEvent, IconSearch } from "@tabler/icons-react";
import styles from "./RegistrationsPage.module.css";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_REST_URL = SUPABASE_URL?.endsWith("/rest/v1")
  ? SUPABASE_URL
  : `${SUPABASE_URL}/rest/v1`;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_APIKEY}`,
  "Content-Type": "application/json",
};

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Tilmeldinger | Mellemrum";
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRegistrations() {
      try {
        if (!SUPABASE_URL || !import.meta.env.VITE_SUPABASE_APIKEY) {
          throw new Error("Supabase-miljøvariabler mangler");
        }

        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `${SUPABASE_REST_URL}/registrations?select=*,users(name,email),events(title,date)&order=createdAt.desc`,
          { headers, signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Tilmeldingerne kunne ikke hentes");
        }

        const data = await response.json();
        setRegistrations(Array.isArray(data) ? data : []);
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadRegistrations();

    return () => controller.abort();
  }, []);

  const mappedRegistrations = useMemo(
    () =>
      registrations.map((registration) => {
        const normalizedStatus = registration.status
          ?.toLowerCase()
          .replace("æ", "ae");

        return {
          id: registration.id,
          eventId: registration.eventId ?? registration.event_id,
          name: registration.users?.name ?? "Navn mangler",
          email: registration.users?.email ?? "E-mail mangler",
          event: registration.events?.title ?? "Ukendt event",
          date: registration.events?.date ?? "",
          status: normalizedStatus === "bekraeftet" ? "bekraeftet" : "ny",
        };
      }),
    [registrations],
  );

  const totalEventCount = useMemo(
    () =>
      new Set(
        mappedRegistrations.map(
          (registration) => registration.eventId ?? registration.event,
        ),
      ).size,
    [mappedRegistrations],
  );

  const filteredRegistrations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return mappedRegistrations;

    return mappedRegistrations.filter(
      (registration) =>
        registration.name.toLowerCase().includes(normalizedQuery) ||
        registration.email.toLowerCase().includes(normalizedQuery) ||
        registration.event.toLowerCase().includes(normalizedQuery),
    );
  }, [mappedRegistrations, query]);

  const groups = useMemo(() => {
    const grouped = new Map();
    for (const registration of filteredRegistrations) {
      const parsedDate = new Date(registration.date);
      const date =
        registration.date && !Number.isNaN(parsedDate.getTime())
          ? parsedDate.toLocaleDateString("da-DK")
          : "Dato mangler";
      const key = registration.eventId ?? `${registration.event}|${date}`;
      if (!grouped.has(key)) {
        grouped.set(key, {
          id: key,
          event: registration.event,
          date,
          rows: [],
        });
      }
      grouped.get(key).rows.push(registration);
    }
    return Array.from(grouped.values());
  }, [filteredRegistrations]);

  return (
    <>
      <header className="admin-header">
        <p className="eyebrow">Internt overblik</p>
        <h1>Tilmeldinger</h1>
        <p>
          {isLoading
            ? "Henter tilmeldinger..."
            : error
              ? "Tilmeldingerne kunne ikke hentes"
              : `${registrations.length} tilmeldinger i alt`}
        </p>
      </header>
      <main className={styles.page}>
        {isLoading && (
          <p className={styles.stateMessage}>Henter tilmeldinger...</p>
        )}

        {error && (
          <p className={styles.errorMessage}>
            Tilmeldingerne kunne ikke hentes. Prøv igen senere.
          </p>
        )}

        {!isLoading && !error && (
          <>
            <div className={styles.toolbar}>
              <div>
                <h2>Tilmeldinger</h2>
                <p>
                  {registrations.length}{" "}
                  {registrations.length === 1 ? "tilmelding" : "tilmeldinger"}{" "}
                  på {totalEventCount}{" "}
                  {totalEventCount === 1 ? "event" : "events"}
                </p>
              </div>
              <label className={styles.search}>
                <IconSearch size={16} aria-hidden="true" />
                <span className={styles.srOnly}>
                  Søg navn, email eller event
                </span>
                <input
                  type="search"
                  placeholder="Søg navn, email eller event"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
            </div>

            <div className={styles.groups}>
              {registrations.length === 0 ? (
                <p className={styles.stateMessage}>Ingen tilmeldinger endnu.</p>
              ) : groups.length === 0 ? (
                <p className={styles.stateMessage}>
                  Ingen tilmeldinger matcher din søgning.
                </p>
              ) : (
                groups.map((group) => (
                  <section className={styles.group} key={group.id}>
                    <header className={styles.groupHeader}>
                      <div className={styles.groupTitle}>
                        <IconCalendarEvent size={18} aria-hidden="true" />
                        <span>{group.event}</span>
                        <span className={styles.date}>· {group.date}</span>
                      </div>
                      <span className={styles.total}>
                        {group.rows.length}{" "}
                        {group.rows.length === 1 ? "tilmeldt" : "tilmeldte"}
                      </span>
                    </header>
                    <div className={styles.rows}>
                      {group.rows.map((registration) => (
                        <div className={styles.row} key={registration.id}>
                          <div>
                            <strong>{registration.name}</strong>
                            <small>{registration.email}</small>
                          </div>
                          <span
                            className={`${styles.badge} ${styles[registration.status]}`}
                          >
                            {registration.status === "bekraeftet"
                              ? "Bekræftet"
                              : "Ny"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                ))
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
}
