const admin = require('firebase-admin')

module.exports = (req, res) => {
  // expecting phone and code from user
  if (!req.body.phone || !req.body.code) {
    return res.status(422).send({ error: 'Phone and code must be provided' })
  }

  // sanitize input
  const phone = String(req.body.phone).replace(/[^\d]/g, "")
  const code = parseInt(req.body.code)

  // get access to current user, i.e. the one trying to log in
  admin.auth().getUser(phone)
    .then(user => {
      const ref = admin.database().ref(`users/${phone}`)
      ref.once('value')
        .then(snapshot => {
          // corresponding user object from database which contains code and codeValid
          const user = snapshot.val()
          // if user entered code is incorrect or code is invalid
          if (user.code !== code || !user.codeValid) {
            return res.status(422).send({ error: 'Code not valid!' })
          }
          // passed code comparison successfully
          // invalidate code
          ref.update({ codeValid: false })
          // generate jwt
          admin.auth().createCustomToken(phone)
            .then(token => res.send({ token }))
        })
    })
    // firebase getUser error
    .catch(err => {
      return res.status(422).send(err)
    })

}
