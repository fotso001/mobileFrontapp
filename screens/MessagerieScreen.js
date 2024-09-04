import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../context/authContext';

const socket = io('http://localhost:3000'); // Adjust the URL to match your server

const MessagerieScreen = ({ route }) => {
    const { parkingId } = route.params;
    const [state] = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [managerId, setManagerId] = useState(null);

    const fetchManagerId = async () => {
        try {
            const response = await axios.get(`/getManagerId/${parkingId}`);
            setManagerId(response.data.managerId);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'ID du manager :", error);
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`/messages`, {
                params: {
                    sender_id: state.user.id,
                    receiver_id: managerId,
                },
            });
            setMessages(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des messages :", error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        
        if (newMessage.trim()) {
            const messageData = {
                sender_id: state.user.id,
                receiver_id: managerId,
                parking_lot_id: parkingId,
                message_text: newMessage,
            };

            try {
                // Send the message to the backend API
                const response = await axios.post('/messages', messageData);
                
                // Emit the message through the socket
                socket.emit('sendMessage', messageData);

                // Add the new message to the local state
                setMessages((prevMessages) => [...prevMessages, messageData]);
                setNewMessage('');
            } catch (error) {
                console.error("Erreur lors de l'envoi du message :", error);
            }
        }
    };

    useEffect(() => {
        fetchManagerId();
    }, []);

    useEffect(() => {
        if (managerId) {
            fetchMessages();

            // Join the parking lot chat room
            socket.emit('joinParkingLot', { parking_lot_id: parkingId, user_id: state.user.id });

            // Listen for incoming messages
            socket.on('receiveMessage', (msg) => {
                setMessages((prevMessages) => [...prevMessages, msg]);
            });

            // Cleanup on component unmount
            return () => {
                socket.disconnect();
            };
        }
    }, [managerId]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Chargement des messages...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.messageContainer,
                            item.sender_id === state.user.id ? styles.myMessage : styles.otherMessage,
                        ]}
                    >
                        <Text style={styles.messageText}>{item.message_text}</Text>
                        <Text style={styles.messageDate}>{new Date(item.sent_at).toLocaleString()}</Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Tapez votre message..."
                />
                <Button title="Envoyer" onPress={sendMessage} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        padding: 10,
    },
    messageContainer: {
        marginVertical: 5,
        padding: 10,
        borderRadius: 10,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#4CAF50',
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#ddd',
    },
    messageText: {
        color: '#fff',
    },
    messageDate: {
        fontSize: 10,
        color: '#999',
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MessagerieScreen;
