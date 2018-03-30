const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const User = mongoose.model("User");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    function(username, password, done) {
      User.findOne({ email: username }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        bcrypt.compare(password, user.password, function(err, res) {
            if(res){
              return done(null, user);
            }
            return done(null, false, { message: "password incoreect" });
        });

      });
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
