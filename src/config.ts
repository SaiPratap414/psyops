// abis
import { abi as RandomizerABI } from "./abis/randomizer.json";
import { abi as FlipABI } from "./abis/flip.json";

// types

import { AllowedChainConfig, ContractConfig } from "./types/config";
import { Randomizer } from "./types/Randomizer";
import { Flip } from "./types";

export const allowedChains: AllowedChainConfig[] = [{ id: 421613, name: "Arbitrum Goreli" }];

export const ContractAddress = {
  Randomizer: "0x923096Da90a3b60eb7E12723fA2E1547BA9236Bc",
  Flip: "0x9175Ab2f874aD48ECaB112D2ACC7eC8779b5487C",
};

export const contracts: ContractConfig[] = [
  { name: "Randomizer", abi: RandomizerABI, address: ContractAddress.Randomizer },
  { name: "Flip", abi: FlipABI, address: ContractAddress.Flip },
];

export interface ContractInstances {
  Randomizer: Randomizer;
  Flip: Flip;
}
