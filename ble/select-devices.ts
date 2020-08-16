import {BleManager, Device, State} from 'react-native-ble-plx';
import {BehaviorSubject, defer, Observable} from 'rxjs';
import {distinctUntilChanged, filter, switchMap} from 'rxjs/operators';
import {requestPermissionForBle} from './permissions';

const esp32ServiceId = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';

type SetDeviceListnerFn = (manager: BleManager) => Observable<Device[]>;

type HardwareDevice = {
  services: string[];
};

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
    distinctUntilChanged(),
    filter((adapterState) => adapterState === State.PoweredOn),
    switchMap(() => defer(() => selectDevicesFn(manager))),
  );

const selectDevicesFn: SetDeviceListnerFn = (
  manager: BleManager,
): Observable<Device[]> => {
  const _devices = new BehaviorSubject<Device[]>([]);
  const devices$ = _devices.asObservable();

  requestPermissionForBle().then((granted) => {
    if (granted) {
      manager.startDeviceScan(null, null, (error, device) => {
        if (device != null) {
          _devices.next([..._devices.value, device]);
        }
      });
    }
  });

  return devices$;
};
