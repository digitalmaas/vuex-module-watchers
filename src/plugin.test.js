jest.mock('shvl', () => jest.fn().mockImplementation((_, __, def) => def))
import plugin from './plugin'

// ////////////////////////////////////

function createMockStore (entries) {
  const next = jest.fn().mockImplementation(() => ({ done: true }))
  for (const value of entries) {
    next.mockImplementationOnce(() => ({ done: false, value }))
  }
  const mockStore = {
    watch: jest.fn(),
    _tracker: {
      setUnsubscribers: jest.fn(),
      getPendingWatchers: jest.fn().mockImplementation(() => ({
        [Symbol.iterator]: () => ({ next })
      }))
    },
    $next: next
  }
  return mockStore
}

// ////////////////////////////////////

describe('plugin.js', () => {
  it('should export a function', () => {
    expect(plugin).toBeDefined()
    expect(plugin).toBeInstanceOf(Function)
  })

  it('should register watchers', () => {
    const entries = [
      {
        namespace: 'a',
        watches: {
          keyOne: jest.fn(),
          keyTwo: { handler: jest.fn() }
        }
      },
      {
        namespace: 'b',
        watches: {
          single: {
            deep: true,
            immediate: true,
            handler: jest.fn()
          }
        }
      }
    ]
    const s = createMockStore(entries)
    plugin(s)
    expect(s._tracker.getPendingWatchers).toHaveBeenCalledTimes(1)
    expect(s.$next).toHaveBeenCalledTimes(3)
    expect(s._tracker.setUnsubscribers).toHaveBeenCalledTimes(2)
    expect(s.watch).toHaveBeenCalledTimes(3)
  })
})
