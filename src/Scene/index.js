class Scene {
  constructor(name) {
    this.name = name;
    this.views = [];
    this.assets = [];
  }

  addView(view) {
    this.views = [...this.views, view];
  }

  addAsset(asset) {
    this.assets = [...this.assets, asset];
  }

  async preload() {
    const promises = [];
    for (const asset of this.assets) {
      let promise;
      if (asset.type === "image") {
        promise = new Promise((resolve, reject) => {
          const img = new Image();
          img.onerror = reject;
          img.src = asset.src;

          img.onload = () => {
            asset.src = img;
            resolve();
          };
        });
      } else {
        const loadFont = async (asset) => {
          try {
            const font = new FontFace(asset.name, `url(${asset.src})`);
            await font.load();
            document.fonts.add(font);
            return Promise.resolve();
          } catch (error) {
            return Promise.reject(error);
          }
        };
        promise = loadFont(asset);
      }
      promises.push(promise);
    }

    await Promise.all(promises);
  }

  propagateAssets() {
    for (const view of this.views) {
      view.assets = this.assets;
      view.preload();
    }
  }

  manageEvent(action, pos, state) {
    let activeView;

    for (const view of this.views) {
      if (
        pos.x > view.boundaryMin.x &&
        pos.x < view.boundaryMax.x &&
        pos.y > view.boundaryMin.y &&
        pos.y < view.boundaryMax.y
      ) {
        if (!activeView) {
          activeView = view;
          continue;
        }

        if (view.area > activeView.area) continue;

        activeView = view;
      }
    }

    if (this.lastActiveView) this.lastActiveView.handleMouseLeave();

    if (activeView) {
      activeView[action](state, pos);
      this.lastActiveView = activeView;
    }
  }

  clear() {
    for (const view of this.views) {
      view.clear();
    }
  }

  render() {
    for (const view of this.views) {
      view.render();
    }
  }

  update() {
    for (const view of this.views) {
      view.update();
    }
  }
}

export default Scene;
