import Image from "next/image";
import LocalFont from "next/font/local";

// libraries
import classNames from "classnames";

// hooks
import useSwitch from "@/hooks/useSwitch";
import { useMetamask } from "@/contexts/Metamask";

// helpers
import { db } from "@/firebase";
import { onSnapshot, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

// assets
import DropdownIcon from "../../assets/icons/dropdown.svg";
import TrophyIcon from "../../assets/icons/trophy.svg";
import ExternalLinkIcon from "../../assets/icons/external-link.svg";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import CoinIcon from "../../assets/images/coin.png";

import styles from "../../app/page.module.scss";
import { useEffect, useState } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import moment from "moment";
import Link from "next/link";

const font = LocalFont({ src: "../../assets/fonts/red-alert-inet.ttf" });

export default function Navbar(props: any) {
  const wallet = useMetamask();
  const isTopStreaksOpen = useSwitch();

  const ref = useClickOutside(isTopStreaksOpen.false);

  const [topStreaks, setTopStreaks] = useState<any[]>([]);

  useEffect(() => {
    const collRef = collection(db, "moralis", "events", "Coinflip");
    const q = query(collRef, orderBy("blockTimestamp", "desc"), limit(50));

    getDocs(q).then((docs) => {
      const _topStreaks: any = [];
      docs.forEach((snapshot) => {
        const user = snapshot.data()._user;
        const hasWon = snapshot.data().prediction === snapshot.data().result;
        const existingIndex = _topStreaks.findIndex((el: any) => el.user === user);
        if (hasWon) {
          if (existingIndex >= 0) {
            _topStreaks[existingIndex].streak += 1;
          } else {
            _topStreaks.push({ user, blockTimestamp: snapshot.data().blockTimestamp, streak: 1 });
          }
        }
      });
      _topStreaks.sort((a: any, b: any) => b.streak - a.streak);
      setTopStreaks(_topStreaks);
    });
  }, []);

  return (
    <>
      <nav className={styles.navbar}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {props.back && (
            <Link href={props.back || ""}>
              <Image src={ArrowLeft} alt="" />
            </Link>
          )}
          {wallet.account && (
            <p style={{ marginBottom: 30 }}>
              {wallet.account.slice(0, 5)}...{wallet.account.slice(-5)}
            </p>
          )}
        </div>
        <div>
          {wallet.account && (
            <button className={font.className} onClick={wallet.disconnect}>
              <span>Disconnect</span>
            </button>
          )}
          {!wallet.isConnectedToAllowedNetwork && (
            <button className={font.className} onClick={wallet.switchChain}>
              <span>Switch Network</span>
            </button>
          )}
          <button
            className={classNames(font.className, isTopStreaksOpen.value && styles.active)}
            onClick={isTopStreaksOpen.toggle}
          >
            <span>Top Streaks</span>
            <Image src={DropdownIcon} alt="" />
          </button>
          {/* <button className={font.className}>
            <span>Stats</span>
            <Image src={TrophyIcon} alt="" />
          </button>
          <button className={font.className}>
            <span>Live</span>
            <Image src={ExternalLinkIcon} alt="" />
          </button> */}
        </div>
      </nav>
      {isTopStreaksOpen.value && (
        <div ref={ref} className={styles.topstreaks}>
          <div className={styles.list}>
            {topStreaks.map((streak, i) => (
              <div key={i} className={styles.item}>
                <span className={styles.left}>
                  <Image src={CoinIcon} alt="" />
                  <p>
                    {streak.user?.slice(0, 5)}...{streak.user?.slice(-5)} flipped {streak.amount || 0.001} and{" "}
                    <span className={styles.won}>doubled {streak.streak} times</span>
                  </p>
                </span>
                <p className={styles.time}>{moment(new Date(parseFloat(`${streak.blockTimestamp}000`))).fromNow()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
