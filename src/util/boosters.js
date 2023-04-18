import { dispatch } from '../store';
import { runOnClick } from '../store/actions';

const boosters = [
  {
    name: 'bomb',
    count: 3,
    title: 'Бомба',
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
