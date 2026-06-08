import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
  useColorScheme,
} from 'react-native';
import { Colors } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  const isDark = scheme === 'dark';

  const handlePress = () => {
    if (!loading && !disabled) {
      onPress();
    }
  };

  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...styles[size],
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: '#208AEF', // Primary blue accent
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: themeColors.backgroundElement,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: isDark ? '#2E3135' : '#E0E1E6',
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
    }
  };

  const getTextColorStyles = (): TextStyle => {
    switch (variant) {
      case 'primary':
        return { color: '#ffffff' };
      case 'secondary':
        return { color: themeColors.text };
      case 'outline':
        return { color: themeColors.text };
      case 'ghost':
        return { color: '#208AEF' };
    }
  };

  const buttonStyle = getButtonStyles();
  const textColorStyle = getTextColorStyles();

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        buttonStyle,
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'primary' ? '#ffffff' : '#208AEF'} />
      ) : (
        <Text style={[styles.text, styles[`${size}Text`], textColorStyle, textStyle]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    height: 38,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    height: 48,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    height: 56,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
});
export default Button;
