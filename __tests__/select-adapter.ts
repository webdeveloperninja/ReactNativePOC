import {BleManager, State} from 'react-native-ble-plx';
import {selectAdapterState} from '../src/infrastructure/bluetooth';
import {skip} from 'rxjs/operators';

describe('selectAdapterState', () => {
  it('should return initial state', (done) => {
    const adapterState = State.PoweredOn;

    const bleManager = {
      onStateChange: (state) => {},
      state: () => Promise.resolve(adapterState),
    } as BleManager;

    const adapterState$ = selectAdapterState(bleManager);

    jest
      .spyOn(bleManager, 'state')
      .mockReturnValue(Promise.resolve(adapterState));

    adapterState$.pipe(skip(1)).subscribe((state) => {
      expect(state).toEqual(adapterState);
      done();
    });
  });
});
