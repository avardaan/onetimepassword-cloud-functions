const admin = require('firebase-admin');
const twilio = require('./twilio'); // require from twilio.js not twilio npm module

module.exports = (req, res) => {
  // verify
  if (!req.body.phone) {
    return res.status(422).send({ error: 'You must provide a phone number' });
  }
  // sanitize input
  const phone = String(req.body.phone).replace(/[^\d]/g, "")

  // access firebase db and retrieve user object with uid phone. getUser is firebase provided lookup! :)
  admin.auth().getUser(phone)
    .then(user => {
      // generate random code. (Don't understand the generator :?)
      const code = Math.floor(Math.random() * 8999 + 1000);
      // send text, returns promise
      twilio.messages.create({
        body: 'Your code is ' + code,
        to: phone,
        from: '+16179345444'
      })
        .then(() => {
          // if text is sent successfully, create firebase database entry
          admin.database().ref('users/' + phone)
          .update({ code: code, codeValid: true })
            .then(() => {
              // if created successfully, notify of success
              res.send({ success: true })
            })
            // firebase database error
            .catch(error => {
              res.status(422).send(error)
            })
        })
        // catch twilio error
        .catch(err => {
          res.status(422).send(err)
        })

    })
    // firebase auth getUser error
    .catch(err => {
      res.status(422).send(err)

    })
}
