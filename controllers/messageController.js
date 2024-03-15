const Message = require('../models/message')
const User = require("../models/user");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
    try {
        const messages = await Message.find().populate("user").sort({date:-1}).exec();

        if (!messages) {
            return next("messages not found");
        }

        res.render("index", {
            title: "Member Message",
            messages: messages,
            user: res.locals.currentUser
        });
    } catch (err) {
        return next(err);
    }
});

exports.new_message_get = asyncHandler(async (req, res, next) => {
    res.render('new_message', {
        title: 'New Message',
        user: res.locals.currentUser
    });
});

exports.new_message_post = [
    // Validate and sanitize fields.
    body("newMessageTitle")
    .trim()
    .isLength({
        min: 1,
        errorMessage: 'No Title.'
        })
    .escape()
    .withMessage("invalid title"),
    body("newMessageDescription")
    .trim()
    .isLength({
        min: 1
    })
    .escape()
    .withMessage("No Description"),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
            res.redirect("/");
            return;
        } else {
        // Data from form is valid.
        // Create User object with escaped and trimmed data
        const message = new Message({
            user: res.locals.currentUser,
            title: req.body.newMessageTitle,
            description: req.body.newMessageDescription,
            date: new Date()
        });
        // Save user.
        await message.save();
        // Redirect to home.
        res.redirect("/");
        }
    }),
];


// Display message delete form on GET.
exports.message_delete_get = asyncHandler(async (req, res, next) => {
    const message = await Message.findById(req.params.id).exec();
    
    if (message === null) {
        // No results.
        res.redirect("/");
    }

    res.render("message_delete", {
        title: "Delete Item",
        message: message,
        user: res.locals.currentUser
    });
});

// Handle message delete on POST.
exports.message_delete_post = asyncHandler(async (req, res, next) => {
// Assume the post has valid id (ie no validation/sanitization).
    const message = await Message.findById(req.body.deleteId).exec();
    
    if (message === null) {
        // No results.
        res.redirect("/");
    }

    await Message.findByIdAndDelete(req.body.deleteId);
    res.redirect("/");
});