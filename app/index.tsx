import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router';


const Main = () => {
  return (
    <View>
        <Text></Text>
        <View>
            <Button 
            onPress={() => router.push('/login')} 
            title="Head to Login"
            />
        </View>
    </View>
  )
}

export default Main

const styles = StyleSheet.create({})