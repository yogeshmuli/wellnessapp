import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingOverlay from '../components/loadingOverlay';
import {setUser} from '../redux/slices/auth';

import LoginScreen from '../pages/auth/login';
import Sidebar from './sidebar';

const Stack = createNativeStackNavigator();

const RootContainer = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const authState = useSelector(state => state.authReducer);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      console.log('Checking user data...');
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        dispatch(setUser(parsedUser));
      }
    } catch (error) {
      console.error('Failed to load user data', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingOverlay visible={loading} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {authState.token ? (
          <Stack.Screen name="Main" component={Sidebar} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootContainer;
