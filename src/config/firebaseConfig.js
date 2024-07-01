import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCpkkB2myTdoktaotJQNOkGuesTuQbi5Do',
  authDomain: 'njuyo-401118.firebaseapp.com',
  databaseURL: 'https://njuyo-401118-default-rtdb.firebaseio.com',
  projectId: 'njuyo-401118',
  storageBucket: 'njuyo-401118.appspot.com',
  messagingSenderId: '800028350716',
  appId: '1:800028350716:android:bad85f0a9a6c4790b39f79',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
