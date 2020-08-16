import {PermissionsAndroid} from 'react-native';

export async function requestPermissionForBle() {
  try {
    const grantedLocation = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    const grantedBackground = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    );
    if (
      grantedLocation === PermissionsAndroid.RESULTS.GRANTED &&
      grantedBackground === PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('Location permission for bluetooth scanning granted');
      return true;
    } else {
      console.log('Location permission for bluetooth scanning revoked');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}
