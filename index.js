const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middlewares
require("dotenv").config();
const cors = require("cors");
app.use(cors());
app.use(express.json());

// my custom middlewares  to verify users interactions
function verifyJWT(req, res, next) {
  const authorize = req.headers.authorization;
  if (!authorize) {
   return res.status(401).send({ Message: "UnAuthorized Access!!" });
  }
  const token = authorize.split(" ")[1]; // console.log(token);
  // verify a token symmetric
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      console.log(err);
     return res.status(403).send({ Message: "Access Forbidden" });
    }
    // console.log(decoded); // bar
    req.decoded = decoded;
    next();
  });
}

// mongo db connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2n7c6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// console.log(uri);
async function run() {
  try {
    await client.connect();
    const productCollection = client.db("products").collection("product");
    const orderCollection = client.db("orders").collection("order");
    const reviewCollection = client.db("reviews").collection("review");
    const userCollection = client.db("users").collection("user");

    // get all products
    app.get("/products", async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });
    // get id specific product (single)
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });
    // ADD NEW PRODUCT
    app.post('/product', async(req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    })
   
      
    // create new order
    app.post("/neworder", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    // get single order with email
    app.get("/my-orders/:email", async (req, res) => {
      const email = req.params.email;
        const result = await orderCollection.find({ email }).toArray();
        return res.send(result);
    });
    // get all orders for admin
    app.get("/orders", async (req, res) => {
      const result = await orderCollection.find().toArray();
      res.send(result);
    });

    // delete single order
    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(filter);
      res.send(result);
    });

    // create new review
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });
    // getting  review
    app.get("/review", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });

    // delete single review
    app.delete("/review/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(filter);
      res.send(result);
    });

    // add users to database/  manage users
    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      const token = jwt.sign(
        { email: email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      res.send({ result, token });  
    });

    // update user info 
    app.put('/update/:email', async(req, res) => {
      const email = req.params.email;
      const updateInfo = req.body;
      console.log(email, updateInfo)
      const filter = {email: email}
      const options = {upsert : true}
      const update = {$set: updateInfo }
      const result = await userCollection.updateOne(filter, update, options)
      res.send(result);
    })


    // get user info 
    app.get('/user/:email', async(req, res)=> {
      const email = req.params.email;
      const result = await userCollection.findOne({email: email})
      res.send(result);
    })

    // make users admin 
    app.put("/admin/:email", async (req, res) => {
      const email = req.params.email;
      console.log(req.params);
      const filter = { email: email };
      const updateDoc = { $set: {role: 'admin'} };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send (result);  
    });

    // find all users 
    app.get("/users", async (req, res) => { // gets error when try to use verifyjwt
      const result = await userCollection.find().toArray();
      res.send(result);
    });
    // delete user
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(filter);
      res.send(result);
    });

    
    




  } finally {
  }
}
run().catch(console.dir);

// home route
app.get("/", (req, res) => {
  res.send(" Menufacturer website is running fine");
});

app.listen(port, () => {
  console.log(`running server at http://localhost:${port}`);
});
