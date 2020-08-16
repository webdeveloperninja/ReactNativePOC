import React, {useState} from 'react';
import {ScrollView, Text} from 'react-native';
import {
  BleManager,
  Characteristic,
  Device,
  LogLevel,
  State,
} from 'react-native-ble-plx';
import {Button, Provider} from 'react-native-paper';
import {useObservable} from 'rxjs-hooks';
import {
  characteristicId,
  createDeviceConnection,
  esp32ServiceId,
  selectAdapterState,
  selectDevices,
} from './ble';

const App: React.FC = () => {
  const bleManager = new BleManager();
  bleManager.setLogLevel(LogLevel.Verbose);
  const bluetoothAdapterState$ = selectAdapterState(bleManager);
  const devices$ = selectDevices(bluetoothAdapterState$, bleManager);

  const bluetoothAdapterState: State | null = useObservable(
    () => bluetoothAdapterState$,
  );
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
    <Provider>
      <ScrollView>
        <Text>BLE Application</Text>
        <Text>Adapter State: {bluetoothAdapterState}</Text>
        {devices?.map((device, i) => (
          <Button
            mode="contained"
            key={i}
            onPress={() => onButtonPress(device)}>
            <Text>{device.name ? device.name : ''}</Text>
          </Button>
        ))}

        <Text>Characteristics</Text>
        {characteristics ? (
          characteristics.map((c, i) => (
            <Text key={i}>
              UUID: {c.uuid}, VALUE: {c.value}
            </Text>
          ))
        ) : (
          <Text>No Characteristics Found</Text>
        )}
      </ScrollView>
    </Provider>
  );
};

export default App;
