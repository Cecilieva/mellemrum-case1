import { useEffect, useState } from "react";
import { Link } from "react-router";
import "./RegistrationsPage.module.css";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_APIKEY}`,
  "Content-Type": "application/json",
};

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const registrationCount = registrations.length;

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

  return (
    <>
      <header className="admin-header">
        <p className="eyebrow">Internt overblik</p>
        <h1>Tilmeldinger</h1>
        <p>{registrationCount} tilmeldinger i alt</p>
      </header>
      <main>
        <div className="registration-list">
          <div className="registration-row registration-labels">
            <span>Navn</span>
            <span>Event</span>
            <span>Dato</span>
            <span>Status</span>
          </div>
          {registrations.map((registration) => (
            <div className="registration-row" key={registration.id}>
              <div>
                <strong>{registration.users?.name}</strong>
                <small>{registration.users?.email}</small>
              </div>
              <span>{registration.events?.title}</span>
              <span>
                {new Date(registration.events?.date).toLocaleDateString(
                  "da-DK",
                )}
              </span>
              <span className="status">{registration.status}</span>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
