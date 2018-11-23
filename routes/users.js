var express    = require("express");
var router     = express.Router();
var User       = require("../models/user");
var Campground = require("../models/campground");
var middleware = require("../middleware/");

// SHOW USER PROFILE ROUTE
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

//EDIT USER PROFILE ROUTE
router.get("/:id/edit", function(req, res){
    if(req.isAuthenticated()){
        User.findById(req.params.id, function(err, foundUser){
            if(err || !foundUser){
                req.flash("error", "User not found");
                res.redirect("back");
            } else {
                if(foundUser._id.equals(req.user._id) || req.user.isAdmin){
                   res.render("users/edit", {user: foundUser});
                } else {
                   req.flash("error", "You dont have permission to do that");
                   res.redirect("back");  
                } 
            }
        });
    } else {
       req.flash("error", "You need to be logged in to do that");
       res.redirect("/login"); 
    }
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", function(req, res){
    if(req.params.id.toString() === req.user._id.toString() || req.user.isAdmin){
        User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
            if(err || !updatedUser){
                req.flash("error", "User not found");
                res.redirect("back");
            } else {
                req.flash("success", "Profile Updated!");
                res.redirect("/users/" + req.params.id);
            }
        });  
    } else {
        req.flash("error", "You dont have permission to do that");
        res.redirect("back");  
    }
});


module.exports = router;