import {BleManager, Device} from 'react-native-ble-plx';
import {from} from 'rxjs';
import {serviceId, characteristicId} from './devices/esp32';
import {encode} from 'base-64';

const base64StringKey = 'base64';

export const sendDataToDevice = (
  valueToSend: string,
  bleManager: BleManager,
  device: Device,
) => {
  const base64Value = encode(valueToSend);

  return from(
    bleManager.writeCharacteristicWithoutResponseForDevice(
      device.id,
      serviceId,
      characteristicId,
      base64Value,
    ),
  );
};
