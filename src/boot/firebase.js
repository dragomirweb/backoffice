import Firebase from 'firebase/app'
import 'firebase/firestore' 
import 'firebase/database'// eslint-disable-line
import 'firebase/firebase-functions' // eslint-disable-line
import firebaseConfig from '../../firebase.conf'


export default ({ Vue }) => {
  // Initialize Firebase from settings
  Firebase.initializeApp(firebaseConfig)

  Vue.prototype.$firebase = Firebase
  Vue.prototype.$db = Firebase.firestore()
  Vue.prototype.$functions = Firebase.functions()
}
