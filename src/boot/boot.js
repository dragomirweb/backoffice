import Firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

export default ({ app, router, Vue, store }) => {
  const db = Firebase.firestore()
  // Register the Firebase authentication listener
  Firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // Signed in. Let Vuex know.
      store.commit('auth/SET_USER', user)
      Firebase.auth().currentUser.getIdTokenResult()
        .then((idTokenResult) => {
          if (idTokenResult.claims.admin) {
            // get admin users here
            db.collection('users').get().then((querySnapshot) => {
              let clients = []
              querySnapshot.forEach((doc) => {
                let data = doc.data()
                data.id = doc.id
                clients.push(data)
              })
              store.dispatch('state/setClients', clients)
            })
          } else if (idTokenResult.claims.client) {
            db.collection('users').get().then((querySnapshot) => {
              let client = null
              querySnapshot.forEach((doc) => {
                let data = doc.data()
                data.id = doc.id
                if(doc.id === user.uid) {
                  client = data
                }
                // clients.push(data)
              })
              store.dispatch('state/setClient', client)
            })
          }

          store.dispatch('auth/getPermissions', idTokenResult.claims)
        })
        .catch((error) => {
          console.log(error)
        })

      // The .catch ignore error if .replace is redirecting to dashboard and we
      // are already at that route.
      // https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
      router.replace({ name: 'dashboard' }).catch(() => {})
      new Vue(app) /* eslint-disable-line no-new */
    } else {
      // Signed out. Let Vuex know.
      store.commit('auth/RESET_USER')
      router.replace({ name: 'signIn' }).catch(() => {})
      new Vue(app) /* eslint-disable-line no-new */
    }
  })
}
