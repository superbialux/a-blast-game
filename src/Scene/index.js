class Scene {
  constructor(views, assets) {
    this.views = views;
    this.assets = assets;
    this.tasks = [];
    this.lastActiveView;
  }

  preload() {
    const promises = [];
    for (const asset of this.assets) {
      const promise = new Promise((resolve, reject) => {
        const img = new Image();
        img.onerror = reject;
        img.src = asset.src;

        img.onload = () => {
          asset.src = img;
          resolve();
        };
      });
      promises.push(promise);
    }

    return Promise.all(promises).then(() => {
      for (const view of this.views) {
        view.assets = this.assets;
        view.preload();
      }
    });
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

  render(mousePos) {
    for (const view of this.views) {
      view.render(mousePos);
    }
  }

  update() {
    for (const task of this.tasks) {
      task();
    }
  }

  addTask(task) {
    this.tasks.push(task);
  }
}

export default Scene;
