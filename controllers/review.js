const Review = require("../models/review.js");
const Listing = require("../models/listings.js")

module.exports.createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.Review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save();
    req.flash("success", "New Review Posted")
    res.redirect(`/listing/${req.params.id}`)
};
module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash("success", "Review Deleted")
    res.redirect(`/listing/${id}`)
};