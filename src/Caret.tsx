import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import type { PopoverProps } from './Popover';
import {
  POPOVER_BACKGROUND_COLOR,
  BORDER_RADIUS,
  CARET_SIDE_SIZE,
} from './style-guide';

export type CaretProps = {
  backgroundColor?: string;
  align: 'left' | 'center' | 'right';
  position: PopoverProps['position'];
  style?: ViewProps['style'];
};

export default ({ align, backgroundColor, position, style }: CaretProps) => {
  return (
    <View
      style={[
        styles.container,
        align === 'center' && styles.containerCenter,
        align === 'right' && styles.containerRight,
        !!backgroundColor && { backgroundColor },
        position === 'top' && styles.containerPositionTop,
        position === 'bottom' && styles.containerPositionBottom,
        position === 'left' && styles.containerPositionLeft,
        position === 'right' && styles.containerPositionRight,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARET_SIDE_SIZE,
    height: CARET_SIDE_SIZE,
    backgroundColor: POPOVER_BACKGROUND_COLOR,
    transform: [{ rotate: '45deg' }],
    borderRadius: BORDER_RADIUS,
  },
  containerPositionTop: {
    marginTop: (CARET_SIDE_SIZE / 2 + BORDER_RADIUS / 2) * -1,
    marginBottom: CARET_SIDE_SIZE / 2 + BORDER_RADIUS / 2,
  },
  containerPositionBottom: {
    marginBottom: (CARET_SIDE_SIZE / 2 + BORDER_RADIUS / 2) * -1,
    marginTop: CARET_SIDE_SIZE / 2 + BORDER_RADIUS / 2,
  },
  containerPositionLeft: {
    marginLeft: (CARET_SIDE_SIZE / 2 + BORDER_RADIUS / 2) * -1,
    marginRight: CARET_SIDE_SIZE / 2 + BORDER_RADIUS / 2,
  },
  containerPositionRight: {
    marginRight: (CARET_SIDE_SIZE / 2 + BORDER_RADIUS / 2) * -1,
    marginLeft: CARET_SIDE_SIZE / 2 + BORDER_RADIUS / 2,
  },
  containerCenter: {
    alignSelf: 'center',
  },
  containerRight: {
    alignSelf: 'flex-end',
  },
});
