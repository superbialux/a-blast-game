class Scene {
  constructor(name) {
    this.name = name;
    this.views = [];
    this.assets = [];
    this.loadedAssets = {};
  }

  addView(view, pushToFront = false) {
    if (pushToFront) {
      this.views = [view, ...this.views];
    } else {
      this.views = [...this.views, view];
    }
  }

  addAsset(asset) {
    this.assets = [...this.assets, asset];
  }

  async preload() {
    const promises = [];
    this.assets.forEach((asset) => {
      let promise;
      if (asset.type === 'image') {
        promise = new Promise((resolve, reject) => {
          const img = new Image();
          img.onerror = reject;
          img.src = asset.src;

          img.onload = () => {
            this.loadedAssets[asset.name] = img;
            resolve();
          };
        });
      } else {
        const loadFont = async (f) => {
          try {
            const font = new FontFace(f.name, `url(${f.src})`);
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
    });

    await Promise.all(promises);
  }

  propagateAssets() {
    this.views.forEach((view) => {
      view.assets = this.loadedAssets;
      view.preload();
    });
  }

  manageEvent(action, pos) {
    let activeView;

    this.views.forEach((view) => {
      if (
        pos.x > view.boundaryMin.x &&
        pos.x < view.boundaryMax.x &&
        pos.y > view.boundaryMin.y &&
        pos.y < view.boundaryMax.y
      ) {
        if (!activeView) {
          activeView = view;
          return;
        }

        if (view.area > activeView.area) return;

        activeView = view;
      }
    });

    if (this.lastActiveView) this.lastActiveView.handleMouseLeave();

    if (activeView) {
      activeView[action](pos);
      this.lastActiveView = activeView;
    }
  }

  clear() {
    this.views.forEach((view) => view.clear());
  }

  render() {
    this.views.forEach((view) => view.render());
  }

  update() {
    this.views.forEach((view) => view.update());
  }
}

export default Scene;
