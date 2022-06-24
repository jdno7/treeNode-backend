"use strict";

/** Express app for jobly. */
const Tree = require("./models/tree")
const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.get('/tree', async function (req, res){
  const tree = await Tree.get()
  return res.json(tree)
})

app.post('/tree', async function (req, res){
  const factory = await Tree.createFactory(req.body)
  return res.status(201).json(factory)
})

app.post('/tree/:name', async function (req, res){
  const {numChildren,lowerBound,upperBound} = req.body
  const factoryName = req.params.name
  try {
    await Tree.createFactoryChildren(factoryName,numChildren,lowerBound,upperBound)
    return res.json(`created ${numChildren} for ${factoryName}`)
  }catch (err){
    return next(err)
  }
})
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
