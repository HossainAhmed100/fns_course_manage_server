const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

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

    app.post("/alluser", async (req, res) => {
      console.log(req.body);
    });
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log("Server Runnign Port", port);
});
