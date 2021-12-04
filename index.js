const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

//middlewire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.u30tt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("Ghurafera");
    const serviceCollection = database.collection("services");
    const bookingCollection = database.collection('booking');

    //POST API
    app.post("/", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.json(result);
      console.log("Inserted data");
    });

    //POST API 2
    app.post('/booking', async(req,res)=>{
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.json(result);
      console.log('booking');
    })


    //GET API
    app.get('/services',async(req,res)=>{
        const cursor = serviceCollection.find({});
        const service =  await cursor.toArray();
        res.send(service);
    })

    // GET API 2
    app.get('/plan/:id', async (req,res)=>{
      const id = req.params.id; 
      const query = {_id:ObjectId(id)};
      // console.log(query);
      const plan = await serviceCollection.findOne(query);
      res.json(plan);
      // console.log(plan)
      // console.log('Planed')
    })
    // GET API 3
    app.get('/bookedPlan', async(req,res) =>{
      const cursor = bookingCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    })
    //GET API 4 

    app.get('/bookedPlang/:updateId',async(req,res)=>{
      const id = req.params.updateId; 
      const query = {_id:ObjectId(id)};
      // console.log(req.params)
      const singleBooking = await bookingCollection.findOne(query)
      res.json(singleBooking);
    })
    //DELETE API 
    app.delete('/bookedPlan/:planId',async (req,res) => {
      // console.log(req)
      const id = req.params.planId;
      const query = {_id:ObjectId(id)};
      // console.log(query);
      const deletePlan = await bookingCollection.deleteOne(query);
      res.json(deletePlan);
      // console.log(deletePlan);
      // console.log('deleted')
    })


    //UPDATE API
    app.put('/updatePlan/:updateId', async (req,res)=>{
      const id = req.params.updateId;
      const updatedPlan = req.body;
      // console.log(id);
      // console.log(req);
      res.send('updated')
       const query = {_id:ObjectId(id)};
       const options = {upsert: true};
       const updateDoc = {
        $set: {
         data:{
          name: updatedPlan.data.name,
          email: updatedPlan.data.email,
          age: updatedPlan.data.age,
          phone: updatedPlan.data.phone,
          address: updatedPlan.data.address,
          status: updatedPlan.data.status
         },
         status: updatedPlan.status
        },
      };
      const updatePlan = await bookingCollection.updateOne(query,updateDoc,options);
      res.json(updatePlan);
      console.log(updatePlan);
      console.log('Updated')
    })



  } finally {
    // client.close()
  }
}
run().catch(console.dir);

app.get("/a", (req, res) => {
  res.send("This Server is ready for Assignment-11");
});

app.listen(port, () => {
  console.log("listen to port", port);
});
