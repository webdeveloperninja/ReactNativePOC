import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import HomeScreen from './src/screens/HomeScreen';
import DeviceManagementScreen from './src/screens/DeviceManagementScreen';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'All Things Sensors - Home'}}
        />
        <Stack.Screen
          name="DeviceManagement"
          component={DeviceManagementScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
