const express = require("express");
const cors = require("cors");
// const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
// const dateSchema = new mongoose.Schema({ date: Date });
// const DateModel = mongoose.model("Date", dateSchema);
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rq4pd9h.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.get("/", (req, res) => {
  res.send("FNS Course Managment Server Running");
});

async function run() {
  try {
    await client.connect();
    console.log("client connnected");
    const courseCollection = client.db("course").collection("allcourse");
    const userCollection = client.db("user").collection("alluser");

    // Get All Course
    app.get("/allcourse", async (req, res) => {
      const result = await courseCollection.find({}).toArray();
      res.send(result);
    });

    // Get All User
    app.get("/alluser", async (req, res) => {
      const result = await userCollection.find({}).toArray();
      res.send(result);
    });

    // Get Single User
    app.post("/singleuser", async (req, res) => {
      const filter = req.body;
      const result = await userCollection.findOne(filter);
      res.send(result);
    });

    // Add New User
    app.post("/alluser", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // Update Single User
    app.put("/userUpdate/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const user = req.body;
      const options = { upsert: true };
      // const age = DateModel({ date: new Date(user.age) });
      const updateDoc = {
        $set: {
          name: user.name,
          phone: user.phone,
          address: user.address,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
      console.log(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log("Server Runnign Port", port);
});
