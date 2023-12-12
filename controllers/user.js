const User = require("../models/user.js")

module.exports.renderSignupForm = (req, res) => {
    res.render("user/signUp.ejs")
}
module.exports.signUp = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registredUser = await User.register(newUser, password)
        // console.log(registredUser);
        req.login(registredUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash("success", "Welcome to AirBnb")
            res.redirect("/listing")
        })

    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup")
    }
};
module.exports.renderLoginForm = (req, res) => {
    res.render("user/login.ejs")
}
module.exports.logIn = async (req, res) => {
    req.flash("success", "Welcome back to AirBnb")
    const redirectUrl = res.locals.currUrl || "/listing"
    res.redirect(redirectUrl)
}
module.exports.logOut = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "Logged out successfully")
        res.redirect("/listing")
    })
};