const config = {
  apiKey: 'AIzaSyAMmQ_EndlFlW3IXHUDHdiW5V_BCwPAo_8',
  authDomain: 'game-fun-6f21b.firebaseapp.com',
  databaseURL: 'https://game-fun-6f21b.firebaseio.com',
  projectId: 'game-fun-6f21b',
  storageBucket: 'game-fun-6f21b.appspot.com',
  messagingSenderId: '418192568430',
  appId: '1:418192568430:web:1029151a8f074bb1b0367f',
}

firebase.initializeApp(config)

const db = firebase.firestore()

const userCollection = db.collection('user')

function getTimestampFirebase(date) {
  return firebase.firestore.Timestamp.fromMillis(date)
}

function timeNowFirebase() {
  return getTimestampFirebase(Date.now())
}

function subscribeScores(callback) {
  userCollection
    .orderBy('score', 'desc')
    .limit(3)
    .onSnapshot((snapshot) => {
      callback(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
}

function addRecord({ name, score }) {
  console.log('SET SCORE: ', name, score)
  userCollection
    .add({
      name,
      score,
      createdDate: timeNowFirebase(),
    })
}