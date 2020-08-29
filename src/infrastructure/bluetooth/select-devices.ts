import {BleManager, Device, State} from 'react-native-ble-plx';
import {BehaviorSubject, defer, Observable} from 'rxjs';
import {distinctUntilChanged, filter, switchMap} from 'rxjs/operators';
import {requestPermissionForBle} from './permissions';
import {serviceId} from './devices/esp32';

type SetDeviceListnerFn = (manager: BleManager) => Observable<Device[]>;

type HardwareDevice = {
  services: string[];
};

const esp32: HardwareDevice = {
  services: [serviceId],
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
      manager.startDeviceScan(null, null, (error, deviceToAdd) => {
        if (
          deviceToAdd != null &&
          deviceToAdd.name !== null &&
          !_devices.value.some((d) => d.name === deviceToAdd.name)
        ) {
          _devices.next([..._devices.value, deviceToAdd]);
        }
      });
    }
  });

  return devices$;
};
