//jshint esversion:6
//This app is deployed at https://sheltered-reef-11735.herokuapp.com/
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://admin-nikhil:test123@cluster0.wym8c.mongodb.net/blogDB');
}


const homeStartingContent = "We provide a medium to write your ideas through blogs.The best ideas can change who we are. This is where those ideas take shape, take off, and spark powerful conversations. We’re an open platform where readers come to find insightful and dynamic thinking. Here, expert and undiscovered voices alike dive into the heart of any topic and bring new ideas to the surface. Our purpose is to spread these ideas and deepen understanding of the world.";


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = new mongoose.Schema({
  title: String,
  content : String
});

const Post = mongoose.model('Post',postSchema);

app.get("/", function(req, res){
  Post.find({},function(err,results){
    if(err) console.log(err);
    else{
      res.render("home", {
        startingContent: homeStartingContent,
        posts : results
      });
    };

  });
});


app.get("/about", function(req, res){
  res.render("about");
});

app.get("/contact", function(req, res){
  res.render("contact");
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const postTitle =  req.body.postTitle;
  const postContent =  req.body.postBody;

  const newPost = new Post({
    title : postTitle,
    content : postContent
  });
  newPost.save();
  res.redirect("/");
});

app.get("/posts/:postId", function(req, res){
  const requestedId = req.params.postId;

  Post.findOne({_id : requestedId},function(err,foundPost){
    if(err) console.log(err);
    else{
      if(!foundPost) res.render("<h1>Aw! No such posts exists</h1>");
      else{
        res.render("post", {
          title: foundPost.title,
          content: foundPost.content
        });
      }
    }
  });

});

app.post("/delete",function(req,res){
  const postId = req.body.deleteButton;
  Post.deleteOne({ _id: postId }).then(function(){
    console.log("Data deleted"); // Success
  }).catch(function(error){
    console.log(error); // Failure
    });
  res.redirect("/");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});