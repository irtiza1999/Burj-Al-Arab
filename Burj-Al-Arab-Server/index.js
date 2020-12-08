const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const port = 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
require('dotenv').config()

const serviceAccount = require("./burj-al-arab-ishad-firebase-adminsdk-ope80-554729269d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://burj-al-arab-ishad.firebaseio.com",
});

const MongoClient = require("mongodb").MongoClient;
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gi4fd.mongodb.net/BurjAlArab?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const bookings = client.db("BurjAlArab").collection("bookings");
  console.log("Connected");

  app.post("/addBooking", (req, res) => {
    const newBooking = req.body;
    bookings.insertOne(newBooking).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.get("/bookings", (req, res) => {
    const bearer = req.headers.authorization;
    if (bearer && bearer.startsWith("Bearer ")) {
      const idToken = bearer.split(" ")[1];
      admin
        .auth().verifyIdToken(idToken)
        .then((decodedToken) => {
          const tokenEmail = decodedToken.email;
          const queryEmail = req.query.email;
          if (tokenEmail == queryEmail) {
            bookings.find({ email: req.query.email })
              .toArray((err, documents) => {
                res.send(documents);
              });
          }
          else{
            res.status(401).send("Unauthorized ascess.");
          }
        })
        .catch((error) => {
          res.status(401).send("Unauthorized ascess.");
        });
    }
    else{
      res.status(401).send("Unauthorized ascess.")
    }
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port);
