var express    = require("express");
var router     = express.Router();
var User       = require("../models/user");
var Campground = require("../models/campground");
var middleware = require("../middleware/");

// SHOW user profile
router.get("/:id", function(req, res){
   User.findById(req.params.id, function(err, foundUser){
      if(err){
         req.flash("error", "user not found");
         return res.redirect("/");
      }
      Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds){
         if(err){
            req.flash("error", "something went wrong");
            return res.redirect("/");
         }
         res.render("users/show", {user: foundUser, campgrounds: campgrounds});
      });
   });
});

module.exports = router;