import React from 'react';
import { Stack } from 'expo-router';

export default function AppStack() {
  return (
    <Stack>
      <Stack.Screen name="events" options={{ title: 'Events' }} />
      <Stack.Screen name="list-tickets" options={{ title: 'List Tickets' }} />
      <Stack.Screen name="barcode-scan" options={{ title: 'Scan Barcode' }} />
    </Stack>
  );
}