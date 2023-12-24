const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// mongodb

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
        const todoData = req.body;
        // Set the initial status to "todo"
        todoData.status = "todo";

        const result = await todoCollection.insertOne(todoData);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.put("/api/v1/update-todo-status/:id", async (req, res) => {
      try {
        const todoId = req.params.id;
        const query = { _id: new ObjectId(todoId) };
        const { status } = req.body;
        console.log(status);
        const options = { upsert: true };
        const updateDoc = {
          $set: { status },
        };
        // Update the status of the todo item
        const result = await todoCollection.updateOne(
          query,
          updateDoc,
          options
        );

        res.send(result);
      } catch (error) {
        console.error(error);

        res.status(500).send("Internal Server Error");
      }
    });

    app.get("/api/v1/todo-list", async (req, res) => {
      try {
        const result = await todoCollection.find().toArray();
        res.send(result);
      } catch (error) {}
    });

    // todo
    app.get("/api/v1/todo-list/todo", async (req, res) => {
      try {
        const result = await todoCollection.find({ status: "todo" }).toArray();
        res.send(result);
      } catch (error) {}
    });
    // ongoing
    app.get("/api/v1/todo-list/ongoing", async (req, res) => {
      try {
        const result = await todoCollection
          .find({ status: "ongoing" })
          .toArray();
        res.send(result);
      } catch (error) {}
    });
    // ongoing
    app.get("/api/v1/todo-list/complete", async (req, res) => {
      try {
        const result = await todoCollection
          .find({ status: "complete" })
          .toArray();
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
