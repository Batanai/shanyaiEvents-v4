import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useAuth } from './AuthContext';

const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
  const { user } = useAuth();  // Get the token from AuthContext
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  const BASE_URL = "https://shanyai.events";

  const fetchEvents = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/wp-json/meup/v1/event_accepted`, {
        token: user,  // Use the token from AuthContext
      });

      const data = response.data;

      if (data.status === 'SUCCESS') {
        setEvents(data.events);  // Set the fetched events

        Toast.show({
          type: 'success',
          text1: 'Events Fetched',
          text2: 'Events data has been successfully loaded.',
          visibilityTime: 4000,
          position: 'top',
        });
      } else {
        setError(data.msg);

        Toast.show({
          type: 'error',
          text1: 'Error Fetching Events',
          text2: data.msg || 'Please try again.',
          visibilityTime: 4000,
          position: 'top',
        });
      }
    } catch (err) {
      setError("Failed to fetch events.");

      Toast.show({
        type: 'error',
        text1: 'Error Fetching Events',
        text2: 'Please try again.',
        visibilityTime: 4000,
        position: 'top',
      });
    }
  };

  return (
    <EventsContext.Provider value={{ events, fetchEvents, error }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
};