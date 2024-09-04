import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import InputBox from '../../compoments/Forms/ImputBox';
import SubmitButton from '../../compoments/Forms/SubmitButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Login = ({ navigation }) => {
    const [state, setState] = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');

    const handleSubmit = async () => {
        try {
            setLoading(true);
            if (!email || !password || !selectedRole) {
                Alert.alert('Please fill all fields');
                setLoading(false);
                return;
            }
    
            const { data } = await axios.post('/Login', 
                { email, password, selectedRole }
            );
    
            if (data.login) {
                const authData = {
                    user: {
                        id: data.userId,
                        name: data.userName,
                        email: data.email,
                        role: data.role,
                    },
                    token: data.token,
                };
                await AsyncStorage.setItem('@auth', JSON.stringify(authData));
                setState(authData); // mettre à jour le contexte d'authentification
                navigation.navigate('Home');
            } else {
                Alert.alert('Login failed', data.message);
            }
    
            setLoading(false);
        } catch (error) {
            console.log("Login error:", error);
            Alert.alert('Error', 'Something went wrong, please try again');
            setLoading(false);
        }
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.pagepParking}>Parking Car</Text>
            <Text style={styles.pageTitle}>Login</Text>
            <View style={{ marginHorizontal: 20 }}>
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
                btnTitle="Login" 
                loading={loading} 
                handleSubmit={handleSubmit} 
            />
            <Text style={styles.linkText}>
                Not a user? Please{" "} 
                <Text 
                    style={styles.link} 
                    onPress={() => navigation.navigate("Signup")}
                >
                    SIGN UP
                </Text>
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
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1e225',
    },
    pagepParking: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
    },
    linkText: {
        textAlign: "center",
    },
    link: {
        color: "red",
    },
});

export default Login;
