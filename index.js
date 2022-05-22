const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middlewares
require("dotenv").config();
const cors = require("cors");
app.use(cors());

/* const products = [
  {
    id: 1,
    img: "https://i.ibb.co/qkXjRYW/2-n-3-pin-socket-with-switch-400x400.png",
    name: "Gold Ray 3-Pin Multi-Functional Socket With One USB",
    price: 120,
    min_quan: 200,
    avail: 2000,
  },
  {
    id: 2,
    img: "https://i.ibb.co/wdTWpyc/3-PIN-FLAT-400x400.png",
    name: "ICON CLASSIC 3PIN FLAT SOCKET WT SWITCH",
    price: 120,
    min_quan: 200,
    avail: 2000,
  },
  {
    id: 3,
    img: "https://i.ibb.co/4fNMDrK/APPLE-SHAPE-pin-400x400.png",
    name: "Super Star Apple Shape LED Daylight Bulb",
    price: 120,
    min_quan: 200,
    avail: 2000,
  },
  {
    id: 4,
    img: "https://i.ibb.co/n6Lb31K/bel-pushed-400x400.png",
    name: "Super Star Gold Ray Bell Push",
    price: 120,
    min_quan: 200,
    avail: 2000,
  },
  {
    id: 5,
    img: "https://i.ibb.co/X4ctFGv/Classic-Pro-1200x800-400x400.png",
    name: "Super Star Celling Fan",
    price: 120,
    min_quan: 200,
    avail: 2000,
  },
  {
    id: 6,
    img: "https://i.ibb.co/hs7FH4L/DECORATIVE-BIG-BATTEN-HOLDER-B22-01-400x400.png",
    name: "DECORATIVE BIG BATTEN HOLDER (B22)",
    price: 120,
    min_quan: 200,
    avail: 2000,
  },
  {
    id: 7,
    img: "https://i.ibb.co/2dKHCFh/DOORBELL-400x400.png",
    name: "ICON CLASSIC DP SWITCH WITH NEON",
    price: 120,
    min_quan: 200,
    avail: 2000,
  },
  {
    id: 8,
    img: "https://i.ibb.co/8dfym7N/Four-Gang-One-Way-400x400.png",
    name: "Glamour Four Gang One Way Switch",
    price: 120,
    min_quan: 200,
    avail: 2000,
  },
  {
    id: 9,
    img: "https://i.ibb.co/kc6DS2f/Four-gang-one-way-400x400.png",
    name: "Ultimate Four Gang One Way Switch",
    price: 120,
    min_quan: 200,
    avail: 2000,
  },
  {
    id: 10,
    img: "https://i.ibb.co/5K1gv4C/Hexagon-Holder-B-22-1-400x400.png",
    name: "Hexagon Holder B-22 (Pin)",
    price: 120,
    min_quan: 200,
    avail: 2000,
  },
]; */

//   home featured products
// app.get("/products", async (req, res) => {
//   res.send(products);
// });

// mongo db connect 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2n7c6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(uri);
async function run () {
  try{
    await client.connect();
    const productCollection = client.db("products").collection("product"); 
    
    // get all products 
    app.get('/products', async(req, res) => {
      const result = await productCollection.find({}).toArray();
      res.send(result);
    })
    // get id specific product 
    app.get('/product/:id', async(req, res)=> {
      const id = req.params.id;
      console.log(id);
      const query = {_id: ObjectId(id)}
      const result = await productCollection.findOne(query);
      res.send(result);
    })
  } 
  finally{}
} 
run().catch(console.dir);



// home route
app.get("/", (req, res) => {
  res.send("Assignment 12 - Menufacturer website is running fine");
});

app.listen(port, () => {
  console.log(`running server at http://localhost:${port}`);
});
