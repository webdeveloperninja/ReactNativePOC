import React from 'react';
import {View} from 'react-native';
import {Device} from 'react-native-ble-plx';
import {Button, Card, Text, Title, RadioButton} from 'react-native-paper';

export type DeviceViewerProps = {
  device: Device;
  onSendDataToDevice: (data: string, device: Device) => void;
};

const DeviceViewer: React.FunctionComponent<DeviceViewerProps> = ({
  device,
  onSendDataToDevice,
}) => {
  const [value, setValue] = React.useState();

  const onChangeText = (text: string) => {
    setValue(text);
  };

  const sendDataHandler = () => {
    onSendDataToDevice(value, device);
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
    </Card>
  );
};

export default DeviceViewer;
