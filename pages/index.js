import styles from "../styles/Home.module.css";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  try {
    return (
      <div className={styles.container}>
        <Head>
          <title>Habit tracker</title>
          <meta
            name="description"
            content="notion habits tracker with diagrams"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <h1 className={styles.h1}>
            Get detailt information on habit tracking in Notion
          </h1>
          <a
            href="https://mauz.notion.site/Habit-Tracker-with-Charts-ff94d752086844a8a43e1f1abae21f14"
            target="_blank"
            rel="noreferrer"
            className={styles.aPrime}
          >
            Get the free template
          </a>
          <a
            href="https://mauz.notion.site/Habit-Tracker-with-Charts-ff94d752086844a8a43e1f1abae21f14"
            target="_blank"
            rel="noreferrer"
            className={styles.aSec}
          >
            View a demo
          </a>
        </main>
        <footer className={styles.footer}>
          <hr className={styles.hr} />
          <p>
            If you already have the template you can add the integration{" "}
            <a href="/add">here</a>
          </p>
          <p>
            For contact and suggestions: noiton-habit-tracker@protonmail.com
          </p>
          <p>
            <Link href="/privacy">Terms & privacy</Link>
          </p>
        </footer>
      </div>
    );
  } catch (error) {
    alert("something went wrong :(");
  }
}
