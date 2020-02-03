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

export function subscribeScores(callback) {
  userCollection
    .orderBy('score', 'desc')
    .limit(3)
    .onSnapshot((snapshot) => {
      callback(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
}

export async function addRecord({ name, score }) {
  const user = (await userCollection
    .where('name', '==', name)
    .orderBy('score', 'desc')
    .limit(1)
    .get()).docs[0]

  if (user) {
    userCollection
      .doc(user.id)
      .update({
        score,
        play: (user.data().play || 0) + 1,
        prev: user.data().updatedDate,
        updatedDate: timeNowFirebase(),
      })
  } else {
    userCollection
      .add({
        name,
        score,
        play: 1,
        createdDate: timeNowFirebase(),
        updatedDate: timeNowFirebase(),
      })
  }
}
