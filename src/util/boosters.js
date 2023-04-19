import Animation from '../Animation';
import { dispatch, dispatchAll, getState } from '../store';
import {
  destroyTiles,
  onAllAnimationEnd,
  queueAnimation,
  refillBoard,
  runOnClick,
  toggleInteractivity,
  updateScore,
  updateTile,
} from '../store/actions';
import { settings } from './constants';
import { getViewByPos } from './scenes';

const boosters = [
  {
    name: 'bomb',
    count: 3,
    title: 'Бомба',
    action: () => {
      dispatch(
        runOnClick((renderer, pos) => {
          dispatch(toggleInteractivity(false));
          const view = getViewByPos(renderer, pos);
          if (view && view.viewType === 'tile') {
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
                dispatch(
                  updateTile({
                    ...view.tile,
                    opacity: 0,
                    behavior: 'bomb',
                  })
                );
                const fadeIn = new Animation(
                  (ti) =>
                    dispatch(
                      updateTile({
                        ...view.tile,
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
                        dispatch(runOnClick(null));
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
    },
  },
  {
    name: 'teleport',
    count: 3,
    title: 'Телепорт',
    action: (tile) => {
      console.log('dispatched');
      dispatch(
        runOnClick((view) => {
          if (view.viewType === 'tile') {
            console.log('yyyes');
          }
        })
      );
    },
  },
  {
    name: 'shuffle',
    count: 3,
    title: 'Перемешать',
    action: (tile) => {
      console.log('dispatched');
      dispatch(
        runOnClick((view) => {
          if (view.viewType === 'tile') {
            console.log('yyyes');
          }
        })
      );
    },
  },
];

export default boosters;
