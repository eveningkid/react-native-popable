import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, ViewProps } from 'react-native';
import Caret from './Caret';
import { ANIMATION_DURATION } from './constants';
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
  caretStyle?: ViewProps['style'];
  children: string | React.ReactElement;
  forceInitialAnimation?: boolean;
  numberOfLines?: number;
  visible?: boolean;
  position?: 'top' | 'right' | 'bottom' | 'left';
} & ViewProps;

const Popover = React.forwardRef<View, PopoverProps>(function Popover(
  {
    animated = true,
    animationType = 'timing',
    backgroundColor,
    caret: withCaret = true,
    caretPosition = 'center',
    caretStyle = {},
    children,
    forceInitialAnimation = false,
    numberOfLines,
    visible = true,
    position = 'bottom',
    style,
    ...extraProps
  },
  ref
) {
  const isContentString = typeof children === 'string';
  const isHorizontalLayout = position === 'left' || position === 'right';
  const prevVisible = useRef(visible);
  const opacity = useRef(
    new Animated.Value(
      visible ? (forceInitialAnimation ? 0 : 1) : forceInitialAnimation ? 1 : 0
    )
  ).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation | undefined;

    if (animated) {
      if (visible && (!prevVisible.current || forceInitialAnimation)) {
        animation = Animated[animationType](opacity, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        });
      } else if (!visible && (prevVisible.current || forceInitialAnimation)) {
        animation = Animated[animationType](opacity, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        });
      }

      animation?.start();
    }

    prevVisible.current = visible;

    return () => animation?.stop();
  }, [visible]);

  const caret = (
    <Caret
      align={caretPosition}
      position={position}
      backgroundColor={backgroundColor}
      style={[styles.caret, caretStyle]}
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
        {withCaret && (position === 'bottom' || position === 'right') && caret}

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
});

const styles = StyleSheet.create({
  caret: {
    zIndex: 0,
  },
  container: {
    overflow: 'hidden',
    width: POPOVER_WIDTH,
  },
  containerHorizontal: {
    flexDirection: 'row',
  },
  content: {
    backgroundColor: POPOVER_BACKGROUND_COLOR,
    borderRadius: BORDER_RADIUS * 2,
    flex: 1,
    overflow: 'hidden',
    zIndex: 1,
  },
  contentText: {
    color: POPOVER_FONT_COLOR,
    fontSize: POPOVER_FONT_SIZE,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentTextOnly: {
    padding: POPOVER_PADDING,
  },
});

export default Popover;
