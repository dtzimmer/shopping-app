import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyANHWWAcdpZQGPlvtKFlz06tckJ_jEIzmM",
    authDomain: "fun-food-friends-d09e7.firebaseapp.com",
    databaseURL: "https://fun-food-friends-d09e7.firebaseio.com",
    projectId: "fun-food-friends-d09e7",
    storageBucket: "fun-food-friends-d09e7.appspot.com",
    messagingSenderId: "536779366708"
};
firebase.initializeApp(config);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;