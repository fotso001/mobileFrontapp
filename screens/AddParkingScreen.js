import React, { useState, useContext } from 'react'; // Import useContext here
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/authContext';

const AddParkingScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [totalSpaces, setTotalSpaces] = useState('');
  const [price, setPrice] = useState('');
  const [phone, setPhone] = useState('');
  const [state] = useContext(AuthContext); // Correctly access the AuthContext

  const handleAddParking = async () => {
    try {
      const response = await axios.post('/AddParkingScreen', {
        name_parking: name,  
        location,
        total_spaces: parseInt(totalSpaces, 10),
        phone,
        price,
        manager_id: state.user.id, // Accessing the manager_id from AuthContext
      });

      if (response.status === 201) {
        alert('Parking added successfully');
        navigation.goBack();
      }
    } catch (error) {
      alert('Error adding parking: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Parking Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>Total Spaces</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={totalSpaces}
        onChangeText={setTotalSpaces}
      />

      <Text style={styles.label}>Telephone</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={phone}
        onChangeText={setPhone}
      />

      <Text style={styles.label}>Prix</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Button title="Add Parking" onPress={handleAddParking} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
  },
});

export default AddParkingScreen;
