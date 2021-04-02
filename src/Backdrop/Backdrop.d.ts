import type { RefObject } from 'react';
import type { View } from 'react-native';

export type BackdropProps = {
  enabled: boolean;
  visible: boolean;
  onPress: () => void;
  popoverRef: RefObject<View>;
  childrenRef: RefObject<View>;
};
