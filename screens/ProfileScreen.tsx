import React from 'react';
import {Text} from 'react-native-paper';
import {View} from 'react-native';
import {screenWrapperStyles} from '../styles/screen';

const ProfileScreen: React.FunctionComponent = () => {
  return (
    <View style={screenWrapperStyles}>
      <Text>Home</Text>
    </View>
  );
};

export default ProfileScreen;
