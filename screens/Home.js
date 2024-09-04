import React, { useContext, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/authContext';

// Import your screens
import AddParkingScreen from './AddParkingScreen';
import ParkingsScreen from './ParkingsScreen';
import ProfileScreen from './ProfileScreen';

const Drawer = createDrawerNavigator();

const HomeScreen = () => {
    const [state] = useContext(AuthContext);

    useEffect(() => {
        console.log('État global:', state);
        if (state?.user) {
            console.log('Utilisateur authentifié:', state.user);
            console.log('Rôle de l\'utilisateur:', state.user.role);
        } else {
            console.log('Aucun utilisateur authentifié.');
        }
    }, [state]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Parking Management</Text>
        </View>
    );
};

const Home = () => {
    const [state] = useContext(AuthContext);
    const userRole = state?.user?.role;

    return (
        <Drawer.Navigator initialRouteName="HomeScreen">
            <Drawer.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            {userRole === 'manager' && (
                <>
                    <Drawer.Screen
                        name="AddParking"
                        component={AddParkingScreen}
                        options={{
                            title: 'Créer un parking',
                            drawerIcon: ({ color, size }) => (
                                <Ionicons name="car-outline" size={size} color={color} />
                            ),
                        }}
                    />
                    <Drawer.Screen
                        name="Parkings"
                        component={ParkingsScreen}
                        options={{
                            title: 'Mon Parking',
                            drawerIcon: ({ color, size }) => (
                                <Ionicons name="business-outline" size={size} color={color} />
                            ),
                        }}
                    />
                </>
            )}
            {userRole === 'customer' && (
                <Drawer.Screen
                    name="Parkings"
                    component={ParkingsScreen}
                    options={{
                        title: 'Parkings',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="business-outline" size={size} color={color} />
                        ),
                    }}
                />
            )}
            <Drawer.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'Mon Profil',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
        </Drawer.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
        textAlign: 'center',
    },
});

export default Home;
