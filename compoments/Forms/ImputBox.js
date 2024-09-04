import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'

const InputBox = ({ 
    inputTitle,
    autoComplete,
    keyboardType,
    secureTextEntry = false,
    value,
    setValue
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{inputTitle}</Text>
      <TextInput 
        style={styles.inputBox}
        autoCorrect={false}
        keyboardType={keyboardType}
        autoComplete={autoComplete}
        secureTextEntry={secureTextEntry} 
        value={value}
        onChangeText={(text) => setValue(text)}
        placeholder={`Enter ${inputTitle}`}
        placeholderTextColor="#b0b0b0"
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 15,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    inputBox: {
        height: 45,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        paddingLeft: 15,
        color: '#333',
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
});

export default InputBox;
