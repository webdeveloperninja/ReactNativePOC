import React from 'react';
import {Button, ScrollView, Text} from 'react-native';
import {BleManager, Device, LogLevel, State} from 'react-native-ble-plx';
import {useObservable} from 'rxjs-hooks';
import {
  selectAdapterState,
  selectCharacteristics,
  selectDevices,
  selectServices,
  createDeviceConnection,
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

  const onButtonPress = (device: Device) => {
    bleManager.stopDeviceScan();

    const connectedDevice$ = createDeviceConnection(device);
    const servicesForDevice$ = selectServices(connectedDevice$);

    selectCharacteristics(servicesForDevice$).subscribe((characteristics) =>
      console.log('characteristics', characteristics),
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
    </ScrollView>
  );
};

export default App;
