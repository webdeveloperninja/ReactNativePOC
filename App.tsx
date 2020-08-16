import React, {useState} from 'react';
import {ScrollView, Text} from 'react-native';
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
import {Provider} from 'react-native-paper';
import {Button} from 'react-native-paper';
import {BehaviorSubject} from 'rxjs';

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
    const servicesForDevice$ = selectServices(connectedDevice$);

    selectCharacteristics(servicesForDevice$)
      .pipe(first())
      .subscribe((newCharacteristics) =>
        setCharacteristics([...characteristics, ...newCharacteristics]),
      );
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
          characteristics.map((c) => (
            <Text>
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
