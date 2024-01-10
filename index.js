const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

// middlewares 
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Miah Books server is running");
});

// mongodb url
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ubvegtf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const booksCollection = client.db("miahBooks").collection("books");
    const bookingsCollection = client.db("miahBooks").collection("bookings");

    // to get all books data from database in client side 
    app.get("/books", async (req, res) => {
      const query = {};
      const result = await booksCollection.find(query).toArray();
      res.send(result);
    });

    // to get books data from database in the client side (AllSecondHandProduct)
    app.get("/books/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const book = await booksCollection.findOne(query);
      res.send(book);
    });

    // to save all bookings in database
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    });

    // to get all bookings data in the client side (MyOrder)
    app.get("/bookings", async (req, res) => {
      const query = {};
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    });

    // to get specific bookings data in order to show in the populer component 
    app.get("/booking", async (req, res) => {
      const query = {};
      const result = await bookingsCollection.find(query).limit(3).toArray();
      res.send(result);
    });

  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`miah books server is runnig on ${port}`);
});