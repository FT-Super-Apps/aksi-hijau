/**
 * Input Component - Atomic Design
 * Reusable input field with consistent styling
 * @module components/atoms/Input
 */

import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_FAMILIES } from '../../constants/typography';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  helperText,
  leftIcon,
  rightIcon,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
          disabled && styles.inputContainerDisabled,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            multiline && styles.inputMultiline,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          {...props}
        />

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    color: '#374151',
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    marginBottom: 10,
    letterSpacing: -0.1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputContainerFocused: {
    borderColor: COLORS.PRIMARY,
    borderWidth: 1.5,
  },
  inputContainerError: {
    borderColor: COLORS.ERROR,
  },
  inputContainerDisabled: {
    backgroundColor: '#F9FAFB',
    opacity: 0.6,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: '#1F2937',
  },
  inputMultiline: {
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIcon: {
    paddingLeft: 12,
  },
  rightIcon: {
    paddingRight: 12,
  },
  errorText: {
    fontSize: 11,
    color: COLORS.ERROR,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginTop: 6,
    marginLeft: 4,
  },
  helperText: {
    fontSize: 11,
    color: '#6B7280',
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginTop: 6,
    marginLeft: 4,
  },
});

export default Input;
