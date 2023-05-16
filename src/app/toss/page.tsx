"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../page.module.scss";

// libraries
import BN from "bn.js";
import classNames from "classnames";
import { toast } from "react-hot-toast";
import { collection, onSnapshot, query, where } from "firebase/firestore";

// hooks
import useSwitch from "../../hooks/useSwitch";
import { useMetamask } from "@/contexts/Metamask";

// components
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Social from "@/components/Social";

// helpers
import { db } from "@/firebase";
import Web3 from "@/helpers/web3";
import Contracts from "@/helpers/contracts";

// assets
import TosserLogo from "../../assets/images/crown.png";
import FlipCoin from "../../assets/images/flip.gif";

import LocalFont from "next/font/local";
import { useRouter } from "next/navigation";

const font = LocalFont({ src: "../../assets/fonts/ChelseaMarket-Regular.ttf" });

enum Prediction {
  HEADS,
  TAILS,
}

export default function Toss() {
  const isTossing = useSwitch(false);
  const wallet = useMetamask();
  const hasTossed = useSwitch();
  const router = useRouter();

  const [betAmount, setBetAmount] = useState(0);
  const [prediction, setBetCall] = useState<Prediction | undefined>();
  const [receipt, setReceipt] = useState<string | undefined>();
  const [firestoreDocUnsubscriber, setFirestoreDocUnsubscriber] = useState<() => void | undefined>();

  useEffect(() => {
    if (!wallet.account) {
      router.push("/");
    }
  }, [wallet.account]);

  useEffect(() => {
    if (firestoreDocUnsubscriber) firestoreDocUnsubscriber();
    const _unsubscribe = onSnapshot(
      query(collection(db, "moralis", "events", "Coinflip"), where("__id", "==", receipt || "")),
      (snapshot) => {
        snapshot.docChanges().forEach((snapshot) => {
          const data = snapshot.doc.data();
          if (data.prediction === data.result) {
            toast.success("You won the toss");
          } else {
            toast.error("You lost the toss");
          }
          isTossing.false();
          hasTossed.false();
          _unsubscribe();
        });
      }
    );

    setFirestoreDocUnsubscriber(() => _unsubscribe);

    return () => {
      if (_unsubscribe) _unsubscribe();
      if (firestoreDocUnsubscriber) firestoreDocUnsubscriber();
    };
  }, [receipt]);

  const onToss = async () => {
    isTossing.true();
    try {
      const gasPrice = await Web3.instance.eth.getGasPrice();
      const fee = await Contracts.instances.Randomizer.methods.estimateFeeUsingGasPrice("90000", gasPrice).call();
      const bumpedUpFee = new BN(fee as unknown as string)
        .add(new BN(fee as unknown as string).mul(new BN(20)).div(new BN(100)))
        .toString();

      const flipAmount = 0.00001;
      const houseCut = flipAmount * 0.03;
      const msg_value = houseCut + flipAmount + parseFloat(Web3.instance.utils.fromWei(bumpedUpFee, "ether"));

      const receipt = await Contracts.instances.Flip.methods
        .flip(Web3.instance.utils.toWei(flipAmount.toString(), "ether"), 0)
        .send({
          from: wallet.account,
          value: Web3.instance.utils.toWei(msg_value.toString().substring(0, 10), "ether"),
        });

      setReceipt(receipt.events?.FlipRequest.returnValues.requestId);
    } catch (e) {
      console.log(e);
      isTossing.false();
      toast.error("Something went wrong");
    }
  };

  const disableButtons = !wallet.account || isTossing.value || !wallet.isConnectedToAllowedNetwork;
  const disableTossButton = !betAmount || prediction === undefined || disableButtons;

  return (
    <>
      <main className={styles.main}>
        <Navbar back="/" />

        <div className={styles.center}>
          <Image src={!isTossing.value ? TosserLogo : FlipCoin} alt="" width={220} height={200} />

          {!wallet.account && (
            <button style={{ marginBottom: 30, marginTop: 100 }} className={font.className} onClick={wallet.connect}>
              <span>Connect Wallet</span>
            </button>
          )}

          <div className={styles.toss}>
            <div className={styles.tokenSelect}>
              <p className={styles.balance}>
                <span>Wallet: </span>
                <span>{wallet.balance} ETH</span>
              </p>
            </div>

            <div className={styles.numpad}>
              <div className={styles.numbers}>
                <Numkey value={0.025} disabled={disableButtons} onChange={setBetAmount} selected={betAmount === 0.5} />
                <Numkey value={0.05} disabled={disableButtons} onChange={setBetAmount} selected={betAmount === 0.5} />
                <Numkey value={0.075} disabled={disableButtons} onChange={setBetAmount} selected={betAmount === 0.075} />
                <Numkey value={0.1} disabled={disableButtons} onChange={setBetAmount} selected={betAmount === 0.1} />
                <Numkey value={0.125} disabled={disableButtons} onChange={setBetAmount} selected={betAmount === 0.125} />
                <Numkey value={0.25} disabled={disableButtons} onChange={setBetAmount} selected={betAmount === 0.25} />
                <Numkey value={0.5} disabled={disableButtons} onChange={setBetAmount} selected={betAmount === 0.5} />
                <Numkey value={1} disabled={disableButtons} onChange={setBetAmount} selected={betAmount === 1} />
              </div>
              <div className={styles.buttons}>
                <PredictionKey
                  text="Heads"
                  value={Prediction.HEADS}
                  disabled={disableButtons}
                  onChange={setBetCall}
                  selected={prediction === Prediction.HEADS}
                />
                <PredictionKey
                  text="Tails"
                  value={Prediction.TAILS}
                  disabled={disableButtons}
                  onChange={setBetCall}
                  selected={prediction === Prediction.TAILS}
                />
              </div>
              <button className={font.className} onClick={onToss} disabled={disableTossButton}>
                Double or Nothing
              </button>
            </div>
          </div>

          <Footer />
        </div>

        <Social />
      </main>
    </>
  );
}

interface NumkeyProps {
  value: number;
  disabled: boolean;
  selected: boolean;
  onChange: any;
}

const Numkey = (props: NumkeyProps) => {
  const onClick = () => props.onChange(props.value);

  return (
    <button
      disabled={props.disabled}
      className={classNames(font.className, props.selected && styles.selected)}
      onClick={onClick}
    >
      {props.value}
    </button>
  );
};

interface PredictionKeyProps {
  value: Prediction;
  text: string;
  disabled: boolean;
  selected: boolean;
  onChange: any;
}

const PredictionKey = (props: PredictionKeyProps) => {
  const onClick = () => props.onChange(props.value);

  return (
    <button
      disabled={props.disabled}
      className={classNames(font.className, props.selected && styles.selected)}
      onClick={onClick}
    >
      {props.text}
    </button>
  );
};
