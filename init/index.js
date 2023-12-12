const initData = require("./data.js");
const Listing = require("../models/listings.js");
const mongoose = require("mongoose");

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(
    "mongodb+srv://hp17022004:WOF5upwTXvXPCKV4@cluster0.5rxgnzj.mongodb.net/?retryWrites=true&w=majority"
  );
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "65781c97c11a196978c94db4",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data is initialized");
};

initDB();
