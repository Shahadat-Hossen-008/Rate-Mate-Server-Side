require('dotenv').config()
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.port || 5000;
app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.fzuzq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
      const serviceCollection = client.db('ServicePortal').collection('Services');
      const allReviews = client.db('ServicePortal').collection('Reviews')
      //Home page Service APIs
      app.get('/service-section',async (req, res)=>{
        const services = await serviceCollection.find().limit(6).toArray();
        res.send(services);
      })
      //All services apis
      app.get('/all-services', async(req, res)=>{
        const result = await serviceCollection.find().toArray();
        res.send(result);
      })
      //Specific services apis
      app.get('/all-services/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await serviceCollection.findOne(query);
        res.send(result);
      })
      //get specific user services apis
      app.get('/all-service/:email', async(req, res)=>{ //after all-services slash id and email are same thats why before emails or id all-services must be change
        const email = req.params.email;
        const query = { user_email : email}
        const result = await serviceCollection.find(query).toArray();
        res.send(result)
      })
      //add service to apis
      app.post("/add-services", async(req, res)=>{
        const service = req.body;
        const result = await serviceCollection.insertOne(service);
        res.send(result);
      })
      //delete service apis
      app.delete('/all-service/:id',async (req, res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await  serviceCollection.deleteOne(query);
        res.send(result)
      })
      //update service apis
      app.put('/update-service/:id', async(req, res)=>{
        const id = req.params.id;
        const serviceData = req.body;
        const updateService={
          $set: serviceData
        }
        const query = {_id : new ObjectId(id)};
        const options = {upsert: true};
        const result = await serviceCollection.updateOne( query, updateService, options)
        res.send(result);
      })
      //get all review
      app.get('/all-review', async(req, res)=>{
        const result = await allReviews.find().toArray();
        res.send(result);
      })
      //get specific user Reviews apis
      app.get('/all-review/:email', async(req, res)=>{ 
        const email = req.params.email;
        const query = { user_Email : email};
        const result = await allReviews.find(query).toArray();
        res.send(result)
      })
      //Reviews apis
      app.post('/all-reviews', async(req, res)=>{
        const reviewPost = req.body;
        const result = await allReviews.insertOne(reviewPost);
        res.send(result);
      })
       //update review apis
       app.put('/update-review/:id', async(req, res)=>{
        const id = req.params.id;
        const reviewData = req.body;
        const updateReview={
          $set: reviewData
        }
        const query = {_id : new ObjectId(id)};
        const options = {upsert: true};
        const result = await allReviews.updateOne(query, updateReview, options)
        res.send(result);
      })
      
      //Delete review apis
      app.delete('/all-review/:id',async (req, res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await  allReviews.deleteOne(query);
        res.send(result)
      })
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("So many services is upcoming");
});

app.listen(port, () => {
  console.log(`This port is running ${port}`);
});
