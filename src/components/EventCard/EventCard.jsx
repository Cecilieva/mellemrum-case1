import { Link } from "react-router";
import styles from "./EventCard.module.css";

export default function EventCard({ event, formatEventDate, index }) {
  return (
    <article className={styles.card}>
      <img
        src={event.image}
        alt=""
        loading={index < 3 ? "eager" : "lazy"}
        decoding="async"
      />
      <div className={styles.content}>
        <p className={styles.category}>{event.category}</p>
        <h3>{event.title}</h3>
        <p className={styles.summary}>{event.summary}</p>
        <div className={styles.meta}>
          <span>{formatEventDate(event.date)}</span>
          <span>{event.venue?.name}</span>
        </div>
        <Link className={styles.link} to={`/events/${event.id}`}>
          Læs mere
        </Link>
      </div>
    </article>
  );
}
