import {Device, Service} from 'react-native-ble-plx';
import {Observable, of} from 'rxjs';
import {flatMap, switchMap} from 'rxjs/operators';

export const selectServices = (connectedDevice$: Observable<Device>) =>
  connectedDevice$.pipe(switchMap((device) => device.services()));

export const selectCharacteristics = (services$: Observable<Service[]>) =>
  services$.pipe(
    flatMap((services) => of(...services)),
    switchMap((service) => service.characteristics()),
  );
