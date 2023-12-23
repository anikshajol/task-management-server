const express = require("express");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(express.json());

// mongodb

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://admin:admin@cluster0.jgojmkc.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // connect collection
    const todoCollection = client.db("taskManagement").collection("todoList");

    // todo-list
    app.post("/api/v1/create-todo", async (req, res) => {
      try {
        const query = req.body;
        const result = await todoCollection.insertOne(query);
        res.send(result);
      } catch (error) {}
    });

    app.get("/api/v1/todo-list", async (req, res) => {
      try {
        const result = await todoCollection.find().toArray();
        res.send(result);
      } catch (error) {}
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log(`server is running from ${port}`);
});
