import React from "react";
import styles from "../../app/page.module.scss";
import useSwitch from "@/hooks/useSwitch";

export default function Footer() {
  const isFaqModalOpen = useSwitch(true);

  return (
    <>
      <div className={styles.footer}>
        <p>
          <span>FAQ</span> | <span>How to Play</span> | <span>Flip Responsibiliy</span>
        </p>
      </div>
      {isFaqModalOpen.value && (
        <div className={styles.faqmodal}>
          <div className={styles.modal}></div>
        </div>
      )}
    </>
  );
}
