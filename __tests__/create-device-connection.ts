import 'react-native';
import {Device} from 'react-native-ble-plx';
import {createDeviceConnection} from '../src/infrastructure/bluetooth';

const createDevice = () => {
  return {
    id: 'ESP 32',
    isConnected: () => {},
    discoverAllServicesAndCharacteristics: () => {},
    connect: () => {},
  } as Device;
};

describe('createDeviceConnection', () => {
  it('should return connected device', (done) => {
    const device = createDevice();
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

  it('should call device connect when device is not connected', (done) => {
    const isConnected = false;
    const device = createDevice();

    jest
      .spyOn(device, 'isConnected')
      .mockImplementation(() => Promise.resolve(isConnected));

    jest
      .spyOn(device, 'discoverAllServicesAndCharacteristics')
      .mockImplementation(() => Promise.resolve(device));

    const connectMockFn = jest
      .spyOn(device, 'connect')
      .mockImplementation(() => Promise.resolve(device));

    const connection$ = createDeviceConnection(device);

    connection$.subscribe((connection) => {
      expect(connection).toEqual(device);
      expect(connectMockFn).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('should not call device connect when device is connected', (done) => {
    const isConnected = true;
    const device = createDevice();

    jest
      .spyOn(device, 'isConnected')
      .mockReturnValue(Promise.resolve(isConnected));

    jest
      .spyOn(device, 'discoverAllServicesAndCharacteristics')
      .mockImplementation(() => Promise.resolve(device));

    const connectMockFn = jest
      .spyOn(device, 'connect')
      .mockImplementation(() => Promise.resolve(device));

    const connection$ = createDeviceConnection(device);

    connection$.subscribe((connection) => {
      expect(connection).toEqual(device);
      expect(connectMockFn).not.toHaveBeenCalled();
      done();
    });
  });

  it('should call discoverAllServicesAndCharacteristics when connected', (done) => {
    const isConnected = true;
    const device = createDevice();

    jest
      .spyOn(device, 'isConnected')
      .mockReturnValue(Promise.resolve(isConnected));

    const discoverAllServicesAndCharacteristicsMockFn = jest
      .spyOn(device, 'discoverAllServicesAndCharacteristics')
      .mockImplementation(() => Promise.resolve(device));

    jest
      .spyOn(device, 'connect')
      .mockImplementation(() => Promise.resolve(device));

    const connection$ = createDeviceConnection(device);

    connection$.subscribe((connection) => {
      expect(connection).toEqual(device);
      expect(discoverAllServicesAndCharacteristicsMockFn).toHaveBeenCalledTimes(
        1,
      );
      done();
    });
  });

  it('should call discoverAllServicesAndCharacteristics when connected initally false', (done) => {
    const isConnected = false;
    const device = createDevice();

    jest
      .spyOn(device, 'isConnected')
      .mockReturnValue(Promise.resolve(isConnected));

    const discoverAllServicesAndCharacteristicsMockFn = jest
      .spyOn(device, 'discoverAllServicesAndCharacteristics')
      .mockImplementation(() => Promise.resolve(device));

    jest
      .spyOn(device, 'connect')
      .mockImplementation(() => Promise.resolve(device));

    const connection$ = createDeviceConnection(device);

    connection$.subscribe((connection) => {
      expect(connection).toEqual(device);
      expect(discoverAllServicesAndCharacteristicsMockFn).toHaveBeenCalledTimes(
        1,
      );
      done();
    });
  });
});
