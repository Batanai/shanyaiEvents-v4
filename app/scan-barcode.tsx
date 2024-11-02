import { StyleSheet, Text, View, ActivityIndicator, Pressable, Image, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Camera, PhotoFile, TakePhotoOptions, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { FontAwesome5, Ionicons, AntDesign } from '@expo/vector-icons'
// import {resetTicket, sendingTicket, selectTicket} from '@/store/tickets';
import { useAuth } from '../context/AuthContext';
import { MotiView, useAnimationState } from 'moti';
import { Shadow } from 'react-native-shadow-2';
import { useTicket } from '../context/TicketContext';

const ScanBarcode = () => {
  const {eId} = useLocalSearchParams();
  const [isActive, setIsActive] = useState(false);
  const { validateTicket, resetTicket, ticketResponse, error, loading } = useTicket();


  //barcode
  const [barcode, setBarcode] = useState('');
  const [isScanned, setIsScanned] = useState(false);

  const {user} = useAuth();
  console.log('USER, ', user)
  const token = user

  // moti
  const loaderAnimationState = useAnimationState({
    start: {opacity: 1},
    stop: {opacity: 0},
  });

  const ticketAnimationState = useAnimationState({
    show: {opacity: 1, translateY: -10},
    hide: {opacity: 0, translateY: 10},
  });
 

  const { hasPermission, requestPermission } = useCameraPermission()
  console.log('has permissions', hasPermission)

  const camera = useRef<Camera>(null);

  const device = useCameraDevice('back');
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      console.log(`Scanned ${codes.length} codes!`)
      console.log(codes);
      if (codes && codes[0].value) {
        setBarcode(codes[0].value);  // Update state with the scanned value
        ticketAnimationState.transitionTo('show');
      }
    }
  })



  useEffect(() => {
    setIsActive(true);  // Activate the camera when the component mounts
  
    return () => {
      setIsActive(false);  // Deactivate the camera when the component unmounts
      console.log('is Active: ', isActive);
      console.log("Camera is deactivated");
    };
  }, []);


  useEffect(() => {
    loaderAnimationState.transitionTo('stop');
    ticketAnimationState.transitionTo('hide');

    resetTicket();
  }, [])

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);



  if (!hasPermission) {
    return <ActivityIndicator />
  }

  if (!device) {
    return <Text>Camera device not found</Text>;
  }

  console.log('is Active: ', isActive);


  //confirm ticket

  const ticket = {
    token: token,
    qrcode: barcode,
    eid: `${eId}`,
  };
  console.log('TICKET ', ticket)

  const confirmBooking = () => {
    validateTicket(ticket);
  };

  if (ticketResponse) {
    console.log('TICKET RES', ticketResponse);
  }

  return (
    <View style={{flex: 1}}>

      <Camera 
        device={device} 
        isActive={isActive}
        codeScanner={codeScanner}
        style={StyleSheet.absoluteFill}
      />


      
      <View style={styles.flashContainer}>

        <Ionicons 
          name={"qr-code-sharp"}
          size={30} color={"white"}
          
        />
      </View> 

      {/* loading / searching view */}
      <MotiView state={loaderAnimationState} style={styles.motiview}>
        <Text style={{color: '#b4bccc', fontSize: 20}}>Searching</Text>
      </MotiView>

      {/* QR code */}
      {/* <View style={styles.qrcode}>
        <CameraFrame />
      </View> */}

      {/* ticket card */}
      <MotiView state={ticketAnimationState} style={styles.motiviewTicket}>
        <Shadow>
          <TouchableOpacity
            style={styles.ticketTouch}
            onPress={() => {
              confirmBooking();
              ticketAnimationState.transitionTo('hide');
            }}>
            <View
              style={{
                flex: 1,
                marginLeft: 10,
                justifyContent: 'space-evenly',
              }}>
              <Text
                style={{fontSize: 15, color: 'purple', paddingBottom: 5}}>
                QR Code Scan Complete
              </Text>
              <Text
                style={{fontSize: 12, color: 'black', paddingBottom: 5}}>
                QR Code: {barcode}
              </Text>
              <Text
                style={{fontSize: 12, color: 'black', paddingBottom: 5}}>
                Event ID: {eId}
              </Text>
              <Text style={{fontSize: 15, color: 'purple'}}>
                Click to Confirm Booking
              </Text>
            </View>
          </TouchableOpacity>
        </Shadow>
      </MotiView>

      {/* booking card */}
      {ticketResponse && (
        <View style={styles.motiviewBooking}>
          <Shadow>
            <TouchableOpacity
              style={styles.ticketTouch}
              onPress={() => {
                setTimeout(() => {
                  resetTicket();
                  router.push('/events');
                }, 2000);
                setIsActive(false);
              }}>
              <View
                style={{
                  flex: 1,
                  marginLeft: 10,
                  paddingHorizontal: 5,
                  justifyContent: 'space-evenly',
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'black',
                    fontWeight: 'bold',
                    paddingBottom: 5,
                  }}>
                  Ticket Validation Status
                </Text>
                <Text
                  style={
                    ticketResponse?.status === 'SUCCESS'
                      ? {
                          fontSize: 14,
                          color: 'green',
                          fontWeight: 'bold',
                          paddingBottom: 5,
                        }
                      : {
                          fontSize: 14,
                          color: 'red',
                          fontWeight: 'bold',
                          paddingBottom: 5,
                        }
                  }>
                  Status: {ticketResponse?.status}
                </Text>
                <Text
                  style={{fontSize: 13, color: 'black', paddingBottom: 5}}>
                  Message: {ticketResponse?.msg}{' '}
                  {ticketResponse?.msg.includes('permission') &&
                    '- Logout and Login again'}
                </Text>
                <Text
                  style={{fontSize: 12, color: 'black', paddingBottom: 5}}>
                  Name: {ticketResponse?.name_customer}
                </Text>
                <Text
                  style={{fontSize: 12, color: 'black', paddingBottom: 5}}>
                  Seat: {ticketResponse?.seat}
                </Text>
                <Text
                  style={{fontSize: 12, color: 'black', paddingBottom: 5}}>
                  CheckedIn Time: {ticketResponse?.checkin_time}
                </Text>
                <Text
                  style={{fontSize: 12, color: 'black', paddingBottom: 5}}>
                  Event details: {ticketResponse?.e_cal}
                </Text>
                <Text
                  style={
                    ticketResponse?.status === 'SUCCESS'
                      ? {fontSize: 14, color: 'green', fontWeight: 'bold'}
                      : {fontSize: 14, color: 'red', fontWeight: 'bold'}
                  }>
                  Click to Dismiss
                </Text>
              </View>
            </TouchableOpacity>
          </Shadow>
        </View>
      )} 
      
    </View>
  )
}

export default ScanBarcode

const styles = StyleSheet.create({
    cameraButton: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 50,
        width: 75,
        height: 75,
        borderRadius: 75,
        backgroundColor: 'white'
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        left: 30
    },
    flashContainer: {
        position: 'absolute',
        left: 10,
        top: 30,
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.40)',
        gap: 30
    },

    container: {
      flex: 1,
      flexDirection: 'column',
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
  
    result: {
      position: 'absolute',
      right: 0,
      left: 0,
      bottom: 0,
      alignItems: 'flex-start',
      flex: 0,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    result_left: {
      flex: 1,
      backgroundColor: '#000000',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 30,
      fontWeight: 'bold',
      color: '#fff',
    },
    result_right: {
      flex: 4,
      backgroundColor: '#000000',
      height: '100%',
      justifyContent: 'center',
      paddingLeft: 10,
      paddingTop: 5,
    },
    success: {
      backgroundColor: '#90ba3e',
      flex: 1,
      width: '100%',
      height: '100%',
      color: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    fail: {
      backgroundColor: 'red',
      flex: 1,
      width: '100%',
      height: '100%',
      color: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    valid_text: {
      fontSize: 30,
      fontWeight: 'bold',
      color: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    label: {
      color: '#ccc',
    },
    value: {
      color: '#fff',
      fontWeight: 'bold',
    },
    motiview: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#444952',
    },
    qrcode: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    scanButton: {
      position: 'absolute',
      height: 20,
      width: 20,
      borderRadius: 10,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    motiviewTicket: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 160,
      paddingVertical: 20,
      alignItems: 'center',
      zIndex: 1,
    },
    motiviewBooking: {
      position: 'absolute',
      top: 300,
      left: 0,
      right: 0,
      height: 250,
      paddingVertical: 20,
      alignItems: 'center',
      zIndex: 1,
    },
    ticketTouch: {
      flex: 1,
      flexDirection: 'row',
      width: '80%',
      alignItems: 'center',
      paddingHorizontal: 5,
      borderRadius: 10,
      backgroundColor: '#fff',
    },
})