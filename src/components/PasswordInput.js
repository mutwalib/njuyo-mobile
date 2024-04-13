import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TextInput as Input } from 'react-native-paper';
import Icon from '../consts/Icon';
import { theme } from '../core/theme';

export default function PasswordInput({ errorText, description, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          style={styles.input}
          selectionColor={theme.colors.primary}
          underlineColor="transparent"
          mode="outlined"
          secureTextEntry={!showPassword}
          {...props}
        />
        <TouchableOpacity
          style={styles.showHideButton}
          onPress={handleShowClick}
        >
          <Icon
            type="fa"
            name={showPassword ? 'eye-slash' : 'eye'}
            size={24}
            color="#000"
          />
        </TouchableOpacity>
      </View>
      {description && !errorText ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.placeholder,
    borderRadius: 4,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    color: theme.colors.text,
  },
  showHideButton: {
    padding: 10,
  },
  description: {
    fontSize: 13,
    color: theme.colors.secondary,
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingTop: 8,
  },
});
