import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
// import { useAuth } from '../context/AuthContext';
import AuthStack from '../navigation/AppStack';
import AppStack from '../navigation/AuthStack';
import { AuthProvider } from '../context/AuthContext';
import Toast from 'react-native-toast-message';
import { EventsProvider } from '../context/EventsContext';
import { TicketProvider } from '../context/TicketContext';


const RootLayout = () => {
    return (
      <AuthProvider>
        <EventsProvider>
          <TicketProvider>
            <Stack>
              <Stack.Screen name="login" options={{ title: 'Login' }} />
              <Stack.Screen name="events" options={{ title: 'Events' }} />
              <Stack.Screen name="list-tickets" options={{ title: 'List Tickets' }} />
              <Stack.Screen name="scan-barcode" options={{ title: 'Scan Barcode' }} />
            </Stack>
            <Toast />
          </TicketProvider>
        </EventsProvider>  
      </AuthProvider>
      
    )
}

export default RootLayout