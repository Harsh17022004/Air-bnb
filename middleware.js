const Listing = require("./models/listings.js")
const Review = require("./models/review.js")
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("./utils/schema.js")

// check login 
module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.originalUrl);
    if (!req.isAuthenticated()) {
        // save originalurl 
        req.session.currUrl = req.originalUrl;
        req.flash("error", "Please login to your account")
        return res.redirect("/login")
    }
    next()
}

// save url to redirect again
module.exports.saveUrl = (req, res, next) => {
    if (req.session.currUrl) {
        res.locals.currUrl = req.session.currUrl
    }
    next()
}

// Check the user is owner
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to edit")
        return res.redirect(`/listing/${id}`)
    }
    next()
}

// validate listing
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    if (error) {
        let errDets = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errDets)
    } else {
        next()
    }
}

// validate review
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)
    if (error) {
        let errDets = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errDets)
    } else {
        next()
    }
}

// Check the review author is owner
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to delete")
        return res.redirect(`/listing/${id}`)
    }
    next()
}