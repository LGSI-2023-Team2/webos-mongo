//LGSI2023/routes/winecellar.js

module.exports = function(app){
    const express = require("express");
    const router = express.Router();
    const Wine = require("../models/wine");
    const Cellar = require("../models/cellar");
    const Cell = require("../models/cell");

    // !!! ROUTE TO / !!!
    router.route('/')
        // !!! GET !!!
        // !!! function to check the connectivity !!!
        .get(function(req, res){
            //res.json("[WINECELLAR]:: this is winecellar")
            console.log("[WINECELLAR]:: this is winecellar");
            Cellar.create({
                floor1: {},
                floor2: {},
                floor3: {}
            })
                .then(function(cellar){
                    res.json(cellar);
                })
                .catch(function(err){
                    console.log(err);
                }
            );
        })
        // !!! DELETE !!!
        // !!! function to delete wine from winecellar !!!
        .delete(function(req, res){
            console.log("[WINECELLAR]:: delete request received");
            // step 1. find cellar
            Cellar.findOne({_id: req.body.cellarid})
                .populate({
                    path: 'floor1.cell_ids',
                    model: Cell,
                    populate: {
                        path: 'wine_id',
                        model: Wine
                    }
                })
                .populate({
                    path: 'floor2.cell_ids',
                    model: Cell,
                    populate: {
                        path: 'wine_id',
                        model: Wine
                    }
                })
                .populate({
                    path: 'floor3.cell_ids',
                    model: Cell,
                    populate: {
                        path: 'wine_id',
                        model: Wine
                    }
                })
                .then(function(cellar){
                    // step 2. find wine
                    // step 2-1. find cell
                    var cellId;
                    if(req.body.row == 1){
                        cellar.floor1.cell_ids.forEach(function(cell){
                            if(cell.row == req.body.row && cell.col == req.body.col){
                                cellId = cell._id;
                                cellar.floor1.cell_ids.pull(cellId);
                            }
                        });
                    }
                    else if(req.body.row == 2){
                        cellar.floor2.cell_ids.forEach(function(cell){
                            if(cell.row == req.body.row && cell.col == req.body.col){
                                cellId = cell._id;
                                cellar.floor2.cell_ids.pull(cellId);
                            }
                        });
                    }
                    else if(req.body.row == 3){
                        cellar.floor3.cell_ids.forEach(function(cell){
                            if(cell.row == req.body.row && cell.col == req.body.col){
                                cellId = cell._id;
                                cellar.floor3.cell_ids.pull(cellId);
                            }
                        });
                    }
                    cellar.save();
                    // step 2-2. remove wine from cell
                    Cell.deleteOne({_id: cellId})
                        .then(function(){
                            console.log("[WINECELLAR]:: wine removed from cell");
                            res.json(cellar);
                        })
                        .catch(function(err){
                            console.log(err);
                            res.json(err);
                        })
                })
                .catch(function(err){
                    res.json(err);
                    console.log("[WINECELLAR]:: drinking wine failed")
                })
        })

    // !!! ROUTE TO status !!!
    router.route('/status')
        // !!! GET !!!
        // !!! function to get cellar info !!!
        .get(function(req, res){
            console.log("[WINECELLAR]:: winecellar status request received");
            Cellar.findOne({_id: req.query.id})
                // since cell_id is related to cell
                .populate({
                    path: 'floor1.cell_ids',
                    model: Cell,
                    populate: {
                        path: 'wine_id',
                        model: Wine
                    }
                })
                .populate({
                    path: 'floor2.cell_ids',
                    model: Cell,
                    populate: {
                        path: 'wine_id',
                        model: Wine
                    }
                })
                .populate({
                    path: 'floor3.cell_ids',
                    model: Cell,
                    populate: {
                        path: 'wine_id',
                        model: Wine
                    }
                })
                .then(function(cellar){
                    console.log("[WINECELLAR]:: winecellar found");
                    console.log(cellar);
                    res.json(cellar);
                })
                .catch(function(err){
                    console.log("[WINECELLAR]:: winecellar data ERROR!");
                    res.json(err);
                });
        })
        
    // !!! ROUTE TO setting !!!
    router.route('/setting')
        // !!! GET !!!
        // !!! function to get cellar setting !!!
        .get(function(req, res){
            console.log("[WINECELLAR]:: winecellar setting request received");
            // step 1. find cellar
            Cellar.findOne({_id: req.query.id})
                .then(function(cellar){
                    // step 2. return cellar setting info
                    console.log("[WINECELLAR]:: winecellar found");
                    console.log(cellar);
                    res.json(cellar);
                })
                .catch(function(err){
                    console.log("[WINECELLAR]:: winecellar data ERROR!");
                    res.json(err);
                });
        })
        // !!! POST !!!
        // !!! function to set cellar setting !!!
        .post(function(req, res){
            console.log("[WINECELLAR]:: winecellar setting request received");
            var setting = req.body;
            // step 1. find cellar
            Cellar.findOne({_id: req.body.cellarid})
                .then(function(cellar){
                    // step 2. update cellar setting
                    console.log("[WINECELLAR]:: winecellar found");
                    console.log(cellar);
                    cellar.floor1.type = setting.floor1_type;
                    cellar.floor1.temperature_now = setting.floor1_temperature_now;
                    cellar.floor1.temperature_target = setting.floor1_temperature_target;
                    cellar.floor1.is_smart_mode = setting.floor1_is_smart_mode;
                    cellar.floor2.type = setting.floor2_type;
                    cellar.floor2.temperature_now = setting.floor2_temperature_now;
                    cellar.floor2.temperature_target = setting.floor2_temperature_target;
                    cellar.floor2.is_smart_mode = setting.floor2_is_smart_mode;
                    cellar.floor3.type = setting.floor3_type;
                    cellar.floor3.temperature_now = setting.floor3_temperature_now;
                    cellar.floor3.temperature_target = setting.floor3_temperature_target;
                    cellar.floor3.is_smart_mode = setting.floor3_is_smart_mode;
                    // step 3. return cellar setting info
                    cellar.save();
                    res.json(cellar);
                })
                .catch(function(err){
                    console.log("[WINECELLAR]:: winecellar data ERROR!");
                    res.json(err);
                });
        })

    // !!! ROUTE TO cell !!!
    router.route('/cell')
        // !!! GET !!!
        // !!! function to ask client before put the wine !!!
        .get(function(req, res){
            console.log("[WINECELLAR]:: winecellar cell request received");
            // step 1. find cellar
            Cellar.findOne({_id: req.query.cellarid})
                .populate({
                    path: 'floor1.cell_ids',
                    model: Cell
                })
                .populate({
                    path: 'floor2.cell_ids',
                    model: Cell
                })
                .populate({
                    path: 'floor3.cell_ids',
                    model: Cell
                })
                .then(function(cellar){
                    // step 2. find cell
                    console.log("[WINECELLAR]:: winecellar found");
                    console.log(cellar);
                    // step 3. check through algorithm

                    res.json(cellar);
                })
                .catch(function(err){
                    console.log("[WINECELLAR]:: winecellar data ERROR!");
                    res.json(err);
                });
        })
        // !!! POST !!!
        // !!! function to put the wine !!!
        .post(function(req, res){
            console.log("[WINECELLAR]:: winecellar cell add request received");
            // step 1. create cell with provided wine id
            Cell.create({
                row: req.body.row,
                col: req.body.col,
                wine_id: req.body.wineid
            })
                .then(function(cell){
                    // step 2. find cellar with provided cellar id
                    Cellar.findOne({_id: req.body.cellarid})
                        .then(function(cellar){
                            // step 3. push cell id to cellar
                            if(req.body.row == 1){
                                cellar.floor1.cell_ids.push(cell._id);
                            }
                            else if(req.body.row == 2){
                                cellar.floor2.cell_ids.push(cell._id);
                            }
                            else if(req.body.row == 3){
                                cellar.floor3.cell_ids.push(cell._id);
                            }
                            cellar.save();
                            res.json(cellar);
                        })
                        .catch(function(err){
                            console.log("[WINECELLAR]:: winecellar data ERROR!");
                            res.json(err);
                        });
                })
                .catch(function(err){
                    console.log("[WINECELLAR]:: winecellar data ERROR!");
                    res.json(err);
                });

        })
            

    // !!! ROUTE TO move !!!
    router.route('/move')
        // !!! GET !!!
        // !!! function to ask client before move the wine !!!
        .get(function(req, res){
            console.log("[WINECELLAR]:: winecellar move request received");
            res.json({message: "move request received"});
        })
        // !!! POST !!!
        // !!! function to move the wine !!!
        .post(function(req, res){
            console.log("[WINECELLAR]:: winecellar move request received");
            // step 1. remove wine from cellar
            // step 1-1. find cellar
            Cellar.findOne({_id: req.body.cellarid})
                .populate({
                    path: 'floor1.cell_ids',
                    model: Cell,
                    populate: {
                        path: 'wine_id',
                        model: Wine
                    }
                })
                .populate({
                    path: 'floor2.cell_ids',
                    model: Cell,
                    populate: {
                        path: 'wine_id',
                        model: Wine
                    }
                })
                .populate({
                    path: 'floor3.cell_ids',
                    model: Cell,
                    populate: {
                        path: 'wine_id',
                        model: Wine
                    }
                })
                .then(function(cellar){
                    // step 1-2. find cell
                    var cellId;
                    if(req.body.wine1_row == 1){
                        cellar.floor1.cell_ids.forEach(function(cell){
                            if(cell.row == req.body.wine1_row && cell.col == req.body.wine1_col){
                                cellId = cell._id;
                                cellar.floor1.cell_ids.pull(cellId);
                            }
                        });
                    }
                    else if(req.body.wine1_row == 2){
                        cellar.floor2.cell_ids.forEach(function(cell){
                            if(cell.row == req.body.wine1_row && cell.col == req.body.wine1_col){
                                cellId = cell._id;
                                cellar.floor2.cell_ids.pull(cellId);
                            }
                        });
                    }
                    else if(req.body.wine1_row == 3){
                        cellar.floor3.cell_ids.forEach(function(cell){
                            if(cell.row == req.body.wine1_row && cell.col == req.body.wine1_col){
                                cellId = cell._id;
                                cellar.floor3.cell_ids.pull(cellId);
                            }
                        });
                    }
                    
                    // step 1-3. remove wine from cell
                    Cell.deleteOne({_id: cellId});
                    // step 2. add wine to cellar
                    // step 2-1. create cell with provided wine id
                    Cell.create({
                        row: req.body.wine2_row,
                        col: req.body.wine2_col,
                        wine_id: req.body.wine_id
                    })
                        .then(function(cell){
                            // step 2-2. save cell id to cellar
                            if(req.body.wine2_row == 1){
                                cellar.floor1.cell_ids.push(cell._id);
                            }
                            else if(req.body.wine2_row == 2){
                                cellar.floor2.cell_ids.push(cell._id);
                            }
                            else if(req.body.wine2_row == 3){
                                cellar.floor3.cell_ids.push(cell._id);
                            }
                            cellar.save();
                            res.json(cellar);
                        })
                        .catch(function(err){
                            console.log("[WINECELLAR]:: winecellar data ERROR!");
                            res.json(err);
                        }
                    );
                })
                .catch(function(err){
                    console.log("[WINECELLAR]:: winecellar data ERROR!");
                    res.json(err);
                });
        })
            
    return router;
}

