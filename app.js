//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

require("dotenv").config(); //needed for hiding the credentials to connect to the mongoDB Atlas database
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

//the default "home" content
const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express(); //an instance of the Express, that is stored in the "app" variable. This is the web app itself

app.set("view engine", "ejs"); //rendering "views" using EJS templates

app.use(bodyParser.urlencoded({ extended: true })); //access to the data submited from the "public" folder
app.use(express.static("public")); //needed for the static files like html, css, img etc

mongoose.set("strictQuery", false); //for handling query validation errors more flexibly
mongoose
  .connect(
    //connecting to the database with the credentials inside .env file
    `mongodb+srv://${username}:${password}@cluster0blog.hb2amyu.mongodb.net/blogDB?retryWrites=true&w=majority`, //the code from the account on MongoDB Atlas
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB Atlas Connected to blogDB"))
  .catch((err) => console.log(err));

const postSchema = {
  //the structure of the blog post
  title: String,
  content: String,
};

const Post = mongoose.model("Post", postSchema); //creating a model named "Post", based on the "postSchema"

app.get("/", (req, res) => {
  Post.find({}, (err, postS) => {
    //getting all posts from database
    res.render("home", {
      //rendering the posts on the "home.ejs" page
      startingContent: homeStartingContent,
      posts: postS,
    });
  });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  //creating a new instance of the "Post" model with "title" & "content" obtained from "req.body"
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save((err) => {
    //saving the post to the database
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", (req, res) => {
  //rendering specific post based on "URL parameter"==="postId", when you click "read more"
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, (err, post) => {
    //"_id" is the unique identifier for each document in the MongoDB database, automatically asigned by MongoDB
    res.render("post", {
      //rendering "post.ejs" with the specific title and content
      title: post.title,
      content: post.content,
    });
  });
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
