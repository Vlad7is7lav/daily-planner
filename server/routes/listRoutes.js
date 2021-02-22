const express = require("express");
const router = express.Router();

//Model 
const { List } = require('../model/list')

//Middleware
const {auth} = require('../middleware/auth');

//// auth!!!
router.route('/list')
.post((req, res, next) => {
    const list = new List(req.body);
    list.save((err,doc) => {
        if(err) {
            return res.json({success: err})
        } else {
            res.status(200).json({success: true, _id: doc._id})
        }
    })
})

.patch((req, res, next) => { // доработать
    List.findByIdAndUpdate({_id: req.body._id}, req.body, {new: true}, (err, doc) => {
        if (err) {
            // next(err);
            return res.json({success: err})
        } else {
            res.json({
                success: true,
                data: doc
            })
        }
    })
})

.get((req, res, next) => {
    List.findById({_id: req.body._id}, (err, doc)=>{
        if(err) {
            // next(err);
            return res.json({success: err})
        } else {
            res.json({
                success: true,
                data: doc.todos[0]
            })
        }
    })
})

.delete((req, res, next) => {
    List.findByIdAndRemove({_id: req.body._id}, {new: true}, (err,doc) => {
        if(err) {
            // next(err);
            return res.json({success: err})
        } else {
            res.json({
                message: "Deleted successfull"
            })
        }
    })
})

router.route('/all_lists')
.get((req, res)=>{
    // /all_stories?skip=1&limit=4&order=asc&owner=lfkoeoiwjff

    // let skip = req.query.skip ? parseInt(req.query.skip) : 0;
    // let limit = req.query.limit ? parseInt(req.query.limit) : 50;
    // let order = req.query.order ? req.query.order : 'asc';
    // let byOwner=req.query.owner ? {ownerId: req.query.owner} : {};

    List.find().exec((err, doc)=>{
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})

router.post('/list/add_task', function(req, res){
    List.findByIdAndUpdate(req.body._id, {$push: {todos: req.body.task}}, (err, doc) => {
        if(err) {
            // next(err);
            return res.json({success: err})
        } else {
            res.status(200).json({success: true})
        }
    })
})

router.patch('/list/update_task', function(req, res){
    const index = req.body.index;
    List.findByIdAndUpdate(req.body._id, {$set: {[`todos.${index}`]: req.body.task}}, {new:true}, (err, doc) => {
        if(err) {
            // next(err);
            return res.json(err)
        } else {
            res.status(200).json({success: true, data: doc})
        }
    })
})

router.delete('/list/del_task',(req, res, next) => {
    const index = 2
    List.findByIdAndUpdate({_id: req.body._id}, [{$set: {
        todos: {
            $concatArrays: [
                {$slice: ["$todos",2]},
                {$slice: ["$todos", {$add: index+1}, {$size: "$todos"} ]}
            ]
        }
    }}] , {new:true}, (err,doc) => {
        if(err) {
            next(err)
        } else {
            res.json({
                success: true,
                data: doc
            })
        }
    })
})


module.exports = router;