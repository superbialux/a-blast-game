import BlueTile from '../assets/blue.png';
import GreenTile from '../assets/green.png';
import PurpleTile from '../assets/purple.png';
import YellowTile from '../assets/yellow.png';
import RedTile from '../assets/red.png';
import SuperTile from '../assets/super.png';
import BoardBG from '../assets/board.png';

import ScoreBox from '../assets/scoreBox.png';
import Score from '../assets/score.png';
import Moves from '../assets/moves.png';
import Vector from '../Math/Vector';
import BoardView from '../Views/Board';
import Progress from '../Views/Progress';

const scenesSchema = [
  {
    name: 'game',
    views: [
      {
        name: 'board',
        Component: BoardView,
        pos: new Vector(0.3, 0.5), // in the range from 0 to 1 where 0.5 is the center of the screen;
        dim: new Vector(0.8, 0.8), // in the rnage from 0 to 1, relation to the resolution's bigger side
      },
      {
        name: 'progress',
        Component: Progress,
        pos: new Vector(0.8, 0.4), // in the range from 0 to 1 where 0.5 is the center of the screen;
        dim: new Vector(0.5, 0.5), // in the rnage from 0 to 1, relation to the resolution's bigger side
      },
    ],
    assets: [
      {
        name: 'scoreBox',
        src: ScoreBox,
        type: 'image',
      },
      {
        name: 'score',
        src: Score,
        type: 'image',
      },
      {
        name: 'moves',
        src: Moves,
        type: 'image',
      },
      { name: 'board', src: BoardBG, type: 'image' },
      {
        name: 'super',
        src: SuperTile,
        type: 'image',
      },
      {
        name: 'blue',
        src: BlueTile,
        type: 'image',
      },
      {
        name: 'green',
        src: GreenTile,
        type: 'image',
      },
      {
        name: 'purple',
        src: PurpleTile,
        type: 'image',
      },
      {
        name: 'yellow',
        src: YellowTile,
        type: 'image',
      },
      {
        name: 'red',
        src: RedTile,
        type: 'image',
      },
      {
        name: 'Seymour One',
        src: 'https://fonts.gstatic.com/s/seymourone/v20/4iCp6Khla9xbjQpoWGGd0lyLN4FNgYUJ31U.woff2',
        type: 'font',
      },
      {
        name: 'Seymour One',
        src: 'https://fonts.gstatic.com/s/seymourone/v20/4iCp6Khla9xbjQpoWGGd0lyPN4FNgYUJ.woff2',
        type: 'font',
      },
    ],
  },
];

// const finishAssets = [
//   {
//     name: 'scoreBox',
//     src: ScoreBox,
//     type: 'image',
//   },
//   {
//     name: 'score',
//     src: Score,
//     type: 'image',
//   },
//   {
//     name: 'moves',
//     src: Moves,
//     type: 'image',
//   },
// ];

export default scenesSchema;
