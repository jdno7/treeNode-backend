"use strict";

/** Express app for jobly. */
const Tree = require("./models/tree")
const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const morgan = require("morgan");

const app = express();
const wsExpress = require('express-ws')(app);

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

// Web socket connection
// When the tree is updated on the client side a message will come here
// Send back the updated tree to all users (clients) to update state live
app.ws('/tree', function (ws, req, next){
  ws.on('message', async function (data) {
  const tree = await Tree.get()
  wsExpress.getWss().clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(tree))
      }
    })
  })
})
// return a tree object with root and factories keys
app.get('/tree', async function (req, res){
  const tree = await Tree.get()
  return res.json(tree)
})
// create a new factory
// req.body = {"name": "factory name" }
app.post('/tree', async function (req, res){
  try {
    const factory = await Tree.createFactory(req.body)
    return res.status(201).json(factory)
  }catch (err){
    return next(err)
  }
})
// Generate new children for an existinng factory
app.post('/tree/:node_id', async function (req, res, next){
  const {numChildren,lowerBound,upperBound} = req.body
  const factoryID = +req.params.node_id
  try {
    const children = await Tree.createFactoryChildren(factoryID,numChildren,lowerBound,upperBound)
    return res.json(children)
  }catch (err){
    return next(err)
  }
})
// Update Factory Name
app.patch('/tree/:node_id', async function (req, res, next){
  const {name} = req.body
  const id = +req.params.node_id
  try{
    const updatedFactory = await Tree.updateFactoryName(id,name)
    return res.json(updatedFactory)
  }catch (e) {
    return next(err)
  }
})
// remove a factory node
app.delete('/tree/:node_id', async function (req, res){
  try {
    await Tree.remove(req.params.node_id)
    return res.json({deleted: req.params.node_id})
  }catch (err){
    return next(err)
  }
})


/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
