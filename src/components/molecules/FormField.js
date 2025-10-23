/**
 * FormField Molecule - Atomic Design
 * Complete form field with label, input, and error message
 * @module components/molecules/FormField
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from '../atoms';
import { FONT_FAMILIES } from '../../constants/typography';

const FormField = ({
  label,
  required = false,
  error,
  helpText,
  style,
  ...inputProps
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}

      <Input
        error={!!error}
        {...inputProps}
      />

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {helpText && !error && (
        <Text style={styles.helpText}>{helpText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    color: '#374151',
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    letterSpacing: -0.2,
  },
  required: {
    color: '#EF4444',
  },
  errorText: {
    fontSize: 11,
    color: '#EF4444',
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginTop: 4,
    marginLeft: 2,
  },
  helpText: {
    fontSize: 11,
    color: '#6B7280',
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginTop: 4,
    marginLeft: 2,
  },
});

export default FormField;
