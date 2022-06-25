"use strict";

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

class Tree {
    // Query ,organize and return Root, Factory and Factory.children nodes
    // Return --- {root:{root}, factories:[{node_id,parent_id,name,children:[{child}{child}]}]}
    static async get () {
        const rootRes = await db.query (
            `SELECT * FROM tree
            WHERE parent_id IS NULL`
        )
        const root = rootRes.rows[0]
        const factoriesRes = await db.query (
            `SELECT * FROM tree
            WHERE parent_id = 1`
        )
        const factories = factoriesRes.rows
        for (let f of factories){
            const children = await db.query (
                `SELECT * FROM tree
                WHERE parent_id = ${f.node_id}`
            )
            f.children = children.rows
        }
        
        return {root:root, factories:factories}
    }

    // create and return a new factory
    static async createFactory ({name}) {
        const res = await db.query(
            `INSERT INTO tree
            (parent_id, name)
            VALUES (1, $1)
            RETURNING node_id, parent_id, name`,
            [name]
        )
        const factory = res.rows[0]
        return factory
    }
    // Update the name column of a factory node
       static async updateFactoryName (id, name)  {
        console.log("id and name =",id,name)
            const res = await db.query (
                `UPDATE tree
                SET name = $1
                WHERE node_id = $2
                RETURNING name`,
                [name,id]
            )
            return (res.rows[0])
       }
    // create 'numChildren' amount of child nodes for a factory Node
    // Each Node will have a "name" of a random number 
    // in-between the lowerBound and upperBound aruments
    // if the factory already has children they are removed prior to a new children generation 
    static async createFactoryChildren(factoryID, numChildren,lowerBound,upperBound) {
        
        const factoryRes = await db.query(
            `SELECT * FROM tree
            WHERE node_id = $1`,
            [factoryID]
        )
        const factory = factoryRes.rows[0]

        if (!factory) throw new NotFoundError(`No factory: ${factoryID}`)
        
        const childRes = await db.query(
            `SELECT * FROM tree
            WHERE parent_id = ${factoryID}`
        )

        factory.children = childRes.rows

        if (factory.children.length != 0){
            for (let child of factory.children){
                const res = await db.query(
                    `DELETE
                    FROM tree
                    WHERE node_id = ${child.node_id}`
                )
            }
            factory.children = []
        }
        // pass in the lower and upperBound args to generate a random number in the proper range
        function randomIntFromInterval(min, max) {    
                 return Math.floor(Math.random() * (max - min + 1) + min)
                 }
        // generate new children based on the numChildren arg
         for (let i = 0; i < numChildren; i++){
            const childVal =  randomIntFromInterval(+lowerBound,+upperBound)
            const newChildRes = await db.query(
                `INSERT INTO tree (parent_id, name)
                VALUES (${factory.node_id}, ${childVal.toString()})
                RETURNING node_id, parent_id, name`
                
            )
            const newChild = newChildRes.rows[0]
            factory.children.push(newChild)
            }  
        return factory.children
    }
    // remove a factory node from db
    static async remove (node_id) {
        await db.query(
            `DELETE 
            FROM tree
            WHERE node_id = $1
            OR parent_id = $1`,
            [node_id]
        );
    }

  }

  module.exports = Tree