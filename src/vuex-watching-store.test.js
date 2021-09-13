import { Store } from 'vuex'

import plugin from './plugin'
import WatcherTracker from './watcher-tracker'
import VuexWatchingStore from './vuex-watching-store' // eslint-disable-line import/no-named-as-default

jest.mock('vuex')
jest.mock('./plugin')
jest.mock('./watcher-tracker')

// //////////////////////////////////////

describe('vuex-watching-store.js', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should export class/function', () => {
    expect(VuexWatchingStore).toBeInstanceOf(Function)
  })

  it('should add plugin if none has been used', () => {
    const options = {}
    const instance = new VuexWatchingStore(options)
    expect(instance).toBeInstanceOf(Store)
    expect(Store).toHaveBeenCalledTimes(1)
    expect(options.plugins).toHaveLength(1)
    expect(options.plugins[0]).toBe(plugin)
  })

  it('should add plugin to end of original plugins', () => {
    const options = { plugins: ['other'] }
    const instance = new VuexWatchingStore(options)
    expect(instance).toBeInstanceOf(Store)
    expect(Store).toHaveBeenCalledTimes(1)
    expect(options.plugins).toHaveLength(2)
    expect(options.plugins[1]).toBe(plugin)
  })

  it('should not process module without watch', () => {
    const submodule = {}
    const moduleA = { modules: { submodule } }
    const options = { modules: { moduleA } }
    const instance = new VuexWatchingStore(options)
    const trackerInstance = WatcherTracker.mock.instances[0]
    expect(instance).toBeInstanceOf(Store)
    expect(WatcherTracker).toHaveBeenCalledTimes(1)
    expect(trackerInstance.add).toHaveBeenCalledTimes(0)
    expect(trackerInstance.remove).toHaveBeenCalledTimes(0)
  })

  it('should correctly process initial modules', () => {
    const watchB = {}
    const moduleB = { watch: watchB }
    const watchA = {}
    const moduleA = { modules: { moduleB }, watch: watchA }
    const rootWatch = {}
    const options = { modules: { moduleA }, watch: rootWatch }
    const instance = new VuexWatchingStore(options)
    const trackerInstance = WatcherTracker.mock.instances[0]
    expect(instance).toBeInstanceOf(Store)
    expect(WatcherTracker).toHaveBeenCalledTimes(1)
    expect(trackerInstance.add).toHaveBeenCalledTimes(3)
    expect(trackerInstance.add).toHaveBeenCalledWith([], rootWatch)
    expect(trackerInstance.add).toHaveBeenCalledWith(['moduleA'], watchA)
    expect(trackerInstance.add).toHaveBeenCalledWith(['moduleA', 'moduleB'], watchB)
    expect(trackerInstance.remove).toHaveBeenCalledTimes(0)
  })

  it('should add and remove modules successfully', () => {
    const watchB = {}
    const watchA = {}
    const module = { modules: { submod: { watch: watchB } }, watch: watchA }
    const instance = new VuexWatchingStore()
    const trackerInstance = WatcherTracker.mock.instances[0]
    expect(WatcherTracker).toHaveBeenCalledTimes(1)
    expect(trackerInstance.add).toHaveBeenCalledTimes(0)
    expect(trackerInstance.remove).toHaveBeenCalledTimes(0)
    const moduleName = 'my/cool/module'
    instance.registerModule(moduleName, module)
    expect(Store.prototype.registerModule).toHaveBeenCalledTimes(1)
    expect(trackerInstance.add).toHaveBeenCalledTimes(2)
    expect(trackerInstance.add).toHaveBeenCalledWith(moduleName, watchA)
    expect(trackerInstance.add).toHaveBeenCalledWith([moduleName, 'submod'], watchB)
    instance.unregisterModule('my/cool')
    expect(Store.prototype.unregisterModule).toHaveBeenCalledTimes(1)
    expect(trackerInstance.remove).toHaveBeenCalledTimes(1)
    expect(trackerInstance.remove).toHaveBeenCalledWith('my/cool')
  })
})
