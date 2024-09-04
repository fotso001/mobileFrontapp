import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthContext } from '../context/authContext';
import FooterMenu from '../compoments/Menus/FooterMenu';

const ReservationsScreen = ({ route, navigation }) => {
    const [state] = useContext(AuthContext);
    const { parkingId } = route.params;
    const [parking, setParking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reserved, setReserved] = useState(false);

    const [vehicleType, setVehicleType] = useState('');
    const [vehicleRegistration, setVehicleRegistration] = useState('');
    const [reservationDuration, setReservationDuration] = useState('');
    const [numeberPhone, setNumeberPhone] = useState('');
    const [reservationDate, setReservationDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [vehicles, setVehicles] = useState([
        { vehicleType: '', vehicleRegistration: '', reservationDuration: '', numeberPhone: '' }
    ]);
    

    useEffect(() => {
        const fetchParkingDetails = async () => {
            try {
                const response = await axios.get(`/ParkingsScreen/${parkingId}`);
                console.log('API response:', response.data);
                if (response.data) {
                    setParking(response.data);
                } else {
                    setError('Parking data not found');
                }
            } catch (err) {
                setError(err.message || 'Une erreur est survenue');
            } finally {
                setLoading(false);
            }
        };
        fetchParkingDetails();
    }, [parkingId]);

    const handleReservation = async () => {
        try {
            if (parking.available_spaces >= vehicles.length) {
                for (let vehicle of vehicles) {
                    await axios.post('/reservations', {
                        customerName: state.user.id,
                        parkingId,
                        vehicleType: vehicle.vehicleType,
                        vehicleRegistration: vehicle.vehicleRegistration,
                        reservationDuration: vehicle.reservationDuration,
                        numeberPhone: vehicle.numeberPhone,
                        prix: parking.price,
                        total_prix: parking.price * vehicle.reservationDuration
                    });
    
                    await axios.put(`/ParkingsScreen/${parkingId}`, {
                        available_spaces: parking.available_spaces - 1,
                    });
    
                    setParking((prev) => ({
                        ...prev,
                        available_spaces: prev.available_spaces - 1,
                    }));
                }
    
                setReserved(true);
                navigation.navigate('ParkingsScreen');
            } else {
                alert('Pas assez de places disponibles');
            }
        } catch (err) {
            setError(err.message || 'Une erreur est survenue');
        }
    };
    

    const addVehicle = () => {
        setVehicles([...vehicles, { vehicleType: '', vehicleRegistration: '', reservationDuration: '', numeberPhone: '' }]);
    };
    

    const updateVehicle = (index, field, value) => {
        const newVehicles = [...vehicles];
        newVehicles[index][field] = value;
        setVehicles(newVehicles);
    };
    


    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || reservationDate;
        setShowDatePicker(Platform.OS === 'ios');
        setReservationDate(currentDate);
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

    if (!parking) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Erreur: Parking data not available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to {parking.name_parking}</Text>
            <Text style={styles.parkingInfo}>Location: {parking.location}</Text>
            <Text style={styles.parkingInfo}>Places disponibles: {parking.available_spaces}</Text>
            <Text style={styles.parkingInfo}>Tarif: {parking.price} XAF</Text>
            <Text style={styles.customer}>Client: {state.user.name}</Text>
    
            {vehicles.map((vehicle, index) => (
                <View key={index} style={styles.vehicleContainer}>
                    <Text style={styles.vehicleTitle}>Véhicule {index + 1}</Text>
    
                    <TextInput
                        style={styles.input}
                        placeholder="Type de véhicule"
                        value={vehicle.vehicleType}
                        onChangeText={(value) => updateVehicle(index, 'vehicleType', value)}
                    />
    
                    <TextInput
                        style={styles.input}
                        placeholder="Immatriculation de votre véhicule"
                        value={vehicle.vehicleRegistration}
                        onChangeText={(value) => updateVehicle(index, 'vehicleRegistration', value)}
                    />
    
                    <TextInput
                        style={styles.input}
                        placeholder="Durée de la réservation (en heures)"
                        value={vehicle.reservationDuration}
                        keyboardType="numeric"
                        onChangeText={(value) => updateVehicle(index, 'reservationDuration', value)}
                    />
    
                    <TextInput
                        style={styles.input}
                        placeholder="Votre numéro de téléphone"
                        value={vehicle.numeberPhone}
                        keyboardType="numeric"
                        onChangeText={(value) => updateVehicle(index, 'numeberPhone', value)}
                    />
                </View>
            ))}
    
           
    
            {!reserved && (
                    <TouchableOpacity 
                        style={styles.reserveButton} 
                        onPress={handleReservation}
                    >
                        <Ionicons name="calendar-outline" size={20} color="#fff" />
                        <Text style={styles.reserveButtonText}>Réserver</Text>
                    </TouchableOpacity>
                )}

                {reserved && (
                    <Text style={styles.successText}>Réservation réussie !</Text>
                )}

    
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
    parkingInfo: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 10,
        fontSize: 16,
    },
    datePickerText: {
        color: '#333',
        fontSize: 16,
        marginBottom: 20,
    },
    reserveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
        justifyContent: 'center',
    },
    reserveButtonText: {
        color: '#fff',
        fontSize: 18,
        marginLeft: 10,
    },
    successText: {
        color: '#4CAF50',
        fontSize: 18,
        marginTop: 20,
        textAlign: 'center',
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
    customer: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    vehicleContainer: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#eaeaea',
        borderRadius: 5,
    },
    vehicleTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    addButton: {
        marginTop: 10,
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    
});

export default ReservationsScreen;
