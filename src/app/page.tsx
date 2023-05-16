"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import LocalFont from "next/font/local";

// hooks
import { useMetamask } from "@/contexts/Metamask";
import { useRouter } from "next/navigation";

// components
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Social from "@/components/Social";

// helpers
import { db } from "@/firebase";
import { onSnapshot, collection, query, where, orderBy } from "firebase/firestore";

// assets
import CoinIcon from "../assets/images/coin.png";
import TosserLogo from "../assets/images/crown.png";

import styles from "./page.module.scss";
import moment from "moment";

const font = LocalFont({ src: "../assets/fonts/ChelseaMarket-Regular.ttf" });

export default function Home() {
  const wallet = useMetamask();
  const router = useRouter();

  const [recentTosses, setRecentTosses] = useState<any[]>([]);

  useEffect(() => {
    const _unsubscribe = onSnapshot(
      query(collection(db, "moralis", "events", "Coinflip"), orderBy("blockTimestamp", "desc")),
      (snapshot) => {
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          setRecentTosses((prev) => [...prev, data]);
        });
      }
    );

    return () => {
      if (_unsubscribe) _unsubscribe();
    };
  }, []);

  return (
    <>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.center}>
          <Image src={TosserLogo} alt="" />

          {wallet.account ? (
            <button className={font.className} onClick={() => router.push("/toss")}>
              <span>Flip</span>
            </button>
          ) : (
            <button className={font.className} onClick={wallet.connect}>
              <span>Connect Wallet</span>
            </button>
          )}

          <div className={styles.recent}>
            <h2 className={font.className}>Recent Plays</h2>

            <div className={styles.list}>
              {recentTosses.map((toss, i) => (
                <div key={i} className={styles.item}>
                  <span className={styles.left}>
                    <Image src={CoinIcon} alt="" />
                    <p>
                      {toss._user?.slice(0, 5)}...{toss._user?.slice(-5)} flipped {toss.amount || 0.01} and{" "}
                      <span className={toss.prediction === toss.result ? styles.won : styles.lost}>
                        {toss.prediction === toss.result ? "Won" : "Got Rekt"}
                      </span>
                    </p>
                  </span>
                  <p className={styles.time}>{moment(new Date(parseFloat(`${toss.blockTimestamp}000`))).fromNow()}</p>
                </div>
              ))}
            </div>
          </div>

          <Footer />
        </div>

        <Social />
      </main>
    </>
  );
}
