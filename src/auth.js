import firebase from 'firebase'
import firebaseui from 'firebaseui';

var config = {
  apiKey: 'AIzaSyCc6pgdUOoYW5jfm3pCChr-dPM67R6BmHU',
  authDomain: 'aboutme-5e68b.firebaseapp.com',
  databaseURL: 'https://aboutme-5e68b.firebaseio.com',
  projectId: 'aboutme-5e68b',
  storageBucket: 'aboutme-5e68b.appspot.com',
  messagingSenderId: '612000161184'
};

const auth = {
  context: null,
  uiConfig: null,
  ui: null,

  init(context) {
    this.context = context;

    firebase.initializeApp(config);
    this.uiConfig = {
      signInSuccessUrl: 'dashboard',
      signInOptions: [
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ]
    }
    this.ui = new firebaseui.auth.AuthUI(firebase.auth());

    firebase.auth().onAuthStateChanged((user) => {
      this.context.$store.dispatch('user/setCurrentUser')

      let requireAuth = this.context.$route.matched.some(record => record.meta.requireAuth)
      let guestOnly = this.context.$route.matched.some(record => record.meta.guestOnly)

      if (requireAuth && !user) {
        console.log("login fail")
        this.context.$router.push('auth')
      }
      else if (guestOnly && user) {
        console.log("login success")
        this.context.$router.push('dashboard')
      }
    });
  },
  authForm(container) {
    this.ui.start(container, this.uiConfig);
  },
  user() {
    return this.context ? firebase.auth().currentUser : null;
  },
  logout() {
    firebase.auth().signOut();
  }
}

export default auth;