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
        align === 'left' && styles.containerLeft,
        align === 'center' && styles.containerCenter,
        align === 'right' && styles.containerRight,
        // !!backgroundColor && { borderColor: backgroundColor },
        position === 'top' && styles.containerPositionTop,
        position === 'bottom' && styles.containerPositionBottom,
        position === 'left' && styles.containerPositionLeft,
        position === 'right' && styles.containerPositionRight,
        position === 'top' && {
          borderTopColor: backgroundColor ?? POPOVER_BACKGROUND_COLOR,
        },
        position === 'bottom' && {
          borderBottomColor: backgroundColor ?? POPOVER_BACKGROUND_COLOR,
        },
        position === 'left' && {
          borderLeftColor: backgroundColor ?? POPOVER_BACKGROUND_COLOR,
        },
        position === 'right' && {
          borderRightColor: backgroundColor ?? POPOVER_BACKGROUND_COLOR,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARET_SIDE_SIZE * 2,
    height: CARET_SIDE_SIZE * 2,
    borderWidth: CARET_SIDE_SIZE,
    // borderColor: "transparent",
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  containerPositionTop: {
    marginTop: (CARET_SIDE_SIZE / 2 + BORDER_RADIUS / 2) * -1,
    marginBottom: CARET_SIDE_SIZE / 2 + BORDER_RADIUS / 2,
    top: CARET_SIDE_SIZE / 2 + 1,
  },
  containerPositionBottom: {
    marginBottom: (CARET_SIDE_SIZE / 2 + BORDER_RADIUS / 2) * -1,
    marginTop: CARET_SIDE_SIZE / 2 + BORDER_RADIUS / 2,
    bottom: CARET_SIDE_SIZE / 2 + 1,
  },
  containerPositionLeft: {
    marginLeft: (CARET_SIDE_SIZE / 2 + BORDER_RADIUS / 2) * -1,
    marginRight: CARET_SIDE_SIZE / 2 + BORDER_RADIUS / 2,
    left: CARET_SIDE_SIZE / 2 + 1,
  },
  containerPositionRight: {
    marginRight: (CARET_SIDE_SIZE / 2 + BORDER_RADIUS / 2) * -1,
    marginLeft: CARET_SIDE_SIZE / 2 + BORDER_RADIUS / 2,
    right: CARET_SIDE_SIZE / 2 + 1,
  },
  containerLeft: {},
  containerCenter: {
    alignSelf: 'center',
  },
  containerRight: {
    alignSelf: 'flex-end',
  },
});
