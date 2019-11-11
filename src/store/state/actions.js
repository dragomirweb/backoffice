export async function setClients ({ commit }, payload) {
  commit('SET_CLIENTS', payload)
}

export async function setClient ({ commit }, payload) {
  commit('SET_CLIENT', payload)
}

export async function setRates ({ commit }, payload) {
  commit('SET_RATES', payload)
}