import React, {useState} from 'react';
import {Text, Button, Snackbar, Provider} from 'react-native-paper';
import {View, ScrollView} from 'react-native';
import {screenWrapperStyles} from '../styles/screen';
import {sendDataToDevice} from '../ble';
import {first} from 'rxjs/operators';
import {Device, BleManager} from 'react-native-ble-plx';
import BleScanner from '../BleScanner';
import DeviceViewer from '../DeviceViewer';

const HomeScreen: React.FunctionComponent = () => {
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

export default HomeScreen;
