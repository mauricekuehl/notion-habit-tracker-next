import styles from "../styles/Home.module.css";
import stylesId from "../styles/Id.module.css";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Id(props) {
  const { query } = useRouter();
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
          <h1 className={stylesId.h1}>
            Finally add an embed with the URL at the bottom of the template:
          </h1>
          <p className={stylesId.res}>
            https://notion.mauricekuehl.com/e/{query.id}
          </p>
          <Image
            className={stylesId.image}
            src="/embed-demo.png"
            alt="demo of embed"
          ></Image>
        </main>
        <footer className={styles.footer}>
          <hr />
          <p>
            If you have more than one table with the same name, only the first
            one found is selected. To add the others, the easiest way is to
            rename the table to which the link fits and repeat the whole adding
            process. <a href="/add">Add to Notion</a>
          </p>
        </footer>
      </div>
    );
  } catch (error) {
    alert("something went wrong :(");
  }
}
