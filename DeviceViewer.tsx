import React from 'react';
import {TextInput} from 'react-native';
import {Device} from 'react-native-ble-plx';
import {Button, Card, Text, Title} from 'react-native-paper';

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
      <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(text) => onChangeText(text)}
        value={value}
      />
      <Button icon="broom" mode="contained" onPress={sendDataHandler}>
        Send Data
      </Button>
    </Card>
  );
};

export default DeviceViewer;
