import { ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect } from 'react'
import {Shadow} from 'react-native-shadow-2';
import { router } from 'expo-router';

import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventsContext';

const Events = () => {

  const { user, logout } = useAuth();

  const { events, fetchEvents, error } = useEvents();

  useEffect(() => {
    fetchEvents();  // Fetch events when the component loads
  }, []);

  console.log('EVENTS', JSON.stringify(events));

//   const event = {
//     token: user,
//   };

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={{color: '#fff', fontWeight: '400', fontSize: 16}}>
          Choose an event
        </Text>

        <TouchableOpacity onPress={() => handleLogout()}>
          <Text style={{color: '#fff', fontWeight: '400', fontSize: 16}}>
            Log out
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {events?.map((item: any, index: any) => (
          <View
            key={index}
            style={{
              backgroundColor: index % 2 == 0 ? '#eee' : '#fcfcfc',
              padding: 5,
              margin: 5,
            }}>
            <Shadow style={{width: '100%'}}>
              <View>
                <TouchableWithoutFeedback
                  style={{height: 10}}
                  onPress={() =>
                    router.push({
                      pathname: '/list-tickets',
                      params: {eId: parseInt(item.ID), title: item.post_title}
                    })
                  }>
                  <View style={styles.item}>
                    <Text style={styles.itemindex}>{index + 1}</Text>
                    <Text style={styles.itemtext}>{item.post_title}</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </Shadow>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default Events

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
    },
    heading: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: '#f4511e',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 30,
        padding: 15,
    },
    item: {
        flexDirection: 'row',
        paddingVertical: 20,
        marginVertical: 10,
        justifyContent: 'space-evenly',
    },
    itemindex: {
        fontWeight: '600',
        fontSize: 16,
    },
    itemtext: {
        opacity: 0.7,
        fontSize: 16,
    },
})