class Scene {
  constructor(views, assets) {
    this.views = views;
    this.assets = assets;
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

    const p = Promise.all(promises);
    p.then(() => {
      for (const view of this.views) {
        view.assets = this.assets;
      }
    });
    return p;
  }

  detectClick(pos) {
    for (const view of this.views) {
      if (
        pos.x > view.boundaryMin.x &&
        pos.x < view.boundaryMax.x &&
        pos.y > view.boundaryMin.y &&
        pos.y < view.boundaryMax.y
      )
        return view;
    }
  }

  clear() {
    for (const view of this.views) {
      view.clear();
    }
  }

  update(state) {
    for (const view of this.views) {
      view.update(state);
    }
  }

  render(mousePos) {
    for (const view of this.views) {
      view.render(mousePos);
    }
  }
}

export default Scene;
