import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  // @ts-ignore
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
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
  hidesOnOutsidePress?: boolean;
  numberOfLines?: PopoverProps['numberOfLines'];
  onAction?: (visible: boolean) => void;
  position?: PopoverProps['position'];
  strictPosition?: boolean;
  style?: PopoverProps['style'];
  visible?: boolean;
};

const DEFAULT_LAYOUT = {
  width: 0,
  height: 0,
  x: 0,
  y: 0,
};

const Popable = ({
  action = 'press',
  animated,
  animationType,
  backgroundColor,
  children,
  caret,
  caretPosition,
  content,
  hidesOnOutsidePress = true,
  numberOfLines,
  onAction,
  position = 'top',
  strictPosition = false,
  style,
  visible,
}: PropableProps) => {
  const dimensions = useWindowDimensions();
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [popoverOffset, setPopoverOffset] = useState({ left: 0, top: 0 });
  const [popoverLayout, setPopoverLayout] = useState(DEFAULT_LAYOUT);
  const [childrenLayout, setChildrenLayout] = useState(DEFAULT_LAYOUT);
  const [computedPosition, setComputedPosition] = useState(position);
  const isInteractive = typeof visible === 'undefined';
  const childrenRef = useRef<View>(null);
  const popoverRef = useRef<View>(null);

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

  const handlePopoverLayout = useCallback(() => {
    popoverRef.current?.measureInWindow((x, y, width, height) => {
      setPopoverLayout({ x, y, width, height });
    });
  }, [popoverRef]);

  const handleChildrenLayout = useCallback(() => {
    childrenRef.current?.measureInWindow((x, y, width, height) => {
      setChildrenLayout({ x, y, width, height });
    });
  }, [childrenRef]);

  useEffect(() => {
    let nextPosition = position;

    if (!strictPosition) {
      switch (position) {
        case 'left':
          if (popoverLayout.x <= 0) {
            nextPosition = 'right';
          }
          break;

        case 'right':
          if (popoverLayout.x + popoverLayout.width > dimensions.width) {
            nextPosition = 'left';
          }
          break;

        case 'top':
          if (popoverLayout.y <= 0) {
            nextPosition = 'bottom';
          }
          break;

        case 'bottom':
          if (popoverLayout.y + popoverLayout.height >= dimensions.height) {
            nextPosition = 'top';
          }
          break;
      }
    }

    setComputedPosition(nextPosition);
  }, [position, strictPosition, popoverLayout, childrenLayout, dimensions]);

  useEffect(() => {
    let left = 0;
    let top = 0;

    switch (computedPosition) {
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
  }, [computedPosition, popoverLayout, childrenLayout]);

  useEffect(() => {
    if (!hidesOnOutsidePress) {
      return;
    }

    const handler = (event: any) => {
      if (
        // @ts-ignore
        !popoverRef.current.contains(event.target) &&
        // @ts-ignore
        !childrenRef.current.contains(event.target) &&
        isInteractive &&
        popoverVisible
      ) {
        setPopoverVisible(false);
      }
    };

    // @ts-ignore
    document.addEventListener('mousedown', handler);

    // @ts-ignore
    return () => document.removeEventListener('mousedown', handler);
  }, [
    hidesOnOutsidePress,
    isInteractive,
    popoverVisible,
    popoverRef,
    childrenRef,
  ]);

  return (
    <View style={styles.container}>
      <Popover
        ref={popoverRef}
        animated={animated}
        animationType={animationType}
        backgroundColor={backgroundColor}
        caret={caret}
        caretPosition={caretPosition}
        numberOfLines={numberOfLines}
        onLayout={handlePopoverLayout}
        position={computedPosition}
        visible={isInteractive ? popoverVisible : visible}
        style={[
          computedPosition === 'top' && styles.popoverTop,
          computedPosition === 'bottom' && styles.popoverBottom,
          computedPosition === 'left' && {
            alignItems: 'flex-end',
            right: childrenLayout.width,
          },
          computedPosition === 'right' && { left: childrenLayout.width },
          {
            position: 'absolute',
            transform: [
              { translateX: popoverOffset.left * -1 },
              { translateY: popoverOffset.top * -1 },
            ],
          },
          style,
        ]}
      >
        {content}
      </Popover>

      <Pressable
        ref={childrenRef}
        onLayout={handleChildrenLayout}
        {...handlers}
      >
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

export default Popable;
