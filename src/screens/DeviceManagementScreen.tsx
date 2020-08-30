import React, {useState, useEffect} from 'react';
import {Text, Snackbar, Provider} from 'react-native-paper';
import {View} from 'react-native';
import {screenWrapperStyles} from '../styles/screen';
import {BleManager, Device} from 'react-native-ble-plx';
import DeviceViewer from '../components/DeviceViewer';
import {sendDataToDevice} from '../infrastructure/bluetooth';
import {first} from 'rxjs/operators';

const DeviceManagementScreen: React.FunctionComponent = ({route}) => {
  const [bleManager, setBleManager] = useState<BleManager>();
  const [device, setDevice] = useState<Device>();
  const [isSnackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState<string>();

  useEffect(() => {
    setBleManager(route.params.bleManager);
    setDevice(route.params.device);
  });

  const onSendDataToDevice = (
    data: string,
    device: Device,
    characteristicId: string,
  ) => {
    if (!bleManager) {
      throw new Error('Ble manager must be set');
    }
    sendDataToDevice(data, characteristicId, bleManager, device)
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
      <View style={screenWrapperStyles}>
        {!!device ? (
          <DeviceViewer
            device={device}
            onSendDataToDevice={onSendDataToDevice}></DeviceViewer>
        ) : null}
      </View>
      <Snackbar visible={isSnackbarVisible} onDismiss={onDismissSnackBar}>
        {snackbarText}
      </Snackbar>
    </Provider>
  );
};

export default DeviceManagementScreen;
