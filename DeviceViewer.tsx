import React from 'react';
import {Device} from 'react-native-ble-plx';
import {Card, Title, Text} from 'react-native-paper';

export type DeviceViewerProps = {
  device: Device;
};

const DeviceViewer: React.FunctionComponent<DeviceViewerProps> = ({device}) => {
  return (
    <Card>
      <Title>{device.name}</Title>
      <Text>{device.id} </Text>
    </Card>
  );
};

export default DeviceViewer;
