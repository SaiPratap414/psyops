import React from "react";
import Image from "next/image";
import TwitterLogo from "../../assets/images/twitter.svg";
import DiscordLogo from "../../assets/images/discord.svg";
import styles from "../../app/page.module.scss";

export default function Social() {
  const handleTwitterRedirect = () => {
    window.open("https://twitter.com/Psyopbet", "_blank");
  };

  const handleDiscordRedirect = () => {
    window.open("https://t.me/psyopsbsc", "_blank");
  };

  return (
    <div className={styles.social}>
      <div>
        <Image
          src={TwitterLogo}
          alt="Twitter"
          onClick={handleTwitterRedirect}
          className={styles.icon}
        />
        <Image
          src={DiscordLogo}
          alt="Discord"
          onClick={handleDiscordRedirect}
          className={styles.icon}
        />
      </div>
    </div>
  );
}
