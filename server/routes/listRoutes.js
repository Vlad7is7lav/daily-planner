const express = require("express");
const router = express.Router();

//Model 
const { List } = require('../model/list')

//Middleware
const {auth} = require('../middleware/auth');
var delay = false
//// auth!!!
router.route('/list')
.post(auth, async (req, res, next) => {
    console.log('req', req.body.todos)
    console.log('delay', delay)
    var checkData = true;
    if (delay === false) {
        delay = true;
        
        try {
            const list = new List({...req.body, ownID: req.user._id});
            const sdoc = await list.save();
            res.status(200).json({ success: true, data: sdoc });
            console.log('new List', sdoc);
        } catch {
            return res.json({ success: err });
        }
        setTimeout(()=> {
            delay = false;
        }, 1000)
    } else {
        List.findOneAndUpdate({date: req.body.date, listName: req.body.listName}, {$push: {todos: req.body.todos}}, {new: true}, (err, doc) => {
            console.log('lol', doc)
            // if (doc == null) return checkData = false;
            if (err) {
                // next(err);
                return res.json({success: err})
            } else {
                res.json({
                    success: true,
                    data: doc
                })
                return true
            }
        })
    }
})

.patch(auth, async (req, res, next) => { // доработать
    console.log('patch list');
    await List.findByIdAndUpdate({_id: req.body._id}, req.body, {new: true}, (err, doc) => {
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

.get(auth, async (req, res, next) => {
    try {
        await List.findById({_id: req.query.id}, (err, doc)=>{
            res.json({
                success: true,
                data: doc,
                auth: true
            })
        })
    } catch {
        return res.json({success: err})
    }    
})

.delete(auth, (req, res, next) => {
    List.findByIdAndRemove({_id: req.query.id}, {new: true}, (err,doc) => {
        if(err) {
            // next(err);
            return res.json({success: err})
        } else {
            res.json({
                success: true,
                message: "Deleted successfull"
            })
        }
    })
})

router.route('/all_lists')
.get(auth, (req, res)=>{
    // /all_stories?skip=1&limit=4&order=asc&owner=lfkoeoiwjff

    // let skip = req.query.skip ? parseInt(req.query.skip) : 0;
    // let limit = req.query.limit ? parseInt(req.query.limit) : 50;
    // let order = req.query.order ? req.query.order : 'asc';
    // let byOwner=req.query.owner ? {ownerId: req.query.owner} : {}

    List.find({ownID: req.user._id}).exec((err, doc)=>{
        if(err) return res.status(400).send(err);
        // res.send(doc);
        res.json({auth: true, data: doc});
    })
})

router.post('/list/add_task', auth, function(req, res){
    // try {
    //     const doc = List.findByIdAndUpdate(req.body._id, {$push: {todos: req.body.todos}}, {new:true}, (err, doc) => doc);
    //     console.log(doc, 'add_task')
    //     res.status(200).json({success: true, data: doc})
    // } catch {
    //     return res.json({success: err})
    // }
    

    List.findByIdAndUpdate(req.body._id, {$push: {todos: req.body.todos}}, {new:true}, (err, doc) => {
        console.log('add_task', req.body.todos)
        if(err) {
            // next(err);
            return res.json({success: err})
        } else {
            res.status(200).json({success: true, data: doc})
        }
    })
})

router.patch('/list/update_item', auth, function(req, res){
    console.log('update_item')
    const index = req.body.index;
    List.findByIdAndUpdate(req.body._id, {$set: {[`todos.${index}`]: req.body.todos}}, {new:true}, (err, doc) => {
        if(err) {
            // next(err);
            return res.json(err)
        } else {
            res.status(200).json({success: true, data: doc})
        }
    })
})

router.patch('/list/del_task', auth, (req, res, next) => {
    const index = req.body.index;
    List.findByIdAndUpdate({_id: req.body._id}, [{$set: {
        todos: {
            $concatArrays: [
                {$slice: ["$todos",index]},
                {$slice: ["$todos", {$add: index+1}, {$size: "$todos"} ]}
            ]
        }
    }}], {new:true}, (err,doc) => {
        if(err) {
            next(err)
        } else {
            // let doc1 = doc;
            // if(doc.todos.length === 0) {
            //     List.findByIdAndRemove({_id: req.body.id}, {new: true}, (err,doc) => {
            //         res.json({
            //             success: true,
            //             message: "List deleted successfull",
            //             data: doc1
            //         })
            //     })
            //     return
            // }
            res.json({
                success: true,
                data: doc
            })
        }
    })
})


module.exports = router;