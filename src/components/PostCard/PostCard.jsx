import styles from "./PostCard.module.css";

export default function PostCard({
  image,
  category,
  title,
  summary,
  children,
}) {
  return (
    <article className={styles.card}>
      {image && <img src={image} alt="" />}
      <div className={styles.content}>
        {category && <p className={styles.category}>{category}</p>}
        <h3>{title}</h3>
        {summary && <p className={styles.summary}>{summary}</p>}
        {children}
      </div>
    </article>
  );
}
