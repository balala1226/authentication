const User = require("../models/user");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const passport = require("passport");
const bcrypt = require("bcryptjs");

//sign up
exports.sign_up_get = asyncHandler(async (req, res, next) => {
    res.render('sign-up', { 
      title: 'Sign Up',
      user: res.locals.currentUser
    });
});

exports.sign_up_post = [
  // Validate and sanitize fields.
  body("firstName")
  .trim()
  .isLength({ 
    min: 1,
    errorMessage: 'first name must be specified.'
   })
  .escape()
  .withMessage("first name."),
  body("lastName")
  .trim()
  .isLength({ 
    min: 1,
    errorMessage: 'last name must be specified.'
   })
  .escape()
  .withMessage("last name."),
  body("email")
  .trim()
  .isLength({ 
    min: 1,
    errorMessage: 'email must be specified.'
   })
  .isEmail({
    errorMessage: 'Not a valid email.'
  })
  .custom(async value => {
    const user = await User.find({email: value}).exec();
    if (user && user.length > 0) {
      throw new Error('E-mail already in use');
    }
  })
  .escape()
  .withMessage("email"),
  body('password')
  .trim()
  .isLength({ 
    min: 6,
    errorMessage: "password must contain 6 characters"
  })
  .escape()
  .withMessage("passwords"),
  body('confirmPassword')  
  .trim()
  .isLength({ 
    min: 6,
    errorMessage: "password must contain 6 characters"
   })
   .custom((value, { req }) => value === req.body.password)
  .escape()
  .withMessage("password does not match"),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("sign-up", {
        title: "Sign Up",
        firstName:req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err){
          var newError = new Error('password hash error');
          var errorArray = [];
          errorArray.push(newError);

          res.render("sign-up", {
            title: "Sign Up",
            firstName:req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            errors: errorArray,
            user: res.locals.currentUser
          });
          return;
        }
        // Create User object with escaped and trimmed data
        const user = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hashedPassword,
          isPremiumMember: false,
          isAdmin: false,
          user: res.locals.currentUser
        });
        // Save user.
        await user.save();
        // Redirect to home.
        res.redirect("/");
      });
    }
  }),
];

//log in
exports.log_in_get = asyncHandler(async (req, res, next) => {
    res.render('log-in', { 
      title: 'Log In',
      user: res.locals.currentUser
    });
});

exports.log_in_post = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in"
});

//log out
exports.log_out_get = asyncHandler(async (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
});

//membership
exports.membership_update_get= asyncHandler(async (req, res, next) => {
  res.render('membership', { 
    title: 'Membership Update',
    user: res.locals.currentUser
  });
});