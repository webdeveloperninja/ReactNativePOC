import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import {BleManager, Device} from 'react-native-ble-plx';
import {Appbar, Button, Provider, Snackbar} from 'react-native-paper';
import {first} from 'rxjs/operators';
import {sendDataToDevice} from './ble';
import BleScanner from './BleScanner';
import DeviceViewer from './DeviceViewer';

const App: React.FC = () => {
  const title = 'Device Manager';
  const subtitle = 'Manage your All Things Sensors device';

  const [bleManager, setBleManager] = useState<BleManager>();
  const [device, setDevice] = useState<Device>();
  const [isSnackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState<string>();

  const startBleScanHandler = () => {
    setBleManager(new BleManager());
  };

  const resetHandler = () => {
    bleManager?.destroy();
    setBleManager(undefined);
    setDevice(undefined);
  };

  const onDeviceSelection = (device: Device) => {
    setDevice(device);
  };

  const onSendDataToDevice = (data: string, device: Device) => {
    if (!bleManager) {
      throw new Error('Ble manager must be set');
    }
    sendDataToDevice(data, bleManager, device)
      .pipe(first())
      .subscribe(() => {
        setSnackbarVisible(true);
        setSnackbarText('Successfully sent data to the device');
      });
  };

  const onDismissSnackBar = () => {
    setSnackbarVisible(false);
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

        {!!bleManager && !device ? (
          <BleScanner
            bleManager={bleManager}
            onDeviceSelection={onDeviceSelection}
          />
        ) : null}

        {!!device ? (
          <DeviceViewer
            device={device}
            onSendDataToDevice={onSendDataToDevice}></DeviceViewer>
        ) : null}
      </ScrollView>
      <Snackbar visible={isSnackbarVisible} onDismiss={onDismissSnackBar}>
        {snackbarText}
      </Snackbar>
    </Provider>
  );
};

export default App;
