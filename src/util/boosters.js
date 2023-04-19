import Animation from '../Animation';
import { dispatch, dispatchAll, getState } from '../store';
import {
  destroyTiles,
  onAllAnimationEnd,
  queueAnimation,
  refillBoard,
  runOnClick,
  shuffleBoard,
  toggleInteractivity,
  updateScore,
  updateTile,
  useBooster,
} from '../store/actions';
import { settings } from './constants';
import { getViewByPos } from './scenes';

const isAvailable = (name) => getState().boosters[name].count > 0;

const boosters = [
  {
    name: 'bomb',
    count: 3,
    title: 'Бомба',
    action: () => {
      if (isAvailable('bomb')) {
        dispatch(
          runOnClick((renderer, pos) => {
            const view = getViewByPos(renderer, pos);
            if (view && view.viewType === 'tile') {
              dispatch(useBooster('bomb'));
              dispatch(runOnClick(null));
              dispatch(toggleInteractivity(false));
              const fadeOut = new Animation(
                (t) => {
                  dispatch(
                    updateTile({
                      ...view.tile,
                      opacity: 1 - t,
                    })
                  );
                },
                Math.round(settings.transformToBombDuration / 2),
                () => {
                  const fadeIn = new Animation(
                    (ti) =>
                      dispatch(
                        updateTile({
                          ...view.tile,
                          behavior: 'bomb',
                          opacity: ti,
                        })
                      ),
                    settings.transformToBombDuration,
                    () => {
                      const updatedView = getState().tiles.find(({ indices }) =>
                        indices.isEqual(view.tile.indices)
                      );
                      dispatchAll([
                        destroyTiles(updatedView),
                        updateScore(),
                        onAllAnimationEnd(() => {
                          dispatch(refillBoard());
                          dispatch(toggleInteractivity(true));
                        }),
                      ]);
                    }
                  );
                  dispatch(queueAnimation(fadeIn));
                }
              );
              dispatch(queueAnimation(fadeOut));
            } else {
              dispatch(runOnClick(null));
            }
          })
        );
      }
    },
  },
  {
    name: 'teleport',
    count: 3,
    title: 'Телепорт',
    action: () => {
      if (isAvailable('teleport')) {
        const tiles = [];
        dispatch(
          runOnClick((renderer, pos) => {
            const view = getViewByPos(renderer, pos);
            if (view && view.viewType === 'tile') {
              tiles.push(view.tile);
              if (tiles.length === 2) {
                dispatch(useBooster('teleport'));
                tiles.forEach((tile, i) => {
                  const otherTile = i === 1 ? tiles[0] : tiles[1];
                  const fadeOut = new Animation(
                    (t) => {
                      dispatch(
                        updateTile({
                          ...tile,
                          opacity: 1 - t,
                        })
                      );
                    },
                    Math.round(settings.teleportDuration / 2),
                    () => {
                      const fadeIn = new Animation(
                        (ti) =>
                          dispatch(
                            updateTile({
                              ...tile,
                              type: otherTile.type,
                              behavior: otherTile.behavior,
                              opacity: ti,
                            })
                          ),
                        settings.teleportDuration
                      );
                      dispatch(queueAnimation(fadeIn));
                    }
                  );
                  dispatch(queueAnimation(fadeOut));
                });

                dispatch(onAllAnimationEnd(() => dispatch(runOnClick(null))));

                dispatchAll([
                  updateTile({
                    ...tiles[0],
                    type: tiles[1].type,
                    behavior: tiles[1].behavior,
                  }),
                  updateTile({
                    ...tiles[1],
                    type: tiles[0].type,
                    behavior: tiles[0].behavior,
                  }),
                ]);
                dispatch(runOnClick(null));
              }
            } else {
              dispatch(runOnClick(null));
            }
          })
        );
      }
    },
  },
  {
    name: 'shuffle',
    count: 3,
    title: 'Перемешать',
    action: () => {
      if (isAvailable('shuffle')) dispatchAll([shuffleBoard(), useBooster('shuffle')]);
    },
  },
];

export default boosters;
