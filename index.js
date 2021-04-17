const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const app = express();
const fileUpload = require("express-fileupload");
const port = 3300;
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("services"));
app.use(fileUpload());

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
});
app.listen(process.env.PORT || port);
