const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

// connection string
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.eujox13.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const coffeeDB = client.db("coffeeDB");
    const coffeeCollection = coffeeDB.collection("coffeeCollection");

    /*==========================
    coffee routes start
    =============================*/
    app.post("/coffees", async (req, res) => {
      const data = req.body;
      const result = await coffeeCollection.insertOne(data);
      res.send(result);
    });

    app.get("/coffees", async (req, res) => {
      const query = {};
      const result = await coffeeCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const { name, chef, supplier, taste, category, details, photo } = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedData = {
        $set: {
          name,
          chef,
          supplier,
          taste,
          category,
          details,
          photo,
        },
      };
      const result = await coffeeCollection.updateOne(query, updatedData, options);
      res.send(result);
    });
    /*==========================
    coffee routes end
    =============================*/
  } finally {
    // await client.close();
  }
}
run().catch((error) => console.log(error.message));

/*==========================
home and error routes start
=============================*/
// home route
app.get("/", (req, res) => {
  res.send("Hello from home route!");
});

//  route not found error
app.use((req, res, next) => {
  res.status(404).send({ message: "Sorry!! route not found" });
});

// server error
app.use((err, req, res, next) => {
  res.status(501).send({ message: "Something went wrong!" });
});

/*==========================
home and error routes end
=============================*/

module.exports = app;

// =========end==========
