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

export default function Caret({
  align,
  backgroundColor,
  position,
  style,
}: CaretProps) {
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
}

const styles = StyleSheet.create({
  container: {
    // borderColor: "transparent",
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderWidth: CARET_SIDE_SIZE,
    height: CARET_SIDE_SIZE * 2,
    width: CARET_SIDE_SIZE * 2,
  },
  containerCenter: {
    alignSelf: 'center',
  },
  containerLeft: {},
  containerPositionBottom: {
    bottom: CARET_SIDE_SIZE / 2,
    marginBottom: (CARET_SIDE_SIZE / 2 + BORDER_RADIUS / 2) * -1,
    marginTop: CARET_SIDE_SIZE / 2 + BORDER_RADIUS / 2,
  },
  containerPositionLeft: {
    left: CARET_SIDE_SIZE / 2,
    marginLeft: (CARET_SIDE_SIZE / 2 + BORDER_RADIUS / 2) * -1,
    marginRight: CARET_SIDE_SIZE / 2 + BORDER_RADIUS / 2,
  },
  containerPositionRight: {
    marginLeft: CARET_SIDE_SIZE / 2 + BORDER_RADIUS / 2,
    marginRight: (CARET_SIDE_SIZE / 2 + BORDER_RADIUS / 2) * -1,
    right: CARET_SIDE_SIZE / 2,
  },
  containerPositionTop: {
    marginBottom: CARET_SIDE_SIZE / 2 + BORDER_RADIUS / 2,
    marginTop: (CARET_SIDE_SIZE / 2 + BORDER_RADIUS / 2) * -1,
    top: CARET_SIDE_SIZE / 2,
  },
  containerRight: {
    alignSelf: 'flex-end',
  },
});
