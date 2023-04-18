import { getState, dispatch, initialState } from '.';
import Vector from '../Math/Vector';
import { settings } from '../util/constants';
import { createTiles } from './actions';

test('Create store', () => {
  expect(getState()).toBe(initialState);
});

test('Create tiles', () => {
  dispatch(createTiles(new Vector(0, 0), new Vector(50, 50)));
  expect(getState().tiles).toHaveLength(settings.size.x * settings.size.y);
});
