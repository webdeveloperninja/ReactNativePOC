import React from 'react';
import {Text, View} from 'react-native';
import {BleManager, State} from 'react-native-ble-plx';
import {BehaviorSubject, Observable} from 'rxjs';
import {useObservable} from 'rxjs-hooks';

const selectAdapterState = (manager: BleManager): Observable<State> => {
  const _adapterState$ = new BehaviorSubject<State>(State.Unknown);
  const adapterState$ = _adapterState$.asObservable();
  manager.onStateChange((newState) => _adapterState$.next(newState));

  return adapterState$;
};

const App: React.FC = () => {
  const bleManager = new BleManager();
  const bluetoothAdapterState$ = selectAdapterState(bleManager);
  const bluetoothAdapterState: State | null = useObservable(
    () => bluetoothAdapterState$,
  );

  return (
    <View>
      <Text>BLE Application</Text>
      <Text>Adapter State: {bluetoothAdapterState}</Text>
    </View>
  );
};

export default App;
