import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { SplashScreen, Stack } from 'expo-router'

import { AuthProvider } from '../context/AuthContext';
import Toast from 'react-native-toast-message';
import { EventsProvider } from '../context/EventsContext';
import { TicketProvider } from '../context/TicketContext';

//prevent splash creen from hiding till assets are loaded
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {

    useEffect(() => {
        
       SplashScreen.hideAsync();
      }, [])

    return (
      <AuthProvider>
        <EventsProvider>
          <TicketProvider>
            <Stack>
              <Stack.Screen name="index" options={{ title: 'Get Started' }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="events" options={{ title: 'Events' }} />
              <Stack.Screen name="list-tickets" options={{ title: 'Ticket'}} />
              <Stack.Screen name="scan-barcode" options={{ title: 'Scan QR Code', headerLeft: () => null }} />
            </Stack>
            <Toast />
          </TicketProvider>
        </EventsProvider>  
      </AuthProvider>
      
    )
}

export default RootLayout