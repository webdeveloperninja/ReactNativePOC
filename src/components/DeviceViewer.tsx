import {decode} from 'base-64';
import React, {useState, useEffect} from 'react';
import {Switch, View} from 'react-native';
import {Characteristic, Device} from 'react-native-ble-plx';
import {Card, Text, Title} from 'react-native-paper';
import {gpio2CharacteristicId, serviceId} from '../infrastructure/bluetooth';

export type DeviceViewerProps = {
  device: Device;
  onSendDataToDevice: (data: string, device: Device) => void;
};

const DeviceViewer: React.FunctionComponent<DeviceViewerProps> = ({
  device,
  onSendDataToDevice,
}) => {
  const [lastKnownPin2Value, setLastKnownPin2Value] = useState<
    Characteristic
  >();
  const [assumedPin2Value, setAssumedPin2Value] = useState<boolean>();

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

  const toggleGpioPin2 = (value: boolean) => {
    onSendDataToDevice(value ? 'start_process' : 'stop_process', device);
    setAssumedPin2Value(value);
  };

  useEffect(() => {
    getPin2Value();
  }, []);

  return (
    <Card>
      <Title>{device.name}</Title>

      <View style={{flexDirection: 'row'}}>
        <Text>GPIO Pin 2 </Text>
        <Switch onValueChange={toggleGpioPin2} value={assumedPin2Value} />
      </View>
    </Card>
  );
};

export default DeviceViewer;
