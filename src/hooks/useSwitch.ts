import { useState } from "react";

/**
 * @param  {boolean} initalState=false
 */
export default function useSwitch(initalState = false) {
  const [value, setValue] = useState(initalState);
  const on = () => setValue(true);
  const off = () => setValue(false);
  const toggle = () => setValue((value) => !value);
  const set = (v: boolean) => setValue(v);
  return { value, true: on, false: off, toggle, set };
}
