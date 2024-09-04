import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

const SubmitButton = ({handleSubmit, btnTitle, loading }) => {
  return (
    <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
      <Text style={styles.BtnText}>
        { loading ? "please wait..." : btnTitle} </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    submitBtn: {
        backgroundColor: "#1e2225",
        height: 50,
        marginHorizontal: 25,
        borderRadius: 80,
        justifyContent: "center",
        marginBottom: 20,
    },
    BtnText: {
        color: "#ffffff",
        textAlign: "center",
        fontSize: 24,
        fontWeight: "400",
    },
});

export default SubmitButton;