export default class WatcherTracker {
  constructor() {
    this._map = {}
  }

  add(namespace, watchers) {
    const ns = WatcherTracker.normaliseNamespace(namespace)
    this._map[ns] = { watchers }
  }

  setUnsubscribers(namespace, unsubscribers) {
    if (this._map[namespace]) {
      this._map[namespace].unsubscribers = unsubscribers
    }
  }

  * getPendingWatchers() {
    for (const [namespace, details] of Object.entries(this._map)) {
      if (!details.unsubscribers) {
        yield { namespace, watchers: details.watchers }
      }
    }
  }

  remove(namespace) {
    const ns = WatcherTracker.normaliseNamespace(namespace)
    for (const item in this._map) {
      if (item.startsWith(ns)) {
        const details = this._map[item]
        if (details?.unsubscribers?.length > 0) {
          for (const unsub of details.unsubscribers) {
            unsub()
          }
        }
        delete details.unsubscribers
        delete details.watchers
        delete this._map[item]
      }
    }
  }

  static normaliseNamespace(namespace) {
    return Array.isArray(namespace) ? namespace.join('/') : namespace.toString()
  }
}
