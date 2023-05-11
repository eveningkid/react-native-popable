import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Platform,
  // @ts-ignore
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewProps,
} from 'react-native';
import Backdrop from './Backdrop';
import Popover, { PopoverProps } from './Popover';
import type { PopableManager } from './use-popable/types';

export type PopableProps = {
  action?: 'press' | 'longpress' | 'hover';
  animated?: PopoverProps['animated'];
  animationType?: PopoverProps['animationType'];
  backgroundColor?: PopoverProps['backgroundColor'];
  caret?: PopoverProps['caret'];
  caretPosition?: PopoverProps['caretPosition'];
  caretStyle?: ViewProps['style'];
  children: any;
  content: PopoverProps['children'];
  numberOfLines?: PopoverProps['numberOfLines'];
  onAction?: (visible: boolean) => void;
  position?: PopoverProps['position'];
  strictPosition?: boolean;
  style?: PopoverProps['style'];
  visible?: boolean;
  wrapperStyle?: ViewProps['style'];
  manualPopupPosition?: {
    left: number;
    top: number;
  };
};

const DEFAULT_LAYOUT = {
  width: 0,
  height: 0,
  x: 0,
  y: 0,
};

const Popable = forwardRef<PopableManager, PopableProps>(function Popable(
  {
    action = 'press',
    animated,
    animationType,
    backgroundColor,
    children,
    caret,
    caretPosition,
    caretStyle,
    content,
    numberOfLines,
    onAction,
    position = 'top',
    strictPosition = false,
    style,
    visible,
    wrapperStyle,
    manualPopupPosition = {
      left: 0,
      top: 0,
    },
  },
  ref
) {
  const dimensions = useWindowDimensions();
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [popoverOffset, setPopoverOffset] = useState({ left: 0, top: 0 });
  const [popoverLayout, setPopoverLayout] = useState(DEFAULT_LAYOUT);
  const [popoverPagePosition, setPopoverPagePosition] = useState({
    left: 0,
    top: 0,
  });
  const [childrenLayout, setChildrenLayout] = useState(DEFAULT_LAYOUT);
  const [computedPosition, setComputedPosition] = useState(position);
  const isInteractive = typeof visible === 'undefined';
  const isPopoverVisible = useMemo(() => {
    return isInteractive ? popoverVisible : visible;
  }, [isInteractive, popoverVisible, visible]);
  const childrenRef = useRef<View>(null);
  const popoverRef = useRef<View>(null);

  useImperativeHandle(ref, () => ({
    show: () => {
      popoverRef.current?.measureInWindow((_x, _y, _width, _height) => {
        setPopoverPagePosition({ left: _x, top: _y });
      });
      setPopoverVisible(true);
    },
    hide: () => setPopoverVisible(false),
  }));

  const handlers: { [prop: string]: () => void } = {};

  if (isInteractive) {
    if (action === 'hover' && Platform.OS === 'web') {
      handlers.onHoverIn = () => {
        setPopoverVisible(true);
        onAction?.(true);
      };

      handlers.onHoverOut = () => {
        setPopoverVisible(false);
        onAction?.(false);
      };
    } else if (
      action === 'press' ||
      (action === 'hover' && Platform.OS !== 'web')
    ) {
      handlers.onPress = () => {
        if (!visible) {
          popoverRef.current?.measureInWindow((_x, _y, _width, _height) => {
            setPopoverPagePosition({ left: _x, top: _y });
          });
        }

        onAction?.(!visible);
        if (!ref) {
          setPopoverVisible(!visible);
        }
      };
    } else {
      handlers.onLongPress = () => {
        onAction?.(!visible);
        setPopoverVisible(!visible);
      };
    }
  }

  const handleHidePopover = useCallback(() => {
    setPopoverVisible(false);
    onAction?.(false);
  }, [onAction]);

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

  const sharedPopoverProps = {
    animated,
    animationType,
    backgroundColor,
    caret,
    caretPosition,
    caretStyle,
    children: content,
    numberOfLines,
    position: computedPosition,
  };

  return (
    <View style={[styles.container, wrapperStyle]}>
      <Backdrop
        visible={isInteractive && popoverVisible}
        onPress={handleHidePopover}
        popoverRef={popoverRef}
        childrenRef={childrenRef}
      >
        {
          // Backdrop renders the same popover because:
          // since the backdrop adds a layer on top of the screen to
          // detect any "outside popover press", the inner popover becomes
          // unreachable: the upper layer would keep all the touch events.
          // Because the backdrop uses a modal as a layer, we render that
          // same popover inside the modal, and hide the initial one
          // underneath (which explains why the popover below this one has
          // `visible` set to `false`)
          Platform.OS !== 'web' && (
            <Popover
              {...sharedPopoverProps}
              forceInitialAnimation
              visible={isPopoverVisible}
              style={[
                {
                  position: 'absolute',
                  transform: [
                    {
                      translateX:
                        popoverPagePosition.left + manualPopupPosition.left,
                    },
                    {
                      translateY:
                        popoverPagePosition.top + manualPopupPosition.top,
                    },
                  ],
                },
                style,
              ]}
            />
          )
        }
      </Backdrop>

      <Popover
        ref={popoverRef}
        {...sharedPopoverProps}
        onLayout={() => {
          setTimeout(() => {
            handlePopoverLayout();
          }, 100);
        }}
        visible={Platform.OS === 'web' ? isPopoverVisible : false}
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
      />

      <Pressable
        ref={childrenRef}
        onLayout={() => {
          setTimeout(() => {
            handleChildrenLayout();
          }, 100);
        }}
        {...handlers}
      >
        {children}
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
  },
  popoverBottom: {
    top: '100%',
  },
  popoverTop: {
    bottom: '100%',
  },
});

export default Popable;
