import 'normalize.css';
import './index.css';
import Vector from './Math/Vector';
import Scene from './Scene';
import TileView from './Views/Tile';
import Renderer from './Renderer';
import { getState, dispatch } from './store';
import { changeScene, createBoosters, createTiles } from './store/actions';
import { scenesSchema } from './util/scenes';
import Booster from './Views/Booster';
import boosters from './util/boosters';

const renderer = new Renderer('2d');
const ctx = renderer.init();

(async () => {
  const size = Math.min(renderer.res.x, renderer.res.y);
  // Reveal variables to the outer scope
  const views = {};
  const scenes = {};

  const promises = scenesSchema.map(async (s) => {
    const scene = new Scene(s.name);
    scenes[s.name] = scene;
    s.views.forEach((v) => {
      const pos = Vector.mult(v.pos, renderer.res);
      let dim = Vector.mult(v.dim, size);
      if (v.fullscreen) dim = Vector.mult(v.dim, renderer.res);
      const view = new v.Component(ctx, Vector.sub(pos, Vector.div(dim, 2)), dim);

      views[v.name] = view;
      scene.addView(view);
    });
    s.assets.forEach((a) => {
      scene.addAsset(a);
    });
    await scene.preload();
    renderer.addScene(scene);
  });

  dispatch(createTiles(views.board.pos, views.board.dim));

  getState()
    .tiles.map((tile) => new TileView(ctx, tile, views.board))
    .forEach((tile) => scenes.game.addView(tile));

  dispatch(createBoosters(boosters));

  const { boosters: boostersState } = getState();

  Object.keys(boostersState)
    .map((key, i) => {
      const dim = Vector.div(views.boosters.dim, boosters.length);
      const pos = Vector.add(views.boosters.pos, new Vector(dim.x * i, dim.y * 0.2));
      return new Booster(
        ctx,
        pos,
        dim,
        boosters.find(({ name }) => name === key)
      );
    })
    .forEach((booster) => scenes.game.addView(booster, true));

  await Promise.all(promises);

  renderer.scenes.forEach((scene) => scene.propagateAssets());
  renderer.update();
  renderer.render(() => {
    if (getState().moves === 0) {
      scenes.game.clear();
      dispatch(changeScene('finish'));
    }
  });
})();

renderer.canvas.addEventListener(
  'click',
  (e) => {
    const animations = getState().animations.filter(({ finished }) => !finished);

    if (animations.length > 0 || !getState().canInteract) return;
    const bounds = renderer.canvas.getBoundingClientRect();
    const pos = new Vector(e.clientX - bounds.left, e.clientY - bounds.top);
    pos.div(new Vector(bounds.width, bounds.height));
    pos.mult(renderer.res);
    if (getState().runOnClick) {
      getState().runOnClick(renderer, pos);
      return;
    }
    renderer.manageEvent('handleClick', pos);
  },
  false
);

renderer.canvas.addEventListener(
  'mousemove',
  (e) => {
    const bounds = renderer.canvas.getBoundingClientRect();
    const pos = new Vector(e.clientX - bounds.left, e.clientY - bounds.top);
    pos.div(new Vector(bounds.width, bounds.height));
    pos.mult(renderer.res);
    renderer.manageEvent('handleHover', pos);
  },
  false
);
