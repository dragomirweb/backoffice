const functions = require('firebase-functions');
const admin = require('firebase-admin');
let serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://msbackoffice-259c3.firebaseio.com'
})

const firestore = admin.firestore();
const db = firestore.collection('users')

exports.addAdminRole = functions.https.onCall((data, context) => {

  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid, {
      admin: true
    });
  }).then(() => {
    return {
      message: `Success`
    }
  }).catch(err => {
    return err
  })
})

exports.addClientRole = functions.https.onCall((data, context) => {

  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid, {
      client: true
    });
  }).then(() => {
    return {
      message: `Success`
    }
  }).catch(err => {
    return err
  })
})

exports.createUser = functions.https.onCall((data) => {
  return admin.auth().createUser({
    email: data.email,
    emailVerified: true,
    password: data.password,
    displayName: data.name,
    photoURL: 'https://cdn.quasar.dev/img/boy-avatar.png',
    disabled: false
  })
    .then((userRecord) => {    
      if (data.role === 'Client') {
        db.doc(userRecord.uid).set({
          user: data,
          balance: 0,
          deposits: [],
          withdraws: [],
          openTrades: [],
          closedTrades: []
        }, { merge: true })
          .then(function () {
            console.log('Document successfully written!')
          })
          .catch(function (error) {
            console.error('Error writing document: ', error)
          })
      }
      return {
        uid: userRecord.uid
      }
    })
    .catch(error => {
      return error
    })
})

exports.updateUser = functions.https.onCall((data) => {
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then(user => {
      return admin.auth().updateUser(user.uid, {
        email: data.email,
        emailVerified: true,
        password: data.password,
        displayName: data.name,
        photoURL: 'https://cdn.quasar.dev/img/boy-avatar.png',
        disabled: false
      })
        .then((userRecord) => {
          db.doc(userRecord.uid).update({
            user: data
          })
            .then(function () {
              console.log('Document successfully written!')
            })
            .catch(function (error) {
              console.error('Error writing document: ', error)
            })
          return {
            uid: userRecord.uid
          }
        })
        .catch(error => {
          return error
        })
    })
})

exports.deleteUser = functions.https.onCall((data, context) => {
  if(data.email !== 'admin@csa.com') {
    admin.auth().getUserByEmail(data.email).then(user => {
      admin.auth().deleteUser(user.uid).then(r => db.doc(user.uid).delete())
    }).then(res => {
      console.log('TCL: deleteUser res', res)
      return res
    }).catch(err => { return err })
  }
})
