import React, { useCallback, useEffect, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import Popover, { PopoverProps } from './Popover';

export type PropableProps = {
  action?: 'press' | 'longpress' | 'hover';
  animated?: PopoverProps['animated'];
  animationType?: PopoverProps['animationType'];
  backgroundColor?: PopoverProps['backgroundColor'];
  caret?: PopoverProps['caret'];
  caretPosition?: PopoverProps['caretPosition'];
  children: any;
  content: PopoverProps['children'];
  numberOfLines?: PopoverProps['numberOfLines'];
  onAction?: (visible: boolean) => void;
  position?: PopoverProps['position'];
  style?: PopoverProps['style'];
  visible?: boolean;
};

export default ({
  action = 'press',
  animated,
  animationType,
  backgroundColor,
  children,
  caret,
  caretPosition,
  content,
  numberOfLines,
  onAction,
  position = 'top',
  style,
  visible,
}: PropableProps) => {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [popoverOffset, setPopoverOffset] = useState({ left: 0, top: 0 });
  const [popoverLayout, setPopoverLayout] = useState({ width: 0, height: 0 });
  const [childrenLayout, setChildrenLayout] = useState({ width: 0, height: 0 });
  const isInteractive = typeof visible === 'undefined';

  const handlers: { [prop: string]: () => void } = {};

  if (isInteractive) {
    if (action === 'hover') {
      handlers.onHoverIn = () => {
        setPopoverVisible(true);
        onAction?.(true);
      };

      handlers.onHoverOut = () => {
        setPopoverVisible(false);
        onAction?.(false);
      };
    } else if (action === 'press') {
      handlers.onPress = () => {
        setPopoverVisible((visible) => {
          onAction?.(!visible);
          return !visible;
        });
      };
    } else {
      handlers.onLongPress = () => {
        setPopoverVisible((visible) => {
          onAction?.(!visible);
          return !visible;
        });
      };
    }
  }

  const handlePopoverLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setPopoverLayout({ width, height });
  }, []);

  const handleChildrenLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setChildrenLayout({ width, height });
  }, []);

  useEffect(() => {
    let left = 0;
    let top = 0;

    switch (position) {
      case 'right':
      case 'left':
        top = (popoverLayout.height - childrenLayout.height) / 2;
        break;

      case 'top':
      case 'bottom':
        left = (popoverLayout.width - childrenLayout.width) / 2;
        break;
    }

    setPopoverOffset({ left, top });
  }, [childrenLayout, popoverLayout, position]);

  return (
    <View style={styles.container}>
      <Popover
        animated={animated}
        animationType={animationType}
        backgroundColor={backgroundColor}
        caret={caret}
        caretPosition={caretPosition}
        numberOfLines={numberOfLines}
        onLayout={handlePopoverLayout}
        position={position}
        visible={isInteractive ? popoverVisible : visible}
        style={[
          position === 'top' && styles.popoverTop,
          position === 'bottom' && styles.popoverBottom,
          position === 'left' && {
            alignItems: 'flex-end',
            right: childrenLayout.width,
          },
          position === 'right' && { left: childrenLayout.width },
          {
            position: 'absolute',
            marginLeft: popoverOffset.left * -1,
            marginTop: popoverOffset.top * -1,
          },
          style,
        ]}
      >
        {content}
      </Popover>

      <Pressable onLayout={handleChildrenLayout} {...handlers}>
        {children}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
  },
  popoverTop: {
    bottom: '100%',
  },
  popoverBottom: {
    top: '100%',
  },
});
