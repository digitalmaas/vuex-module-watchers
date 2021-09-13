import WatcherTracker from './watcher-tracker.js'

const assert = require('assert')

// //////////////////////////////////////

describe('watcher-tracker.js', () => {
  it('should exist and be function/class', () => {
    expect(WatcherTracker).toBeDefined()
    expect(WatcherTracker).toBeInstanceOf(Function)
    expect(WatcherTracker._map).toBeUndefined()
  })

  it('should be instantiable and have a map per instance', () => {
    const i01 = new WatcherTracker()
    const i02 = new WatcherTracker()
    expect(i01._map).toBeDefined()
    expect(i01._map).toBeInstanceOf(Object)
    expect(i01._map).not.toBe(i02._map)
    expect(WatcherTracker._map).toBeUndefined()
  })

  it(`should add, return pending watchers (haven't been processed), and remove`, () => {
    const instance = new WatcherTracker()
    const w01 = { a: () => jest.fn() }
    const w02 = { a: () => jest.fn() }
    instance.add('name/space/m1', w01)
    instance.add(['name/space', 'm2'], w02)
    expect(instance._map).toHaveProperty('name/space/m1', { watchers: w01 })
    expect(instance._map).toHaveProperty('name/space/m2', { watchers: w02 })
    const unsubs = []
    for (const item of instance.getPendingWatchers()) {
      unsubs.push(jest.fn())
      instance.setUnsubscribers(item.namespace, [unsubs[unsubs.length - 1]])
    }
    for (const item of instance.getPendingWatchers()) {
      assert.fail('should not have extra pending items:' + item.namespace)
    }
    instance.remove(['name', 'space', 'm1'])
    expect(instance._map).not.toHaveProperty('name/space/m1')
    expect(instance._map).toHaveProperty('name/space/m2')
    instance.remove('name/space/m2')
    expect(instance._map).not.toHaveProperty('name/space/m1')
    expect(instance._map).not.toHaveProperty('name/space/m2')
    for (const u of unsubs) {
      expect(u).toHaveBeenCalledTimes(1)
    }
  })
})
