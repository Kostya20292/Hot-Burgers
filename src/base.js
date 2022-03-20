import Rebase from 're-base';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const firebaseApp = firebase.initializeApp({
    apiKey: 'AIzaSyAetKKSVSINfRxKpRavvXX4DL5j5kD1kPg',
    authDomain: 'very-hot-burgers-1d3e7.firebaseapp.com',
    databaseURL: 'https://very-hot-burgers-1d3e7-default-rtdb.firebaseio.com',
});

const base = Rebase.createClass(firebaseApp.database());

export { firebaseApp };

export default base;
