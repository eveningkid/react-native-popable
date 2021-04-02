import { useEffect } from 'react';
import type { BackdropProps } from './Backdrop.d';

export default function Backdrop({
  childrenRef,
  enabled,
  onPress,
  popoverRef,
  visible,
}: BackdropProps) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handler = (event: any) => {
      if (
        // @ts-ignore
        !popoverRef.current.contains(event.target) &&
        // @ts-ignore
        !childrenRef.current.contains(event.target) &&
        visible
      ) {
        onPress();
      }
    };

    // @ts-ignore
    document.addEventListener('mousedown', handler);

    // @ts-ignore
    return () => document.removeEventListener('mousedown', handler);
  }, [enabled, visible, onPress, popoverRef, childrenRef]);

  return null;
}
