import firebase from '@react-native-firebase/app';

if (!firebase.apps.length) {
  firebase.initializeApp({
    clientId: '1077623196381-i798knq0puf9679tngvggee0lmjveqo7.apps.googleusercontent.com',
    appId: '1:1077623196381:ios:e4384c65b42a6fc889a934',
    apiKey: 'AIzaSyCcQUW-hEjzdMZVCrfCGKzbljU4uqrSuRs',
    storageBucket: 'zimdrive-b1874.firebasestorage.app',
    messagingSenderId: '1077623196381',
    projectId: 'zimdrive-b1874',
    databaseURL: 'https://zimdrive-b1874-default-rtdb.firebaseio.com/',
  });
}

export default firebase;