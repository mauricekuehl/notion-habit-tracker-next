import styles from "../../styles/Home.module.css";
import stylesAddDB from "../../styles/AddDB.module.css";
import Head from "next/head";
import Router from "next/router";
import Image from "next/image";
import shareDemo from "../../public/share-demo.png";
import { useRouter } from "next/router";

async function addDB(access_token) {
  /*
  Fetch call could now be replaced by Server Actions. 
  */
  let res = await fetch(
    `https://notion.mauricekuehl.com/api/add-notion-db?access_token=${access_token}`
  );
  res = await res.json();

  if (res.foundDatabase) {
    Router.push({
      pathname: "/setup/present-embed-link",
      query: { database_id: res.database_id },
    });
  } else {
    alert(
      "A table with the name 'Habit Tracker Database' where the integration was added could not be found. :( \nMake sure this is the case and try again."
    );
  }
}

export default function Add() {
  const { query } = useRouter();
  const access_token = query.access_token;
  try {
    /*
    Passing on the access token in the URL is suboptimal, 
    but should not be a problem in this case.   
    */
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
          <h1 className={stylesAddDB.h1}>Register your Database</h1>
          <ul className={stylesAddDB.ul}>
            <li>1. Go to your template that you have just cloned.</li>
            <li>
              2. Click on share and add the integration &quot;Habit Tracker with
              Charts integration&quot;.
              <Image
                className={stylesAddDB.image}
                src={shareDemo}
                alt="screenshot of description"
              />
              <figcaption className={stylesAddDB.figcaption}>
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
                className={stylesAddDB.button}
                onClick={() => {
                  addDB(access_token);
                }}
              >
                Continue to the last step
              </button>
            </li>
          </ul>
        </main>
        <footer className={styles.footer}>
          <hr />
        </footer>
      </div>
    );
  } catch (error) {
    alert("something went wrong :(");
  }
}
