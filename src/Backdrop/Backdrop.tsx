import React from 'react';
import {
  Modal,
  //@ts-ignore
  Pressable,
  StyleSheet,
} from 'react-native';
import type { BackdropProps } from './Backdrop.d';

export default function Backdrop({ enabled, onPress, visible }: BackdropProps) {
  if (!enabled) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      onRequestClose={onPress}
      hardwareAccelerated
      transparent
    >
      <Pressable onPress={onPress} style={styles.pressable} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
});
