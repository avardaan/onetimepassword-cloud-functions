// admin object gives us access to the firebase account
const admin = require('firebase-admin');

// export single function
module.exports = (req, res) => {
  // verify that the user provided a phone
  if (!req.body.phone) {
    // bad input 422 code
    return res.status(422).send({ error: 'Bad Input' })
  }
  // format phone number to remove - or () etc, to just get the digits
  // regex expression matches ANYTHING that is NOT a number
  const phone = String(req.body.phone).replace(/[^\d]/g, "");
  // create new user account, using phone as uid
  admin.auth().createUser({ uid: phone })
    .then((user) => {
      // send user back to whoever made the request
      res.send(user)
    })
    .catch((err) => {
      res.status(422).send({ error: err })
    })

  // respond to user by saying account was made
}
