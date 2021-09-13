import { get as _get } from 'shvl'

// //////////////////////////////////////

export default class WatcherContext {
  #namespace
  #store

  constructor(namespace, store) {
    this.#namespace = namespace
    this.#store = store
  }

  get getters() {
    const proxied = { ns: this.#namespace, st: this.#store }
    return new Proxy(proxied, {
      get({ ns, st }, prop) {
        return st.getters[ns.concat(prop).join('/')]
      }
    })
  }

  get state() {
    return _get(this.#store.state, this.#namespace.join('.'))
  }

  get rootState() {
    return this.#store.state
  }

  get rootGetters() {
    return this.#store.getters
  }

  commit(mutation, payload, options) {
    if (options && options.root) {
      this.#store.commit(mutation, payload)
    } else {
      this.#store.commit(this.#namespace.concat(mutation).join('/'), payload)
    }
  }

  dispatch(actionOrPayload, payloadOrOptions, options) {
    return typeof actionOrPayload === 'object'
      ? this.#dispatchWithObject(actionOrPayload, payloadOrOptions)
      : this.#dispatchWithString(actionOrPayload, payloadOrOptions, options)
  }

  #dispatchWithObject(payload, options) {
    if (!(options && options.root)) {
      payload.type = this.#namespace.concat(payload.type).join('/')
    }
    return this.#store.dispatch(payload)
  }

  #dispatchWithString(action, payload, options) {
    if (!(options && options.root)) {
      action = this.#namespace.concat(action).join('/')
    }
    return this.#store.dispatch(action, payload)
  }
}
