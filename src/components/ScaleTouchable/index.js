import React, { useCallback, Fragment, memo } from 'react'
import { TouchableOpacity, TouchableHighlight, Animated } from 'react-native'
import { Colors } from 'constants'
import { useMemoOne } from 'use-memo-one'

export interface ScaleTouchableProps {
  disabled?: boolean;
  onPress?: () => void;
  children?: any;
  style?: any;
  underlay?: boolean;
  underlayColor?: string;
  scale?: number;
  onLayout?: () => void;
}

const ScaleTouchable = ({
  disabled,
  onPress,
  children,
  style,
  underlay,
  underlayColor,
  scale = 0.95,
  ...rest
}: ScaleTouchableProps) => {
  const scaleInAnimated = useMemoOne(() => new Animated.Value(0), [])

  const SCALE = useMemoOne(
    () => ({
      // this defines the terms of our scaling animation.
      getScaleTransformationStyle(
        animated: Animated.Value,
        startSize: number = 1,
        endSize: number = scale,
      ) {
        const interpolation = animated.interpolate({
          inputRange: [0, 1],
          outputRange: [startSize, endSize],
        })
        return {
          transform: [{ scale: interpolation }],
        }
      },
      // This defines animation behavior we expect onPressIn
      pressInAnimation(animated: Animated.Value, duration: number = 100) {
        animated.setValue(0)
        Animated.timing(animated, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }).start()
      },
      // This defines animation behavior we expect onPressOut
      pressOutAnimation(animated: Animated.Value, duration: number = 100) {
        animated.setValue(1)
        Animated.timing(animated, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }).start()
      },
    }),
    [scale],
  )

  const handleOnPress = useCallback(() => {
    requestAnimationFrame(() => {
      onPress && onPress()
    })
  }, [onPress])

  const Component: any = useMemoOne(
    () =>
      underlay
        ? Animated.createAnimatedComponent(TouchableHighlight)
        : TouchableOpacity,
    [],
  )

  return (
    <Component
      hitSlop={{ top: 5, left: 5, bottom: 5, right: 5 }}
      underlayColor={underlayColor || Colors.white}
      activeOpacity={0.75}
      disabled={disabled}
      onPress={handleOnPress}
      onPressIn={() => {
        SCALE.pressInAnimation(scaleInAnimated)
      }}
      onPressOut={() => {
        SCALE.pressOutAnimation(scaleInAnimated)
      }}
      style={[
        style,
        SCALE.getScaleTransformationStyle(scaleInAnimated),
        disabled && { opacity: 0.8 },
      ]}
      {...rest}>
      <Fragment>{children}</Fragment>
    </Component>
  )
}

export default memo(ScaleTouchable)
