import type { ReactNode, RefObject } from 'react';
import type { View } from 'react-native';

export type BackdropProps = {
  children?: ReactNode;
  childrenRef: RefObject<View>;
  onPress: () => void;
  popoverRef: RefObject<View>;
  visible: boolean;
};
