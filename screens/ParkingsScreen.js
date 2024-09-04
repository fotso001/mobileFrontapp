import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import FooterMenu from '../compoments/Menus/FooterMenu';
import { AuthContext } from '../context/authContext';
import { useFocusEffect } from '@react-navigation/native';

const ParkingsScreen = ({ navigation }) => {
    const [parkings, setParkings] = useState([]);
    const [filteredParkings, setFilteredParkings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [state] = useContext(AuthContext);

    const fetchParkings = async () => {
        try {
            const response = await axios.get('/ParkingsScreen');
            setParkings(response.data);
            setFilteredParkings(response.data); // Initialize with full data
        } catch (err) {
            setError(err.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParkings();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchParkings();
        }, [])
    );

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredParkings(parkings);
        } else {
            const filtered = parkings.filter(parking => 
                parking.name_parking.toLowerCase().includes(query.toLowerCase()) ||
                parking.location.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredParkings(filtered);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
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
        <View style={styles.container}>
            <Text style={styles.title}>Parkings Car</Text>
            
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="gray" />
                <TextInput
                    style={styles.searchBar}
                    placeholder="Rechercher par nom ou localisation"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>
            

            <FlatList
                data={filteredParkings}
                renderItem={({ item }) => (
                    <View style={styles.parkingCard}>
                        <Text style={styles.parkingName}>{item.name_parking}</Text>
                        <Text style={styles.parkingInfo}>Location: {item.location}</Text>
                        <Text style={styles.parkingInfo}>Places disponibles: {item.available_spaces}</Text>
                        <Text style={styles.parkingInfo}>Tarif pour une 1H: {item.price}XAF</Text>
                        <Text style={styles.parkingInfo}>Numéro de téléphone: {item.tel}</Text>
                        {state.user?.role === 'customer' && item.available_spaces > 0 ? (
                            <>
                                <TouchableOpacity 
                                    style={styles.reservationButton}
                                    onPress={() => navigation.navigate('ReservationsScreen', { parkingId: item.id_parking })}
                                >
                                    <Ionicons name="calendar-outline" size={20} color="#fff" />
                                    <Text style={styles.reservationButtonText}>Réserver</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.reservationButton}
                                    onPress={() => navigation.navigate('MessagerieScreen', { parkingId: item.id_parking })}
                                >
                                    <Ionicons name="chatbubble-outline" size={20} color="#fff" />
                                    <Text style={styles.reservationButtonText}>Envoyer un message</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <TouchableOpacity 
                                    style={styles.reservationButton}
                                    onPress={() => navigation.navigate('ReservationsScreen', { parkingId: item.id_parking })}
                                >
                                    <Ionicons name="calendar-outline" size={20} color="#fff" />
                                    <Text style={styles.reservationButtonText}>Réserver</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.reservationButton}
                                    onPress={() => navigation.navigate('MessagerieScreen', { parkingId: item.id_parking })}
                                >
                                    <Ionicons name="chatbubble-outline" size={20} color="#fff" />
                                    <Text style={styles.reservationButtonText}>Envoyer un message</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                )}
                keyExtractor={(item) => item.id_parking.toString()}
                contentContainerStyle={styles.listContent}
            />

            <FooterMenu />
        </View>
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
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
    },
    parkingCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    parkingName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    parkingInfo: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    reservationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF5722',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginTop: 10,
    },
    reservationButtonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 5,
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
    },
    errorText: {
        color: 'red',
        fontSize: 18,
    },
    listContent: {
        paddingBottom: 100,
    },searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E9E9E9',
        borderRadius: 20,
        padding: 10,
        margin: 15,
    },
});

export default ParkingsScreen;
