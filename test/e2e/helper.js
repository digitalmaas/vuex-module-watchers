const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getBaseStore () {
  return {
    namespaced: true,
    state: {
      loadingCount: 0
    },
    mutations: {
      LOADING_START(state) {
        state.loadingCount += 1
      },
      LOADING_STOP(state) {
        state.loadingCount = Math.max(0, state.loadingCount - 1)
      }
    },
    actions: {
      loadingStarted({ commit }) {
        commit('LOADING_START')
      },
      loadingFinished({ commit }) {
        commit('LOADING_STOP')
      }
    },
    getters: {
      isLoading(state) {
        return state.loadingCount > 0
      }
    },
    modules: {
      preExistingModule: {
        namespaced: true,
        state: {
          randomValue: 0
        },
        mutations: {
          RANDOMIZE(state) {
            state.randomValue = getRandomInt(1, 1000)
          }
        },
        getters: {
          randomPlusOne(state) {
            return state.randomValue + 1
          }
        },
        watch: {
          '/isLoading'({ commit }) {
            commit('RANDOMIZE')
          }
        }
      }
    }
  }
}

export function getWatchingModule () {
  return {
    namespaced: true,
    state: {
      exists: true,
      preExistingRandomPlusOneTimes: 0,
      preExistingRandomPlusOneOld: undefined,
      preExistingRandomPlusOneNew: undefined,
      preExistingRandomTimes: 0,
      preExistingRandomOld: undefined,
      preExistingRandomNew: undefined
    },
    actions: {
      add({ commit }, { fieldName, oldValue, newValue }) {
        commit('ADD', { fieldName, oldValue, newValue })
      },
      async load({ dispatch }) {
        try {
          await dispatch('loadingStarted', null, { root: true })
          await setTimeoutPromise(getRandomInt(50, 150))
        } finally {
          await dispatch('loadingFinished', null, { root: true })
        }
      }
    },
    mutations: {
      ADD(state, { fieldName, oldValue, newValue }) {
        state[`${fieldName}Times`] += 1
        state[`${fieldName}Old`] = oldValue
        state[`${fieldName}new`] = newValue
      }
    },
    watch: {
      'preExistingModule/randomPlusOne'({ commit }, newValue, oldValue) {
        commit('ADD', { fieldName: 'preExistingRandomPlusOne', newValue, oldValue })
      },
      'preExistingModule.randomValue'({ dispatch }, newValue, oldValue) {
        dispatch('add', { fieldName: 'preExistingRandom', newValue, oldValue })
      }
    }
  }
}
