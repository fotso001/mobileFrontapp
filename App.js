import React from "react";
import { AuthProvider } from "./context/authContext";
import Home from "./screens/Home";
import ReservationsScreen from "./screens/ReservationsScreen";
import NewReservationScreen from "./screens/NewReservationSreen";
import AddParkingScreen from "./screens/AddParkingScreen";
import ParkingsScreen from "./screens/ParkingsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import Login from "./screens/auth/Login";
import Signup from "./screens/auth/Signup";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MessagerieScreen from "./screens/MessagerieScreen";
import ListMessage from "./screens/ListMessage";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}
          />
          <Stack.Screen name="ReservationsScreen" component={ReservationsScreen} options={{ headerShown: false }}
          />
          <Stack.Screen name="NewReservationScreen" component={NewReservationScreen} options={{ headerShown: false }}
          />
          <Stack.Screen name="AddParkingScreen" component={AddParkingScreen} options={{ headerShown: false }}
          />
          <Stack.Screen name="ParkingsScreen" component={ParkingsScreen} options={{ headerShown: false }}
          />
          <Stack.Screen name="MessagerieScreen" component={MessagerieScreen} options={{ headerShown: false }}
          />
          <Stack.Screen name="ListMessage" component={ListMessage} options={{ headerShown: false }}
          />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }}
          />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}
          />
          <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </AuthProvider>
      
    </NavigationContainer>
  );
}


