import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TextInput, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const ListMessage = () => {
    const [state] = useContext(AuthContext);
    const [discussions, setDiscussions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchDiscussions();
    }, []);
    
    const fetchDiscussions = async () => {
        try {
            const response = await axios.get('/discussion', {
                headers: {
                    Authorization: `Bearer ${state.token}`
                }
            });
            console.log(response.data); // Log API response to check if data is retrieved
            if (response.data.length > 0) {
                setDiscussions(response.data);
            } else {
                setError('Aucune discussion trouvée');
            }
        } catch (err) {
            setError(err.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };
    

    const filteredDiscussions = discussions.filter((discussion) => {
        const discussionId = discussion.discussionId;
        
        // Check if discussionId exists and is a string before using toLowerCase
        if (typeof discussionId === 'string') {
            return discussionId.toLowerCase().includes(search.toLowerCase());
        }
        
        // If discussionId is undefined or not a string, exclude it from the results
        return false;
    });

    useEffect(() => {
        console.log(discussions); // Log the discussions array to inspect the data structure
    }, [discussions]);
    

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
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

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Image source={require('../assets/moi.jpeg')} style={styles.avatar} />
            <View style={styles.messageContainer}>
                <Text style={styles.name}>
                    {item.id_discution === state.user.id_user ? `Avec: ${item.discussionId}` : `Avec: ${item.discussionId}`}
                </Text>
                <Text style={styles.message}>
                    Dernier message: {item.lastMessage || 'Pas de message'}
                </Text>
            </View>
            <View style={styles.timeContainer}>
                <Text style={styles.time}>
                    {item.lastMessageTime || 'N/A'}
                </Text>
                {item.unreadCount > 0 && (
                    <View style={styles.unreadCountContainer}>
                        <Text style={styles.unreadCount}>{item.unreadCount}</Text>
                    </View>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Chats</Text>
                <Image 
                    source={require('../assets/moi.jpeg')} 
                    style={styles.profileIcon} 
                />
            </View>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="gray" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>
            {/* Tab Menu */}
            <View style={styles.tabContainer}>
                <Text style={[styles.tabItem, styles.activeTab]}>Chats</Text>
                <Text style={styles.tabItem}>Calls</Text>
                <Text style={styles.tabItem}>Status</Text>
            </View>
            {/* Messages List */}
            <FlatList
            data={discussions} // Use discussions directly to check if rendering works
            keyExtractor={(item) => item.id_discution ? item.id_discution.toString() : Math.random().toString()}
            renderItem={renderItem}
            style={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
        
        paddingTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#FFF',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    profileIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E9E9E9',
        borderRadius: 20,
        padding: 10,
        margin: 15,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderBottomColor: '#E9E9E9',
        backgroundColor: '#FFF',
        paddingVertical: 10,
    },
    tabItem: {
        fontSize: 16,
        color: 'gray',
    },
    activeTab: {
        color: '#4CAF50',
        borderBottomWidth: 2,
        borderBottomColor: '#4CAF50',
    },
    list: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
        backgroundColor: '#FFF',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    messageContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    message: {
        color: 'gray',
        marginTop: 5,
    },
    timeContainer: {
        alignItems: 'flex-end',
    },
    time: {
        color: 'gray',
        fontSize: 12,
    },
    unreadCountContainer: {
        marginTop: 5,
        backgroundColor: '#28A745',
        borderRadius: 12,
        paddingHorizontal: 6,
        paddingVertical: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unreadCount: {
        color: 'white',
        fontSize: 12,
    },
});

export default ListMessage;
