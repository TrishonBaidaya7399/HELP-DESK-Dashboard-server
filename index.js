const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require(`express`);
const app = express();
const cors = require("cors");
const { ObjectId } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//yPNspm72Hur4ruon
//HelpDesk

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lpqfqts.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const userCollection = client.db("HelpDesk").collection("users");
    const ticketCollection = client.db("HelpDesk").collection("ticket");

    // <---------------- Users ---------------->
    //set User data
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "User already exists!", insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const email = req.query.email;
      
      if (email) {
        console.log("Received a request to /users?email", email);
        const query = { email: email };
        const result = await userCollection.findOne(query);
        return res.send(result);
      }
    
      console.log("Received a request to /users (all users)");
      const allUsers = await userCollection.find().toArray();
      res.send(allUsers);
    });

    // <----------------- Tickets ------------------>
    app.post("/ticket", async (req, res) => {
      console.log("Received a request to /ticket");
      const item = req.body;
      const result = await ticketCollection.insertOne(item);
      res.send(result);
    });
    app.get("/ticket", async (req, res) => {
      console.log("Received a request to /ticket");
    
      const email = req.query.userEmail;
    
      if (email) {
        console.log("Received a request to /ticket?userEmail", email);
        const query = { userEmail: email };
        const result = await ticketCollection.find(query).toArray();
        res.send(result);
      } else {
        // If userEmail is not provided, retrieve all tickets
        const allTickets = await ticketCollection.find().toArray();
        res.send(allTickets);
      }
    });
    
    app.get("/ticket/:id", async (req, res) => {
      const id = req.params.id;
    
      try {
        console.log("Fetching ticket by ID:", id);
        const query = { _id: new ObjectId(id) };
        const result = await ticketCollection.findOne(query);
    
        if (result) {
          console.log("Ticket found:", result);
          res.send(result);
        } else {
          console.log("Ticket not found");
          res.status(404).send("Ticket not found");
        }
      } catch (error) {
        console.error("Error fetching ticket by ID:", error);
        res.status(500).send("Internal Server Error");
      }
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
  res.send("HelpDesk is online");
});

app.listen(port, () => {
  console.log(`HelpDesk is running on port: ${port}`);
});
