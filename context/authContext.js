import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Créer le contexte
const AuthContext = createContext();

// Provider
const AuthProvider = ({ children }) => {
    // État global
    const [state, setState] = useState({
        user: null,
        token: "",
    });

    // Configuration par défaut d'axios
    axios.defaults.baseURL = 'http://172.20.10.2:3001';

    // Chargement des données du stockage local
    useEffect(() => {
        const loadLocalStorageData = async () => {
            let data = await AsyncStorage.getItem('@auth');
            if (data) {
                let loginData = JSON.parse(data);
                setState(prevState => ({
                    ...prevState,
                    user: loginData.user,
                    token: loginData.token
                }));
            }
        };
        loadLocalStorageData();
    }, []);

    return (
        <AuthContext.Provider value={[state, setState]}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
