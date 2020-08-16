import {Device, Service} from 'react-native-ble-plx';
import {from, Observable, of} from 'rxjs';
import {flatMap, switchMap} from 'rxjs/operators';

export const createDeviceConnection = (device: Device) =>
  from(device.isConnected()).pipe(
    switchMap((isConnected) => {
      if (isConnected) {
        return of();
      } else {
        return from(device.connect());
      }
    }),
    switchMap(() => from(device.discoverAllServicesAndCharacteristics())),
  );

export const selectServices = (connectedDevice$: Observable<Device>) =>
  connectedDevice$.pipe(switchMap((device) => device.services()));

export const selectCharacteristics = (services$: Observable<Service[]>) =>
  services$.pipe(
    flatMap((services) => of(...services)),
    switchMap((service) => service.characteristics()),
  );
