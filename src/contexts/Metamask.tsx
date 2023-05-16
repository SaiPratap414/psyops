"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import useForceUpdate from "../hooks/useForceUpdate";
import usePersistentToast from "../hooks/usePersistentToast";

import Web3 from "../helpers/web3";
import { allowedChains } from "../config";
import useSwitch from "@/hooks/useSwitch";

var ethereum: any;
if (typeof window !== "undefined") {
  ethereum = (window as any).ethereum;
}

const WalletContext = createContext({
  account: "",
  balance: "0",
  connect: () => {},
  disconnect: () => {},
  switchChain: () => {},
  isConnectedToAllowedNetwork: false,
  refresh: {
    rerender: () => {},
    triggerValue: 0,
  },
});

export const useMetamask = () => useContext(WalletContext);

const checkIfConnectedToAllowedNetwork = async () => {
  const chainId = parseInt(await ethereum?.request({ method: "eth_chainId" }));
  return !(allowedChains.length > 0 && !allowedChains.find((chain) => chain.id === chainId));
};

const WalletContextProvider = ({ children }: any) => {
  const forceUpdate = useForceUpdate();
  const isConnectedToAllowedNetwork = useSwitch(true);

  const persistentSwitchChainToast = usePersistentToast("Please connect to one of the supported chains", "error");
  const persistentWeb3BrowserToast = usePersistentToast("Ensure you are using a Web3 enabled browser", "error");

  const [account, setAccount] = useState<string>("");
  const [balance, setBalance] = useState<string>("0");

  const connect = async () => {
    if (!Web3.isEnabledInBrowser()) return persistentWeb3BrowserToast.trigger();

    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);

      const balance = await Web3.instance.eth.getBalance(accounts[0]);
      setBalance(parseFloat(Web3.instance.utils.fromWei(balance, "ether")).toFixed(3));
    } catch (e: any) {
      switch (e.code) {
        case 4001:
          toast("Please connect to Metamask");
          break;
        case -32002:
          toast("Please open Metamask");
          break;
      }
    }
  };

  const disconnect = () => {
    setAccount("");
    setBalance("0");
    forceUpdate.rerender();
  };

  const refresh = async () => {
    forceUpdate.rerender();
    if (await checkIfConnectedToAllowedNetwork()) {
      isConnectedToAllowedNetwork.true();
      return persistentSwitchChainToast.dismiss();
    }
    isConnectedToAllowedNetwork.false();
    persistentSwitchChainToast.trigger();
  };

  const chainsChanged = async () => {
    refresh();

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const balance = await Web3.instance.eth.getBalance(accounts[0]);
    setBalance(parseFloat(Web3.instance.utils.fromWei(balance, "ether")).toFixed(3));
  };

  const switchChain = async () => {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x66eed" }],
      });
    } catch (e: any) {
      switch (e.code) {
        case 4902:
        case 4001:
          toast.error("Something went wrong");
          break;

        case -32002:
          toast.error("Please open Metamask");
          break;
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!Web3.isEnabledInBrowser()) return persistentWeb3BrowserToast.trigger();
      if (!(await checkIfConnectedToAllowedNetwork())) {
        isConnectedToAllowedNetwork.false();
        persistentSwitchChainToast.trigger();
      }

      ethereum.on("connect", connect);
      ethereum.on("chainChanged", chainsChanged);
      ethereum.on("accountsChanged", (accounts: string[]) => setAccount(accounts[0] || ""));
      ethereum.on("disconnect", disconnect);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    account,
    balance,
    connect,
    disconnect,
    switchChain,
    isConnectedToAllowedNetwork: isConnectedToAllowedNetwork.value,
    refresh: { rerender: refresh, triggerValue: forceUpdate.triggerValue },
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export default WalletContextProvider;
