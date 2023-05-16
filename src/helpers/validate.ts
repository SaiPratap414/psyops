import { toast } from "react-hot-toast";
/**
 * Validats Staking/Withdrawal amount entered by user
 * @param  {string} amount
 * @returns boolean
 */
export function validateAmount(amount: string): boolean {
  if (!amount) {
    toast.error("Please enter an amount");
    return false;
  }

  if (amount === "0") {
    toast.error("Please enter a non zero value");
    return false;
  }

  if (parseFloat(amount) < 0) {
    toast.error("Please enter a positive integer");
    return false;
  }

  return true;
}
