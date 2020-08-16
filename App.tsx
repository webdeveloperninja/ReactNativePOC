import React from 'react';
import {Text, View, ScrollView} from 'react-native';
import {BleManager, Device, State, LogLevel} from 'react-native-ble-plx';
import {useObservable} from 'rxjs-hooks';
import {selectAdapterState, selectDevices} from './ble';

const App: React.FC = () => {
  const bleManager = new BleManager();
  bleManager.setLogLevel(LogLevel.Verbose);
  const bluetoothAdapterState$ = selectAdapterState(bleManager);
  const devices$ = selectDevices(bluetoothAdapterState$, bleManager);

  const bluetoothAdapterState: State | null = useObservable(
    () => bluetoothAdapterState$,
  );
  const devices: Device[] | null = useObservable(() => devices$);

  return (
    <ScrollView>
      <Text>BLE Application</Text>
      <Text>Adapter State: {bluetoothAdapterState}</Text>
      {devices?.map((device, i) => (
        <Text key={i}>{device.name}</Text>
      ))}
    </ScrollView>
  );
};

export default App;
