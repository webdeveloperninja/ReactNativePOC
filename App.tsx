import React from 'react';
import {Text, Button, ScrollView} from 'react-native';
import {BleManager, Device, State, LogLevel} from 'react-native-ble-plx';
import {useObservable} from 'rxjs-hooks';
import {selectAdapterState, selectDevices} from './ble';
import {BehaviorSubject, from, EMPTY} from 'rxjs';
import {tap, switchMap} from 'rxjs/operators';

const App: React.FC = () => {
  const bleManager = new BleManager();
  bleManager.setLogLevel(LogLevel.Verbose);
  const bluetoothAdapterState$ = selectAdapterState(bleManager);
  const devices$ = selectDevices(bluetoothAdapterState$, bleManager);

  const bluetoothAdapterState: State | null = useObservable(
    () => bluetoothAdapterState$,
  );
  const devices: Device[] | null = useObservable(() => devices$);

  const _selectedDevice$ = new BehaviorSubject<Device | null>(null);
  const selectedDevice$ = _selectedDevice$.asObservable();

  const onButtonPress = (device: Device) => _selectedDevice$.next(device);
  const connectedDevice$ = selectedDevice$.pipe(
    tap(() => bleManager.stopDeviceScan()),
    switchMap((device) => {
      if (!device) {
        return EMPTY;
      }
      return from(device.connect());
    }),
  );
  const discoveredServicesAndCharacteristics$ = connectedDevice$.pipe(
    switchMap((device) => from(device.discoverAllServicesAndCharacteristics())),
  );

  const services$ = discoveredServicesAndCharacteristics$.pipe(
    switchMap((device) => device.services()),
  );

  const characteristics$ = services$.pipe(
    switchMap((services) =>
      from(services).pipe(switchMap((service) => service.characteristics())),
    ),
  );

  characteristics$.subscribe((characteristics) =>
    console.log('characteristics', characteristics),
  );

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
