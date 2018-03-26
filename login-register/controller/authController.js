const passport=require('passport');

exports.login=passport.authenticate('local',{
  failureRedirect:'/',
  successRedirect:'/'
});

exports.logout=(req,res)=>{
  req.logout();
  req.session.destroy(function (err) {
    res.redirect('/');
  });
  console.log("You are now logged out");
}
