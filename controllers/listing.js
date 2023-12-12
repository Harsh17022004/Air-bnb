const Listing = require("../models/listings.js");

module.exports.index = async (req, res) => {
  let allListings = await Listing.find();
  res.render("listings/index.ejs", { allListings });
};
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};
module.exports.showListing = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exist");
    res.redirect("/listing");
  }
  let geoLocation = `${listing.location} , ${listing.country}`;
  let other = await Listing.find();
  res.render("listings/show.ejs", { listing, other, geoLocation });
};
module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let listing = new Listing(req.body.listing);
  listing.owner = req.user._id;
  listing.image = { url, filename };
  await listing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listing");
};
module.exports.renderEditForm = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist");
    res.redirect("/listing");
  }
  let image = listing.image.url;
  image = image.replace("/upload", "/upload/c_scale,h_100,w_150");
  res.render("listings/edit.ejs", { listing, image });
};
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Edited");
  res.redirect(`/listing/${id}`);
};
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("error", "Listing Deleted");
  res.redirect("/listing");
};
