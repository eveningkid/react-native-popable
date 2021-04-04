import React, { useEffect, useState } from 'react';
import {
  Modal,
  //@ts-ignore
  Pressable,
  StyleSheet,
} from 'react-native';
import { ANIMATION_DURATION } from '../constants';
import type { BackdropProps } from './Backdrop.d';

export default function Backdrop({
  children,
  onPress,
  visible,
}: BackdropProps) {
  const [delayedVisible, setDelayedVisible] = useState(visible);

  useEffect(() => {
    // When `Modal.visible` changes, the inner view gets hidden
    // immediately. This gives no time to `Popover` to animate
    // when `visible` becomes `false`. By delaying the `visible`
    // property, it gives extra time for the popover to animate,
    // then hide the modal
    if (visible) {
      setDelayedVisible(true);
    } else {
      setTimeout(() => setDelayedVisible(false), ANIMATION_DURATION);
    }
  }, [visible]);

  return (
    <Modal
      visible={delayedVisible}
      onRequestClose={onPress}
      hardwareAccelerated
      transparent
    >
      <Pressable onPress={onPress} style={styles.pressable}>
        {children}
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
});
