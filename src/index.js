import "normalize.css";
import "./index.css";
import Vector from "./Math/Vector";
import BoardView from "./Views/Board";

import Scene from "./Scene";
import TileView from "./Views/Tile";
import Renderer from "./Renderer";
import { getState, dispatch } from "./store";
import { changeScene, createTiles } from "./store/actions";
import Progress from "./Views/Progress";
import { settings } from "./util/constants";
import { finishAssets, gameAssets, scenesSchema } from "./util/scenes";

const renderer = new Renderer("2d");
const ctx = renderer.init();

(async () => {
  const size = Math.min(renderer.res.x, renderer.res.y);
  // Reveal variables to the outer scope
  const views = {},
    scenes = {};

  const promises = scenesSchema.map(async (s) => {
    const scene = new Scene(s.name);
    scenes[s.name] = scene;
    s.views.forEach((v) => {
      const pos = Vector.mult(v.pos, renderer.res);
      const dim = Vector.mult(v.dim, size);
      const view = new v.component(
        ctx,
        Vector.sub(pos, Vector.div(dim, 2)),
        dim
      );

      views[v.name] = view;
      scene.addView(view);
    });
    s.assets.forEach((a) => {
      scene.addAsset(a);
    });
    await scene.preload();
    renderer.addScene(scene);
  });

  dispatch(createTiles(settings.size, views.board.pos, views.board.dim));

  getState()
    .tiles.map((tile) => new TileView(ctx, tile, views.board))
    .forEach((tile) => scenes.game.addView(tile));

  await Promise.all(promises);

  renderer.scenes.forEach((scene) => scene.propagateAssets());
  renderer.update();
  renderer.render();
  // dispatch(createTiles(settings.size, board.dim, board.pos));
  // getState()
  //   .tiles.map(
  //     (tile) => new TileView(ctx, tile, board.boundaryMin, board.boundaryMax)
  //   )
  //   .forEach((tile) => game.addView(tile));

  // await game.preload();

  // renderer.render(() => {
  //   if (getState().moves === 0) {
  //     game.clear()
  //     dispatch(changeScene('finish'))
  //   }
  // }) ;
})();

const container = document.getElementById("wrapper");
renderer.canvas.addEventListener(
  "click",
  (e) => {
    const animations = getState().animations.filter(
      ({ finished }) => !finished
    );

    if (animations.length > 0 || !getState().canInteract) return;
    const bounds = renderer.canvas.getBoundingClientRect();
    const pos = new Vector(e.clientX - bounds.left, e.clientY - bounds.top);
    pos.div(new Vector(bounds.width, bounds.height));
    pos.mult(renderer.res);
    renderer.manageEvent("handleClick", pos);
  },
  false
);

renderer.canvas.addEventListener(
  "mousemove",
  (e) => {
    renderer.manageEvent("handleHover", new Vector(e.offsetX, e.offsetY));
  },
  false
);
