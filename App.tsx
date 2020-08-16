import React from 'react';
import {Button, ScrollView, Text} from 'react-native';
import {
  BleManager,
  Device,
  LogLevel,
  State,
  Characteristic,
} from 'react-native-ble-plx';
import {useObservable} from 'rxjs-hooks';
import {
  selectAdapterState,
  selectCharacteristics,
  selectDevices,
  selectServices,
  createDeviceConnection,
} from './ble';
import {first} from 'rxjs/operators';

const App: React.FC = () => {
  const bleManager = new BleManager();
  bleManager.setLogLevel(LogLevel.Verbose);
  const bluetoothAdapterState$ = selectAdapterState(bleManager);
  const devices$ = selectDevices(bluetoothAdapterState$, bleManager);

  const bluetoothAdapterState: State | null = useObservable(
    () => bluetoothAdapterState$,
  );
  const devices: Device[] | null = useObservable(() => devices$);

  let characteristics: Characteristic[] = [];

  const onButtonPress = (device: Device) => {
    bleManager.stopDeviceScan();

    const connectedDevice$ = createDeviceConnection(device);
    const servicesForDevice$ = selectServices(connectedDevice$);

    selectCharacteristics(servicesForDevice$)
      .pipe(first())
      .subscribe(
        (newCharacteristics) =>
          (characteristics = [...characteristics, ...newCharacteristics]),
      );
  };

  return (
    <ScrollView>
      <Text>BLE Application</Text>
      <Text>Adapter State: {bluetoothAdapterState}</Text>
      {devices?.map((device, i) => (
        <Button
          key={i}
          title={device.name ? device.name : ''}
          onPress={() => onButtonPress(device)}
          color="#f194ff"
        />
      ))}

      <Text>Characteristics</Text>
      {characteristics.map((c, i) => (
        <Text key={i}>
          {c.uuid}, value: {c.value}{' '}
        </Text>
      ))}
    </ScrollView>
  );
};

export default App;
