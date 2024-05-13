import styles from "../styles/Home.module.css";
import stylesAdd from "../styles/Add.module.css";
import Head from "next/head";
import Router from "next/router";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Add() {
  const { query } = useRouter();
  try {
    const token = query.token;
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
          <h1 className={stylesAdd.h1}>Register your Database</h1>
          <ul className={stylesAdd.ul}>
            <li>1. Go to your template that you have just cloned.</li>
            <li>
              2. Click on share and add the integration &quot;Habit Tracker with
              Charts integration&quot;.
              <Image
                className={stylesAdd.image}
                src="/share-demo.png"
                alt="screenshot of description"
              />
              <figcaption className={stylesAdd.figcaption}>
                it should look like this
              </figcaption>
            </li>
            <li>
              3. Make sure the name of the table is unchanged or is &quot;Habit
              Tracker Database&quot;.
            </li>
            <li>
              4.
              <button
                className={stylesAdd.button}
                onClick={() => {
                  getStatus(token);
                }}
              >
                Continue to the last step
              </button>
            </li>
          </ul>
        </main>
        <footer className={styles.footer}>
          <hr />
          <p></p>
        </footer>
      </div>
    );
  } catch (error) {
    alert("something went wrong :(");
  }
}
async function getStatus(token) {
  let res = await fetch(`/api/add/?token=${token}`);
  res = await res.json();
  if (res.success) {
    Router.push({ pathname: "/id", query: { id: res.id } });
  } else {
    alert(
      "A table with the name 'Habit Tracker Database' where the integration was added could not be found. :( \nMake sure this is the case and try again."
    );
  }
}
