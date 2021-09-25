import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

exports.onCreateUser = functions.region('southamerica-east1').auth.user().onCreate(async (user) => {
  await admin.firestore().doc(`users/${user.uid}`).set({
    id: user.uid,
    name: user.displayName || '',
    phoneNumber: user.phoneNumber || '',
    email: user.email,
    balance: 0,
    cpf: '',
    address: {},
    avatar: user.photoURL || ''
  });
})

exports.onDeleteUser = functions.region('southamerica-east1').auth.user().onDelete(async (user) => {
  await admin.firestore().doc(`users/${user.uid}`).delete();
})
