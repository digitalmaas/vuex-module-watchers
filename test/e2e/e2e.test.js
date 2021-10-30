import Vue from 'vue'
import Vuex, { Store as VuexStore } from 'vuex'
import { VuexWatchingStore } from '../../lib'
import { getBaseStore, getWatchingModule } from './helper'

// const util = require('util')
// const setTimeoutPromise = util.promisify(setTimeout)

describe('e2e', () => {
  let store

  it('should initialise successfully', function () {
    Vue.use(Vuex)
    store = new VuexWatchingStore(getBaseStore())
    expect(store).toBeDefined()
    expect(store).toBeInstanceOf(VuexStore)
    expect(store).toBeInstanceOf(VuexWatchingStore)
  })

  it('should register new module successfully', function () {
    store.registerModule('registeredModule', getWatchingModule())
    expect(store.state.registeredModule.exists).toBe(true)
  })
})
