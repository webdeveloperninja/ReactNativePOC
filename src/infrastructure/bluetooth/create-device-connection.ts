import {Device} from 'react-native-ble-plx';
import {from, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';

export const createDeviceConnection = (device: Device) =>
  from(device.isConnected()).pipe(
    switchMap((isConnected) => {
      if (isConnected) {
        return of(device);
      } else {
        return from(device.connect());
      }
    }),
    switchMap(() => from(device.discoverAllServicesAndCharacteristics())),
  );
