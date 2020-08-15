import {BleManager, Device, ScanOptions, State} from 'react-native-ble-plx';
import {Observable, BehaviorSubject, defer} from 'rxjs';
import {filter, switchMap} from 'rxjs/operators';

const esp32ServiceId = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';

const esp32: HardwareDevice = {
  services: [esp32ServiceId],
};

export const selectDevices: (
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

type SetDeviceListnerFn = (manager: BleManager) => Observable<Device[]>;

const blueToothScanOptions: ScanOptions = {};

const mockDevice = {
  name: 'ESP32 mock device',
} as Device;

type HardwareDevice = {
  services: string[];
};
