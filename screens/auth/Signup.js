import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import InputBox from '../../compoments/Forms/ImputBox';
import SubmitButton from '../../compoments/Forms/SubmitButton';
import axios from 'axios';

const Signup = ({ navigation }) => {
    // state
    const [username, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(''); // Valeur par défaut

    //btn function
    const handleSubmit = async () => {
        try {
            setLoading(true);
            if (!username || !email || !password || !selectedRole) {
                Alert.alert('Please fill all fields');
                setLoading(false);
                return;
            }
            const { data } = await axios.post('/Signup', 
                { username, email, password, selectedRole }
            );
            alert(data && data.message);
            navigation.navigate('Login'),
            console.log('Sign up Data==>', { username, email, password, selectedRole });
            
            // Clear the form
            setName('');
            setEmail('');
            setPassword('');
            setSelectedRole(''); // Reset to default value

            setLoading(false);
        } catch (error) {
            alert(error.response.data.message);
            setLoading(false);
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>Sign up</Text>
            <View style={{ marginHorizontal: 20 }}>
                <InputBox 
                    inputTitle={'Name'} 
                    value={username} 
                    setValue={setName} 
                />
                <InputBox 
                    inputTitle={'Email'} 
                    keyboardType="email-address" 
                    autoComplete="email" 
                    value={email}
                    setValue={setEmail}
                />
                <InputBox 
                    inputTitle={'Password'} 
                    secureTextEntry={true} 
                    autoComplete="password" 
                    value={password}
                    setValue={setPassword}
                />
                <Text>ROLE</Text>
                <Picker
                    selectedValue={selectedRole}
                    onValueChange={(itemValue) => setSelectedRole(itemValue)}
                    style={{ width: '100%', height: 40, marginBottom: 10 }}
                >
                    <Picker.Item label="Customer" value="customer" />
                    <Picker.Item label="Manager" value="manager" />
                </Picker>
            </View>
            <SubmitButton 
                btnTitle="Sign up" 
                loading={loading} 
                handleSubmit={handleSubmit} 
            />
            <Text style={styles.linkText}>You are already a user?{" "}
                <Text 
                    style={styles.link}
                    onPress={() => navigation.navigate("Login")}
                >
                    LOGIN
                </Text>{" "}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#e1d5c9',
    },
    pageTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1e225',
    },
    linkText: {
        textAlign: "center",
    },
    link: {
        color: "red",
    },
});

export default Signup;
