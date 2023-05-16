import Web3 from "./web3";
import { contracts, ContractInstances } from "../config";

export default class Contracts {
  private static _instances: ContractInstances;

  public static get instances(): ContractInstances {
    if (Contracts._instances) return Contracts._instances;

    const web3 = Web3.instance;
    const ContractInstances: any = {};
    contracts.forEach((contract: any) => {
      ContractInstances[contract.name] = new web3.eth.Contract(contract.abi as any, contract.address);
    });
    Contracts._instances = ContractInstances;
    return Contracts._instances;
  }

  /**
   * Manual Override
   */
  public static set instances(value: ContractInstances) {
    Contracts._instances = value;
  }
}
