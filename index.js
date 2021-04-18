const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const app = express();
const port = 3300;
const ObjectId = require("mongodb").ObjectId;
app.use(bodyParser.json());
app.use(cors());

require("dotenv").config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.emnwf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
app.get("/", (req, res) => {
  res.send("hello world");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const serviceCollection = client
    .db(process.env.DB_NAME)
    .collection(process.env.DB_SER);
  const skillCollection = client
    .db(process.env.DB_NAME)
    .collection(process.env.DB_SKILL);
  const packageCollection = client
    .db(process.env.DB_NAME)
    .collection(process.env.DB_PAC);
  const reviewCollection = client
    .db(process.env.DB_NAME)
    .collection(process.env.DB_REV);
  const ordersCollection = client
    .db(process.env.DB_NAME)
    .collection(process.env.DB_ORD);
  const adminCollection = client
    .db(process.env.DB_NAME)
    .collection(process.env.DB_ADMIN);
  console.log("connected");
  app.get("/services", (req, res) => {
    serviceCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.get("/skills", (req, res) => {
    skillCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.get("/packages", (req, res) => {
    packageCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.get("/reviews", (req, res) => {
    reviewCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.get("/package/:id", (req, res) => {
    packageCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
  app.post("/placeOrder", (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order).then((result) => {
      console.log(result);
    });
  });
  app.post("/addReview", (req, res) => {
    const review = req.body;
    reviewCollection.insertOne(review);
  });
  app.post("/addAdmin", (req, res) => {
    const admin = req.body;
    adminCollection.insertOne(admin);
  });
  app.post("/orderHistory", (req, res) => {
    const email = req.body.email;
    adminCollection.find({ adminEmail: email }).toArray((err, admin) => {
      let filter = {};
      if (admin.length === 0) {
        filter.email = email;
      }
      ordersCollection.find(filter).toArray((err, documents) => {
        res.send(documents);
      });
    });
  });
  app.post("/isAdmin", (req, res) => {
    const email = req.body.email;
    console.log(email);
    adminCollection.find({ adminEmail: email }).toArray((err, admin) => {
      res.send(admin.length > 0);
    });
  });
  app.delete("/delete/:id", (req, res) => {
    serviceCollection.deleteOne({ _id: ObjectId(req.params.id) });
  });
  app.post("/addService", (req, res) => {
    const service = req.body;
    serviceCollection.insertOne(service);
  });
});
app.listen(process.env.PORT || port);
