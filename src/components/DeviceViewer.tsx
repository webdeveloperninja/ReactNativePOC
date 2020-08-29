import {decode} from 'base-64';
import React, {useState} from 'react';
import {View} from 'react-native';
import {Characteristic, Device} from 'react-native-ble-plx';
import {Button, Card, RadioButton, Text, Title} from 'react-native-paper';
import {gpio2CharacteristicId, serviceId} from '../infrastructure/bluetooth';

export type DeviceViewerProps = {
  device: Device;
  onSendDataToDevice: (data: string, device: Device) => void;
};

const DeviceViewer: React.FunctionComponent<DeviceViewerProps> = ({
  device,
  onSendDataToDevice,
}) => {
  const [value, setValue] = useState<string>();
  const [characteristic, setCharacteristic] = useState<Characteristic>();

  const onChangeText = (text: string) => {
    setValue(text);
  };

  const sendDataHandler = () => {
    onSendDataToDevice(value ? value : '', device);
  };

  const getCharacteristics = async () => {
    const characteristic = await device.readCharacteristicForService(
      serviceId,
      gpio2CharacteristicId,
    );
    setCharacteristic(characteristic);
  };

  return (
    <Card>
      <Title>{device.name}</Title>
      <Text>{device.id} </Text>

      <View style={{flexDirection: 'row'}}>
        <Text>Start Process</Text>
        <RadioButton
          value="start_process"
          status={value === 'start_process' ? 'checked' : 'unchecked'}
          onPress={() => onChangeText('start_process')}
        />
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text>End Process</Text>
        <RadioButton
          value="stop_process"
          status={value === 'stop_process' ? 'checked' : 'unchecked'}
          onPress={() => onChangeText('stop_process')}
        />
      </View>

      <Button icon="broom" mode="contained" onPress={sendDataHandler}>
        Send Command
      </Button>

      <Button icon="broom" mode="contained" onPress={getCharacteristics}>
        Get Characteristics Value
      </Button>

      <Text>{!!characteristic ? decode(characteristic.value) : ''}</Text>
    </Card>
  );
};

export default DeviceViewer;
