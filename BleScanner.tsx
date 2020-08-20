import React, {useState} from 'react';
import {Text} from 'react-native';
import {
  BleManager,
  LogLevel,
  State,
  Device,
  Characteristic,
} from 'react-native-ble-plx';
import {
  selectAdapterState,
  selectDevices,
  createDeviceConnection,
  esp32ServiceId,
  characteristicId,
} from './ble';
import {useObservable} from 'rxjs-hooks';
import {Card, Button} from 'react-native-paper';
import base64 from 'react-native-base64';

export type BleScannerProps = {
  bleManager: BleManager;
};

const BleScanner: React.FunctionComponent<BleScannerProps> = ({bleManager}) => {
  bleManager.setLogLevel(LogLevel.Verbose);

  const bluetoothAdapterState$ = selectAdapterState(bleManager);
  const devices$ = selectDevices(bluetoothAdapterState$, bleManager);
  const devices: Device[] | null = useObservable(() => devices$);
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);

  const onButtonPress = (device: Device) => {
    bleManager.stopDeviceScan();

    const connectedDevice$ = createDeviceConnection(device);

    connectedDevice$.subscribe((d) => {
      d.readCharacteristicForService(
        esp32ServiceId,
        characteristicId,
      ).then((c) => setCharacteristics([c]));
    });
  };

  return (
    <Card>
      {devices?.map((device, i) => (
        <Button mode="contained" key={i} onPress={() => onButtonPress(device)}>
          <Text>{device.name ? device.name : ''}</Text>
        </Button>
      ))}

      <Text>Characteristics</Text>
      {characteristics ? (
        characteristics.map((c, i) => (
          <Text key={i}>
            UUID: {c.uuid}, VALUE: {base64.decode(c.value)}
          </Text>
        ))
      ) : (
        <Text>No Characteristics Found</Text>
      )}
    </Card>
  );
};

export default BleScanner;
