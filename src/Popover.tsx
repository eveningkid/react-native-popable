import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, ViewProps } from 'react-native';
import Caret from './Caret';
import {
  POPOVER_BACKGROUND_COLOR,
  BORDER_RADIUS,
  POPOVER_FONT_COLOR,
  POPOVER_FONT_SIZE,
  POPOVER_PADDING,
  POPOVER_WIDTH,
} from './style-guide';

export type PopoverProps = {
  animated?: boolean;
  animationType?: 'spring' | 'timing';
  backgroundColor?: string;
  caret?: boolean;
  caretPosition?: 'left' | 'center' | 'right';
  children: string | React.ReactElement;
  numberOfLines?: number;
  visible?: boolean;
  position?: 'top' | 'right' | 'bottom' | 'left';
} & ViewProps;

export default React.forwardRef<View, PopoverProps>(
  (
    {
      animated = true,
      animationType = 'timing',
      backgroundColor,
      caret: withCaret = true,
      caretPosition = 'center',
      children,
      numberOfLines,
      visible = true,
      position = 'bottom',
      style,
      ...extraProps
    },
    ref
  ) => {
    const isContentString = typeof children === 'string';
    const isHorizontalLayout = position === 'left' || position === 'right';
    const prevVisible = useRef(visible);
    const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;

    useEffect(
      () => {
        let animation: Animated.CompositeAnimation | undefined;

        if (animated) {
          if (visible && !prevVisible.current) {
            animation = Animated[animationType](opacity, {
              toValue: 1,
              duration: 250,
              useNativeDriver: true,
            });
          } else if (!visible && prevVisible.current) {
            animation = Animated[animationType](opacity, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true,
            });
          }

          animation?.start();
        }

        prevVisible.current = visible;

        return () => animation?.stop();
      },
      [visible] // eslint-disable-line react-hooks/exhaustive-deps
    );

    const caret = (
      <Caret
        align={caretPosition}
        position={position}
        backgroundColor={backgroundColor}
        style={{ zIndex: 0 }}
      />
    );

    let animationTranslation: any;

    if (isHorizontalLayout) {
      animationTranslation = {
        translateX: opacity.interpolate({
          inputRange: [0, 1],
          outputRange: position === 'left' ? [5, 0] : [-5, 0],
        }),
      };
    } else {
      animationTranslation = {
        translateY: opacity.interpolate({
          inputRange: [0, 1],
          outputRange: position === 'top' ? [5, 0] : [-5, 0],
        }),
      };
    }

    return (
      <View
        ref={ref}
        style={[styles.container, style]}
        pointerEvents={visible ? 'auto' : 'none'}
        {...extraProps}
      >
        <Animated.View
          style={[
            { opacity, transform: [animationTranslation] },
            isHorizontalLayout && styles.containerHorizontal,
          ]}
        >
          {withCaret &&
            (position === 'bottom' || position === 'right') &&
            caret}

          <View
            style={[
              styles.content,
              isContentString && styles.contentTextOnly,
              !!backgroundColor && { backgroundColor },
            ]}
          >
            {isContentString ? (
              <Text numberOfLines={numberOfLines} style={styles.contentText}>
                {children}
              </Text>
            ) : (
              children
            )}
          </View>

          {withCaret && (position === 'top' || position === 'left') && caret}
        </Animated.View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: POPOVER_WIDTH,
    overflow: 'hidden',
  },
  containerHorizontal: {
    flexDirection: 'row',
  },
  content: {
    zIndex: 1,
    backgroundColor: POPOVER_BACKGROUND_COLOR,
    borderRadius: BORDER_RADIUS * 2,
    overflow: 'hidden',
  },
  contentTextOnly: {
    padding: POPOVER_PADDING,
  },
  contentText: {
    color: POPOVER_FONT_COLOR,
    fontSize: POPOVER_FONT_SIZE,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
