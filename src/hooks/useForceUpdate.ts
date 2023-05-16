import { useState } from 'react';

export default function useForceUpdate() {
  const [triggerValue, setTriggerValue] = useState(0);
  const rerender = () => setTriggerValue((value) => ++value);
  return { rerender, triggerValue };
}
