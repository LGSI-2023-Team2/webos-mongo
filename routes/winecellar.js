//LGSI2023/routes/winecellar.js

module.exports = function(app){
    const express = require("express");
    const router = express.Router();
    const Wine = require("../models/wine");
    const Cellar = require("../models/cellar");
    const mongoose = require("mongoose");
    router.get("/", function(req, res){
        console.log("this is winecellar");
    });
    
    router.get("/winename", function(req, res){
        var wineid = new mongoose.Types.ObjectId(req.query.id);
        Wine.findOne({_id: wineid})
            .populate('aroma')
            .populate('pairing')
            .then(function(wine){
                res.json(wine);
                console.log("찾았어요!");
            })
            .catch(function(err){
                res.json(err);
            });
    });
    
    router.post("/wine/:cellarid/:winebarcode", function(req, res){
        let cellarid;
        Cellar.findOne({_id: req.params.cellarid})
            .exec(function(err, cellar){
                if(err){
                    return res.return(err);
                }
                cellarid = cellar._id;
            });
    
        var wine = new Wine();
        Wine.findOne({barcode: req.query.winebarcode})
            .exec(function(err, wine_info){
                if(err){
                    return res.return(err);
                }
                wine = wine_info;
            });
    
        // algorithm, save and return status
    });
    
    router.get("/status", function(req, res){
        Cellar.findOne({_id: req.query.id})
            .populate('floor1.wine_ids')
            .populate('floor2.wine_ids')
            .populate('floor3.wine_ids')
            .exec(function(err, cellar){
                if(err){
                    return res.return(err);
                }
                res.json(cellar);
            });
    });
    
    router.post("/:cellarid/:floor", function(req, res){
        var floor = req.params.floor;
    });

    return router;
}

