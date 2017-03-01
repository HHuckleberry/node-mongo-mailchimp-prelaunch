var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    request             = require("superagent"),
    cookieParser        = require("cookie-parser"),
    expressSession      = require("express-session"),
    mongoose            = require("mongoose"),
    User                = require("./models/user"),
    passport            = require("passport"),
    passportLM          = require("passport-local-mongoose");
    validator           = require("express-validator"),
    mailchimpInstance   = '',
    listUniqueId        = '',
    mailchimpApiKey     = '';

app.set("view engine", 'ejs');
//mongodb for desktop Testing
mongoose.connect("mongodb://localhost/launchpage-example")
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(validator());
app.use(cookieParser());
app.use(expressSession({
  secret: 'this is an express session',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 600},

}))
app.use(passport.initialize());
app.use(passport.session());


app.get('/', function(req, res){
    res.render('landing')
});

app.post('/', function (req, res) {

  req.assert('firstName', 'Please enter a First Name longer than 2 characters and not more than 15').len(2, 15);
  req.assert('lastName', 'Most people have a last names between 2 and 16 characters long').len(2, 16);
  req.assert('email', 'required').notEmpty();
  req.assert('email', 'valid email required').isEmail();
  // var errors = req.validationErrors();
  // if (errors) {
  //   req.session.errors = errors;
  //   req.session.success = false;
  //   console.log(errors)
  //   res.redirect('back')
  // } else{
  //   req.session.success = true;
  // }
  req.getValidationResult().then(function(result) {
    // do something with the validation result
    if(result.isEmpty() === true){
      res.send("yes. it is empty")
    } else{
      var errors = result.mapped()
      req.session.errors = errors;
      console.log(errors.msg)
      console.log(req.session.errors)
      res.redirect('back')
    }
})



  //         var username  =   req.body.email;
  //         User.findOne({username:username}, function(err, user, next){
  //           console.log(user);
  //           if(user){
  //             res.redirect("/refer")
  //           } else if(!user){
  //               var email     =  req.body.email,
  //                   username  =  req.body.email,
  //                   firstName =  req.body.firstName,
  //                   lastName  =  req.body.lastName,
  //                   newUser   =  {username:username, email: email};
  //               User.create(newUser, function(err, data, next){
  //               if(err){
  //                 console.log(err);
  //                 res.redirect('/*');
  //           }
  //
  //           request
  //           .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
  //           .set('Content-Type', 'application/json;charset=utf-8')
  //           .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey ).toString('base64'))
  //           .send({
  //             'email_address': req.body.email,
  //             'status': 'subscribed',
  //             'merge_fields': {
  //               'FNAME': req.body.firstName,
  //               'LNAME': req.body.lastName
  //             }
  //           })
  //           .end(function(err, response) {
  //             if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
  //               res.redirect('/thanks');
  //             } else {
  //               res.redirect('/');
  //             }
  //         });
  // });
  //
  //           }
  //         })



})

app.get('/*', function(req, res){
    res.render('404.ejs')
})

// app.listen(process.env.PORT, process.env.IP, function(){console.log("app started")})

//for desktop testing
app.listen(3000, function () {
  console.log('Example App Running on Port 3000!')
})
