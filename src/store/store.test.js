import { getState, dispatch, initialState } from '.';
import Vector from '../Math/Vector';
import { settings } from '../util/constants';
import { isBoardPlayable } from '../util/tiles';
import { createTiles } from './actions';

describe('common store behavior', () => {
  test('store exists', () => {
    expect(getState()).toBe(initialState);
  });
  test('tiles get created', () => {
    dispatch(createTiles(new Vector(0, 0), new Vector(50, 50)));
    expect(getState().tiles).toHaveLength(settings.size.x * settings.size.y);
  });
  test('there are always tiles that can be destroyed', () => {
    let isPlayable = false;
    for (let i = 0; i < 1000; i += 1) {
      dispatch(createTiles(new Vector(0, 0), new Vector(50, 50)));
      isPlayable = isBoardPlayable(getState().tiles);
    }
    expect(isPlayable).toBe(true);
  });
});
