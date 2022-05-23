const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middlewares
require("dotenv").config();
const cors = require("cors");
app.use(cors());
app.use(express.json())

// mongo db connect 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2n7c6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(uri);
async function run () {
  try{
    await client.connect();
    const productCollection = client.db("products").collection("product"); 
    const orderCollection = client.db("orders").collection("order"); 
    

    // get all products 
    app.get('/products', async(req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    })
    // get id specific product 
    app.get('/product/:id', async(req, res)=> {
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const result = await productCollection.findOne(query);
      res.send(result);
    })

    // create new order 
    app.post('/new-order', async(req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    })

      // get single order with email 
      app.get('/my-orders/:email', async(req, res) => {
        const email = req.params.email;
        console.log(req.params.email);
        const result = await orderCollection.find({email}).toArray();
        res.send(result);
      })
      // get all orders for admin 
      app.get('/orders', async(req, res) => {
        const result = await orderCollection.find().toArray();
        res.send(result);
      })
    
      // delete single order 
      app.delete('/order/:id', async(req, res) => {
        const id = req.params.id;
        console.log(id);
        const filter = {_id: ObjectId(id)}
        const result = await orderCollection.deleteOne(filter)
        res.send(result);
      })

  } 
  finally{}
} 
run().catch(console.dir);

// home route
app.get("/", (req, res) => {
  res.send(" Menufacturer website is running fine");
});

app.listen(port, () => {
  console.log(`running server at http://localhost:${port}`);
});
