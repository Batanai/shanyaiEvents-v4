import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [ticketResponse, setTicketResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://shanyai.events"; // Adjust as needed

  // Function to validate the ticket
  const validateTicket = async (ticket) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/wp-json/meup/v1/validate_ticket`, ticket);

      const data = response.data;
      console.log('TICKET CONTEXT ', data)

      if (data.status === 'SUCCESS') {
        setTicketResponse(data); // Store successful ticket response
        setError(null);

        Toast.show({
          type: 'success',
          text1: 'Ticket Validated',
          text2: 'The ticket is valid!',
          visibilityTime: 4000,
          position: 'top',
        });
      } else {
        setError(data.msg || 'Invalid ticket');
        setTicketResponse(data);

        Toast.show({
          type: 'error',
          text1: 'Validation Failed',
          text2: data.msg || 'The ticket could not be validated.',
          visibilityTime: 4000,
          position: 'top',
        });
      }
    } catch (err) {
      setError('Failed to validate the ticket.');
      setTicketResponse(data);

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to validate the ticket. Please try again.',
        visibilityTime: 4000,
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to reset the ticket state
  const resetTicket = () => {
    setLoading(true);
    setTicketResponse(null);
    setError(null);
    setLoading(false);
  };

  return (
    <TicketContext.Provider value={{ ticketResponse, validateTicket, resetTicket, error, loading }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTicket = () => {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error("useTicket must be used within a TicketProvider");
  }
  return context;
};