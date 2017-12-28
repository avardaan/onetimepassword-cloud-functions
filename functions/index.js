// admin object that gives us access to firebase database to use in firebase functions
const admin = require('firebase-admin');
const functions = require('firebase-functions');
// details of our firebase database passed into adminIntialize
const serviceAccount = require('./service_account.json')
// import createUser function from create_user.js, etc, etc
const createUser = require('./create_user')
const requestOneTimePassword = require('./request_one_time_password')
const verifyOneTimePassword = require('./verify_one_time_password')

// just like firebase.initializeApp, this is database setup for cloud functions
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://udemy-firebase-otp.firebaseio.com"
});


// export createUser function in google cloud function format
exports.createUser = functions.https.onRequest(createUser)

exports.requestOneTimePassword = functions.https.onRequest(requestOneTimePassword)

exports.verifyOneTimePassword = functions.https.onRequest(verifyOneTimePassword)
