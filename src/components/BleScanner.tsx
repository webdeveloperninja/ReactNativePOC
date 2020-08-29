import React from 'react';
import {Text} from 'react-native';
import {BleManager, Device, LogLevel} from 'react-native-ble-plx';
import {Button, Card, Title} from 'react-native-paper';
import {useObservable} from 'rxjs-hooks';
import {first} from 'rxjs/operators';
import {
  createDeviceConnection,
  selectAdapterState,
  selectDevices,
} from '../infrastructure/bluetooth';

export type BleScannerProps = {
  bleManager: BleManager;
  onDeviceSelection: (device: Device) => void;
};

const BleScanner: React.FunctionComponent<BleScannerProps> = ({
  bleManager,
  onDeviceSelection,
}) => {
  bleManager.setLogLevel(LogLevel.Verbose);

  const bluetoothAdapterState$ = selectAdapterState(bleManager);
  const devices$ = selectDevices(bluetoothAdapterState$, bleManager);
  const devices: Device[] | null = useObservable(() => devices$);

  const onButtonPress = (device: Device) => {
    bleManager.stopDeviceScan();
    const connectedDevice$ = createDeviceConnection(device);

    connectedDevice$.pipe(first()).subscribe((connectedDevice) => {
      onDeviceSelection(connectedDevice);
    });
  };

  return (
    <Card>
      <Title>BLE enabled devices</Title>
      {devices?.map((device, i) => (
        <Button mode="contained" key={i} onPress={() => onButtonPress(device)}>
          <Text>{device.name ? device.name : ''}</Text>
        </Button>
      ))}
    </Card>
  );
};

export default BleScanner;
