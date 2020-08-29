import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import {BleManager, Device} from 'react-native-ble-plx';
import {Button, Provider} from 'react-native-paper';
import BleScanner from '../components/BleScanner';
import {screenWrapperStyles} from '../styles/screen';

const HomeScreen: React.FunctionComponent = ({navigation}) => {
  const [bleManager, setBleManager] = useState<BleManager>();

  const startBleScanHandler = () => {
    setBleManager(new BleManager());
  };

  const resetHandler = () => {
    bleManager?.destroy();
    setBleManager(undefined);
  };

  const onDeviceSelection = (device: Device) => {
    navigation.navigate('DeviceManagement', {bleManager, device});
  };

  return (
    <Provider>
      <ScrollView style={screenWrapperStyles}>
        {!!bleManager ? (
          <Button icon="broom" mode="contained" onPress={resetHandler}>
            Start over
          </Button>
        ) : (
          <Button
            icon="bluetooth-connect"
            mode="contained"
            onPress={startBleScanHandler}>
            Scan for device
          </Button>
        )}

        {!!bleManager ? (
          <BleScanner
            bleManager={bleManager}
            onDeviceSelection={onDeviceSelection}
          />
        ) : null}
      </ScrollView>
    </Provider>
  );
};

export default HomeScreen;
