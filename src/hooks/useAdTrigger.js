import { useCallback, useEffect, useRef } from 'react';

const getNextTrigger = () => (Math.random() < 0.5 ? 5 : 6);

function useAdTrigger(onThresholdReached) {
  const clickCountRef = useRef(0);
  const nextTriggerRef = useRef(getNextTrigger());

  const resetCounter = useCallback(() => {
    clickCountRef.current = 0;
    nextTriggerRef.current = getNextTrigger();
  }, []);

  const registerInteraction = useCallback(() => {
    clickCountRef.current += 1;

    if (clickCountRef.current >= nextTriggerRef.current) {
      onThresholdReached();
      resetCounter();
    }
  }, [onThresholdReached, resetCounter]);

  useEffect(() => {
    return () => {
      resetCounter();
    };
  }, [resetCounter]);

  return { registerInteraction, resetCounter };
}

export default useAdTrigger;
