import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'



const ProfileScreen = ({ navigation }) => {
    const [state] = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`/user/${state.user.id}`);
            setProfile(response.data);
        } catch (err) {
            setError(err.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [state.user.id]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Chargement...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Erreur: {error}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.buttonContainer}>
                <View style={styles.infoItem}>
                    <FontAwesome5 name="envelope" style={styles.iconStyle} />
                    <Button
                        title="Messagerie"
                        onPress={() => navigation.navigate('ListMessage')}
                        color="#FF6347"
                    />
                </View>
            
            </View>
            <View style={styles.header}>
                <Image
                    style={styles.avatar}
                    source={require('../assets/moi.jpeg')}
                />
                <Text style={styles.username}>@{profile?.username || 'Username'}</Text>
                <Text style={styles.email}>{profile?.email || 'email@example.com'}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.infoTitle}>Account Info</Text>
                <View style={styles.infoItem}>
                    <FontAwesome5 name="user" style={styles.iconStyle} />
                    <Text style={styles.infoLabel}>Name:</Text>
                    <Text style={styles.infoValue}>{profile?.username || 'Nom'}</Text>
                </View>
                <View style={styles.infoItem}>
                    <FontAwesome5 name="paper-plane" style={styles.iconStyle} />
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>{profile?.email || 'email@example.com'}</Text>
                </View>
                <View style={styles.infoItem}>
                <FontAwesome5 name="briefcase" style={styles.iconStyle} />
                    <Text style={styles.infoLabel}>Role:</Text>
                    <Text style={styles.infoValue}>{profile?.role || 'Role'}</Text>
                </View>
                <View style={styles.infoItem}>
                    <FontAwesome5 name='map-marked'style={styles.iconStyle} />
                    <Text style={styles.infoLabel}>Address:</Text>
                    <Text style={styles.infoValue}>{profile?.address || 'Addresse inconnue'}</Text>
                </View>
                <View style={styles.infoItem}>
                <FontAwesome5 name="" style={styles.iconStyle} />
                    <Text style={styles.infoLabel}>Date of Birth:</Text>
                    <Text style={styles.infoValue}>{profile?.dob || '01/01/1970'}</Text>
                </View>
            </View>
            <Button
                title="Modifier Profil"
                onPress={() => navigation.navigate('EditProfile')}
                color="#FF6347"
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    header: {
        backgroundColor: '#FF6347',
        padding: 20,
        margin: 20,
        alignItems: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    username: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
    email: {
        fontSize: 16,
        color: '#fff',
    },
    infoContainer: {
        padding: 20,
    },
    infoTitle: {
        fontSize: 22,
        marginBottom: 20,
        color: '#333',
        fontWeight: 'bold',
    },
    infoItem: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        width: 100,
    },
    infoValue: {
        fontSize: 16,
        color: '#333',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    iconStyle:{
        marginBottom: 3,
        alignSelf:'center',
        fontSize: 16,
        padding: 5,
    },
    buttonContainer: {
        padding: 5,
        alignItems: 'flex-end', // Aligne le bouton à droite
    }
    
});

export default ProfileScreen;
