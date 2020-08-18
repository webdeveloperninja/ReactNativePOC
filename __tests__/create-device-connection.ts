import 'react-native';
import {Device} from 'react-native-ble-plx';
import {createDeviceConnection} from '../ble';

describe('createDeviceConnection', () => {
  it('should return connected device', (done) => {
    const device = {
      id: 'asdf',
      isConnected: () => {},
      discoverAllServicesAndCharacteristics: () => {},
      connect: () => {},
    } as Device;

    jest
      .spyOn(device, 'isConnected')
      .mockImplementation(() => Promise.resolve(true));

    jest
      .spyOn(device, 'discoverAllServicesAndCharacteristics')
      .mockImplementation(() => Promise.resolve(device));

    jest
      .spyOn(device, 'connect')
      .mockImplementation(() => Promise.resolve(device));

    const connection$ = createDeviceConnection(device);

    connection$.subscribe((connection) => {
      expect(connection).toEqual(device);
      done();
    });
  });
});
