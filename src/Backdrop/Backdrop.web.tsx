import { useEffect } from 'react';
import type { BackdropProps } from './Backdrop.d';

export default function Backdrop({
  childrenRef,
  onPress,
  popoverRef,
  visible,
}: BackdropProps) {
  useEffect(() => {
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
  }, [visible, onPress, popoverRef, childrenRef]);

  return null;
}
