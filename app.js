const express= require("express");
const app= express();
const mongoose= require("mongoose");
//requiring listing model
const Listing= require("./models/listing.js");
const path= require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));


//for setting basic database connection
const MONGO_URL= 'mongodb://127.0.0.1:27017/wonderland';

main()
.then(()=>{
    console.log("Database connected");
})
.catch((err)=>{
    console.log("Error connecting to database",err);

})

async function main(){
    await mongoose.connect(MONGO_URL);
}



//this is api
app.get("/",(req,res)=>{
    res.send("Hi , Iam root");
});



//index route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});


// new route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});



//show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

//create route
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});


//edit route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});


//update route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});


//delete route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

//testing and creating a route for listing
//  app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });



app.listen(8080,()=>{
    console.log("Server is running on port 8080");
});