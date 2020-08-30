import {decode} from 'base-64';
import React, {useState, useEffect} from 'react';
import {Switch, View} from 'react-native';
import {Characteristic, Device} from 'react-native-ble-plx';
import {Card, Text, Title} from 'react-native-paper';
import {
  gpio2CharacteristicId,
  serviceId,
  gpio4CharacteristicId,
} from '../infrastructure/bluetooth';

export type DeviceViewerProps = {
  device: Device;
  onSendDataToDevice: (
    data: string,
    device: Device,
    characteristicId: string,
  ) => void;
};

const DeviceViewer: React.FunctionComponent<DeviceViewerProps> = ({
  device,
  onSendDataToDevice,
}) => {
  const [lastKnownPin2Value, setLastKnownPin2Value] = useState<
    Characteristic
  >();
  const [lastKnownPin4Value, setLastKnownPin4Value] = useState<
    Characteristic
  >();
  const [assumedPin2Value, setAssumedPin2Value] = useState<boolean>();
  const [assumedPin4Value, setAssumedPin4Value] = useState<boolean>();

  const getPin2Value = async () => {
    const characteristic = await device.readCharacteristicForService(
      serviceId,
      gpio2CharacteristicId,
    );
    setLastKnownPin2Value(characteristic);

    const value = !!Number(
      decode(characteristic.value ? characteristic.value : ''),
    );
    setAssumedPin2Value(value);
  };

  const getPin4Value = async () => {
    const characteristic = await device.readCharacteristicForService(
      serviceId,
      gpio4CharacteristicId,
    );
    setLastKnownPin4Value(characteristic);

    const value = !!Number(
      decode(characteristic.value ? characteristic.value : ''),
    );
    setAssumedPin4Value(value);
  };

  const toggleGpioPin2 = (value: boolean) => {
    onSendDataToDevice(
      value ? 'start_process' : 'stop_process',
      device,
      gpio2CharacteristicId,
    );
    setAssumedPin2Value(value);
  };

  const toggleGpioPin4 = (value: boolean) => {
    onSendDataToDevice(
      value ? 'start_process' : 'stop_process',
      device,
      gpio4CharacteristicId,
    );
    setAssumedPin4Value(value);
  };

  useEffect(() => {
    getPin2Value();
    getPin4Value();
  }, []);

  return (
    <Card>
      <Title>{device.name}</Title>

      <View style={{flexDirection: 'row'}}>
        <Text>GPIO Pin 2 </Text>
        <Switch onValueChange={toggleGpioPin2} value={assumedPin2Value} />
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text>GPIO Pin 4 </Text>
        <Switch onValueChange={toggleGpioPin4} value={assumedPin4Value} />
      </View>
    </Card>
  );
};

export default DeviceViewer;
