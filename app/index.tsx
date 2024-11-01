import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Login from './login'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import { router, Stack } from 'expo-router';
import RootLayout from './_layout';
import AuthStack from '../navigation/AuthStack';
import Events from './events';


const Main = () => {
  return (
    <View>
        <Text></Text>
        <View>
            <Button 
            onPress={() => router.push('/login')} 
            title="Get Started"
            />
        </View>
    </View>
  )
}

export default Main

const styles = StyleSheet.create({})