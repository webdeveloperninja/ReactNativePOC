import React from 'react';
import {ScrollView} from 'react-native';
import {Provider, Appbar, Title} from 'react-native-paper';
import BleScanner from './BleScanner';
import {BleManager} from 'react-native-ble-plx';

const App: React.FC = () => {
  const title = 'Device Manager';
  const subtitle = 'Manage your All Things Sensors device';

  const bleManager = new BleManager();

  return (
    <Provider>
      <ScrollView>
        <Appbar.Header>
          <Appbar.Content title={title} subtitle={subtitle} />
        </Appbar.Header>
        <Title>Bluetooth Devices</Title>
        <BleScanner bleManager={bleManager} />
      </ScrollView>
    </Provider>
  );
};

export default App;
