import {
  BleManager,
  Device,
  ScanOptions,
  State,
  ScanCallbackType,
  ScanMode,
} from 'react-native-ble-plx';
import {Observable, BehaviorSubject, defer} from 'rxjs';
import {
  filter,
  switchMap,
  first,
  debounce,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';
import {PermissionsAndroid} from 'react-native';

export async function requestLocationPermission() {
  try {
    const grantedLocation = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    const grantedBackground = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    );
    if (
      grantedLocation === PermissionsAndroid.RESULTS.GRANTED &&
      grantedBackground === PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('Location permission for bluetooth scanning granted');
      return true;
    } else {
      console.log('Location permission for bluetooth scanning revoked');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}

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
    distinctUntilChanged(),
    filter((adapterState) => adapterState === State.PoweredOn),
    switchMap(() => defer(() => selectDevicesFn(manager))),
  );

const selectDevicesFn: SetDeviceListnerFn = (
  manager: BleManager,
): Observable<Device[]> => {
  const _devices = new BehaviorSubject<Device[]>([]);
  const devices$ = _devices.asObservable();

  requestLocationPermission().then((granted) => {
    if (granted) {
      manager.startDeviceScan(null, null, (error, device) => {
        if (device != null) {
          _devices.next([..._devices.value, device]);
        }
      });
    }
  });

  _devices.next([..._devices.value, mockDevice]);

  return devices$;
};

type SetDeviceListnerFn = (manager: BleManager) => Observable<Device[]>;

const blueToothScanOptions: ScanOptions = {
  callbackType: ScanCallbackType.AllMatches,
  scanMode: ScanMode.LowPower,
};

const mockDevice = {
  name: 'ESP32 mock device',
} as Device;

type HardwareDevice = {
  services: string[];
};
