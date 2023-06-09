import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { getAPIClient } from "../utils/client";
import Link from "next/link";
import { type MyIntegration } from "../utils/types";

const client = getAPIClient();

const SingleIntegration = ({ integration }: { integration: MyIntegration }) => {
  const classes = [styles.card, styles["grid-item"]];
  if (integration.integrated) {
    classes.push(styles.integrated);
  }
  return (
    <Link href={`integration/${integration.id}`}>
      <div className={classes.join(" ")}>
        <h2>{integration.name}</h2>
      </div>
    </Link>
  );
};

const Integrations = (): JSX.Element => {
  const [integrations, setIntegrations] = useState<MyIntegration[]>([]);
  useEffect(() => {
    client.getUserIntegrations().then((value) => setIntegrations(value));
  }, []);
  return (
    <div className={styles.grid}>
      {integrations.map((integration) => (
        <SingleIntegration key={integration.id} integration={integration} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Blinq • Integrations</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Blinq</h1>
        <p className={styles.description}>Manage your integrations here</p>
        <Integrations />
      </main>
    </div>
  );
};

export default Home;
