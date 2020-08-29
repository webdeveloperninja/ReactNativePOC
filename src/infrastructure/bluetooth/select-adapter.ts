import {BleManager, State} from 'react-native-ble-plx';
import {Observable, BehaviorSubject} from 'rxjs';

export const selectAdapterState = (manager: BleManager): Observable<State> => {
  const _adapterState$ = new BehaviorSubject<State>(State.Unknown);
  const adapterState$ = _adapterState$.asObservable();
  manager.onStateChange((newState) => _adapterState$.next(newState));

  manager.state().then((s) => _adapterState$.next(s));
  return adapterState$;
};
