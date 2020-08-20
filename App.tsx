import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import {Provider, Appbar, Button} from 'react-native-paper';
import BleScanner from './BleScanner';
import {BleManager, Device} from 'react-native-ble-plx';

const App: React.FC = () => {
  const title = 'Device Manager';
  const subtitle = 'Manage your All Things Sensors device';

  const [bleManager, setBleManager] = useState<BleManager>();

  const startBleScanHandler = () => {
    setBleManager(new BleManager());
  };

  const resetHandler = () => {
    bleManager?.destroy();
    setBleManager(undefined);
  };

  const onDeviceSelection = (device: Device) => {
    console.log('device selected', device);
  };

  return (
    <Provider>
      <ScrollView>
        <Appbar.Header>
          <Appbar.Content title={title} subtitle={subtitle} />
        </Appbar.Header>

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

export default App;
