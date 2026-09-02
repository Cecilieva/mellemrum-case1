import { useEffect, useMemo, useState } from "react";
import { IconCalendarEvent, IconSearch } from "@tabler/icons-react";
import styles from "./RegistrationsPage.module.css";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_APIKEY}`,
  "Content-Type": "application/json",
};

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.title = "Tilmeldinger | Mellemrum";
  }, []);

  useEffect(() => {
    async function getRegistrations() {
      const response = await fetch(
        `${SUPABASE_URL}/registrations?select=*,users(name,email),events(title,date,venueName)&order=createdAt.desc`,
        { headers },
      );
      const data = await response.json();
      setRegistrations(data);
    }
    getRegistrations();
  }, []);

  const mappedRegistrations = registrations.map((registration) => ({
    id: registration.id,
    name: registration.users?.name ?? "",
    email: registration.users?.email ?? "",
    event: registration.events?.title ?? "",
    date: registration.events?.date ?? "",
    status: registration.status?.toLowerCase() === "bekræftet"
      ? "bekraeftet"
      : "ny",
  }));

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
      const date = new Date(registration.date).toLocaleDateString("da-DK");
      const key = `${registration.event}|${date}`;
      if (!grouped.has(key)) {
        grouped.set(key, { event: registration.event, date, rows: [] });
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
        <p>{registrations.length} tilmeldinger i alt</p>
      </header>
      <main className={styles.page}>
        <div className={styles.toolbar}>
          <div>
            <h2>Tilmeldinger</h2>
            <p>
              {registrations.length} tilmeldinger på {new Set(registrations.map((registration) => registration.events?.title)).size} events
            </p>
          </div>
          <label className={styles.search}>
            <IconSearch size={16} aria-hidden="true" />
            <span className={styles.srOnly}>Søg navn, email eller event</span>
            <input
              type="search"
              placeholder="Søg navn, email eller event"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>

        <div className={styles.groups}>
          {groups.length === 0 && (
            <p className={styles.empty}>Ingen tilmeldinger matcher din søgning.</p>
          )}
          {groups.map((group) => (
            <section className={styles.group} key={`${group.event}-${group.date}`}>
              <header className={styles.groupHeader}>
                <div className={styles.groupTitle}>
                  <IconCalendarEvent size={18} aria-hidden="true" />
                  <span>{group.event}</span>
                  <span className={styles.date}>· {group.date}</span>
                </div>
                <span className={styles.total}>{group.rows.length} tilmeldte</span>
              </header>
              <div className={styles.rows}>
                {group.rows.map((registration) => (
                  <div className={styles.row} key={registration.id}>
                    <div>
                      <strong>{registration.name}</strong>
                      <small>{registration.email}</small>
                    </div>
                    <span className={`${styles.badge} ${styles[registration.status]}`}>
                      {registration.status === "bekraeftet" ? "Bekræftet" : "Ny"}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
