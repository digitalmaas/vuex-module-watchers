import { get } from 'shvl'
import WatcherContext from './watcher-context.js'

// //////////////////////////////////////

function initialiseWatcher (store, entry) {
  const unsubscribers = []
  for (const [key, optionsOrFn] of Object.entries(entry.watches)) {
    const { handler, options } = prepareHandlerAndOptions(entry.namespace, key, optionsOrFn)
    const exprFn = prepareWatcherExpressionFunction(key)
    const callback = generateCallback(handler, entry.namespace, store)
    unsubscribers.push(store.watch(exprFn, callback, options))
  }
  return unsubscribers
}

function prepareWatcherExpressionFunction (key) {
  let fn
  if (key.includes('/')) {
    if (key.charAt(0) === '/') {
      key = key.slice(1)
    }
    fn = (_, getters) => getters[key]
  } else {
    fn = state => get(state, key)
  }
  return fn
}

function prepareHandlerAndOptions (namespace, key, optionsOrFn) {
  let options
  let handler
  if (typeof optionsOrFn === 'function') {
    handler = optionsOrFn
  } else if (typeof optionsOrFn === 'object') {
    handler = optionsOrFn.handler
    if (typeof handler !== 'function') {
      throw new TypeError(`invalid watcher handler in "${namespace}" for "${key}"`)
    }
    options = {
      deep: get(optionsOrFn, 'deep', false),
      immediate: get(optionsOrFn, 'immediate', false)
    }
  } else {
    throw new TypeError(`invalid watcher handler in "${namespace}" for "${key}"`)
  }
  return { handler, options }
}

function generateCallback (handlerFn, namespace, store) {
  return function (newValue, oldValue) {
    return handlerFn(new WatcherContext(namespace, store), newValue, oldValue)
  }
}

// //////////////////////////////////////

export default function vuexWatcherPlugin (store) {
  if (store._tracker) {
    for (const entry of store._tracker.getPendingWatchers()) {
      const unsubscribers = initialiseWatcher(store, entry)
      store._tracker.setUnsubscribers(entry.namespace, unsubscribers)
    }
  } else {
    setTimeout(() => vuexWatcherPlugin(store), 0) // Next-tick
  }
}
