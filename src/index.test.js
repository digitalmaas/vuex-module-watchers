import VuexWatchingStoreDirect from './vuex-watching-store.js'
import DefaultExport, { version, VuexWatchingStore } from './index'

// //////////////////////////////////////

describe('index.js', () => {
  it('should export version', () => {
    expect(version).toEqual('__VERSION__')
  })

  it('should export store class as default export', () => {
    expect(DefaultExport).toBe(VuexWatchingStoreDirect)
  })

  it('should export store class as named export', () => {
    expect(VuexWatchingStore).toBe(VuexWatchingStoreDirect)
  })

  it('should export same class from default and named exports', () => {
    expect(DefaultExport).toBe(VuexWatchingStore)
  })
})
