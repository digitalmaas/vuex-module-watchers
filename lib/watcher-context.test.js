import WatcherContext from './watcher-context.js'

// //////////////////////////////////////

function createMockStore () {
  // prettier-ignore
  const mockStore = {
    dispatch: jest.fn(),
    commit: jest.fn(),
    get state() { return {} },
    get getters() { return {} }
  }
  mockStore.__state = jest.spyOn(mockStore, 'state', 'get').mockImplementation(() => {})
  mockStore.__getters = jest.spyOn(mockStore, 'getters', 'get').mockImplementation(() => {})
  return mockStore
}

// //////////////////////////////////////

describe('watcher-context.js', () => {
  it('should exist and be function', () => {
    expect(WatcherContext).toBeDefined()
    expect(WatcherContext).toBeInstanceOf(Function)
  })

  it('should have correct signature/interface', () => {
    const store = createMockStore()
    const ctx = new WatcherContext(['name', 'space'], store)
    expect(store.dispatch).not.toHaveBeenCalled()
    expect(store.commit).not.toHaveBeenCalled()
    expect(store.__state).not.toHaveBeenCalled()
    expect(store.__getters).not.toHaveBeenCalled()
    expect(ctx.dispatch).toBeDefined()
    expect(ctx.commit).toBeDefined()
    expect(ctx).toHaveProperty('state')
    expect(ctx).toHaveProperty('getters')
    expect(ctx).toHaveProperty('rootGetters')
    expect(ctx).toHaveProperty('rootState')
  })
})
