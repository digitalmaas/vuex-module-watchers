import { Store } from 'vuex'

import plugin from './plugin'
import WatcherTracker from './watcher-tracker'

// //////////////////////////////////////

export class VuexWatchingStore extends Store {
  constructor(options = {}) {
    if (options && options.plugins && Array.isArray(options.plugins)) {
      options.plugins = [...options.plugins, plugin]
    } else {
      options.plugins = [plugin]
    }
    super(options)
    this._watchersTracker = new WatcherTracker()
    this.#registerModuleWatcher([], options)
    if (VuexWatchingStore.#moduleHas(options, 'modules')) {
      this.#registerSubmodulesWatchers(options.modules)
    }
  }

  registerModule(path, module, options) {
    this.#registerModuleWatcher(path, module)
    if (VuexWatchingStore.#moduleHas(module, 'modules')) {
      this.#registerSubmodulesWatchers(module.modules, path)
    }
    super.registerModule(path, module, options)
  }

  unregisterModule(path) {
    this._watchersTracker.remove(path)
    super.unregisterModule(path)
  }

  #registerModuleWatcher(path, module) {
    if (VuexWatchingStore.#moduleHas(module, 'watch')) {
      this._watchersTracker.add(path, module.watch)
    }
  }

  #registerSubmodulesWatchers(modules, nested = []) {
    for (const [name, module] of Object.entries(modules)) {
      const path = [...(Array.isArray(nested) ? nested : [nested]), name]
      this.#registerModuleWatcher(path, module)
      if (VuexWatchingStore.#moduleHas(module, 'modules')) {
        this.#registerSubmodulesWatchers(module.modules, path)
      }
    }
  }

  static #moduleHas(module, prop) {
    return Boolean(module && module[prop] && typeof module[prop] === 'object')
  }
}

// //////////////////////////////////////

export default VuexWatchingStore
