import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        &copy; Made by{" "}
        <a
          href="https://www.github.com/iibrahimjrr"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Ibrahim Elsayed
        </a>{" "}
        2026
      </p>
    </footer>
  );
}
