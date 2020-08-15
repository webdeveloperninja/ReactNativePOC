import React from 'react';
import {Text, View} from 'react-native';
import {BleManager, Device, ScanOptions, State} from 'react-native-ble-plx';
import {BehaviorSubject, defer, Observable} from 'rxjs';
import {useObservable} from 'rxjs-hooks';
import {filter, switchMap} from 'rxjs/operators';

const mockDevice = {
  name: 'ESP32 mock deviice',
} as Device;

const esp32ServiceId = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';

type HardwareDevice = {
  services: string[];
};

const esp32: HardwareDevice = {
  services: [esp32ServiceId],
};

const blueToothScanOptions: ScanOptions = {};

const selectAdapterState = (manager: BleManager): Observable<State> => {
  const _adapterState$ = new BehaviorSubject<State>(State.Unknown);
  const adapterState$ = _adapterState$.asObservable();
  manager.onStateChange((newState) => _adapterState$.next(newState));

  manager.state().then((s) => _adapterState$.next(s));
  return adapterState$;
};

type SetDeviceListnerFn = (manager: BleManager) => Observable<Device[]>;

const selectDevicesFn: SetDeviceListnerFn = (
  manager: BleManager,
): Observable<Device[]> => {
  const _devices = new BehaviorSubject<Device[]>([]);
  const devices$ = _devices.asObservable();

  manager.startDeviceScan(
    esp32.services,
    blueToothScanOptions,
    (error, device) => {
      if (device != null) {
        _devices.next([..._devices.value, device]);
      }
    },
  );

  _devices.next([..._devices.value, mockDevice]);

  return devices$;
};

const selectDevices: (
  adapterState$: Observable<State>,
  manager: BleManager,
) => Observable<Device[]> = (
  adapterState$: Observable<State>,
  manager: BleManager,
) =>
  adapterState$.pipe(
    filter((adapterState) => adapterState === State.PoweredOn),
    switchMap(() => defer(() => selectDevicesFn(manager))),
  );

const App: React.FC = () => {
  const bleManager = new BleManager();
  const bluetoothAdapterState$ = selectAdapterState(bleManager);
  const devices$ = selectDevices(bluetoothAdapterState$, bleManager);

  const bluetoothAdapterState: State | null = useObservable(
    () => bluetoothAdapterState$,
  );
  const devices: Device[] | null = useObservable(() => devices$);

  return (
    <View>
      <Text>BLE Application</Text>
      <Text>Adapter State: {bluetoothAdapterState}</Text>
      {devices?.map((device, i) => (
        <Text key={i}>{device.name}</Text>
      ))}
    </View>
  );
};

export default App;
