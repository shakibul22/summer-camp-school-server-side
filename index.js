const express=require('express');
const app=express();
const cors=require('cors');
require('dotenv').config();
const port=process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hyww9ng.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {serverApi: {version: ServerApiVersion.v1,strict: true,deprecationErrors: true, }});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    

    // const yogaCollection = client.db("summer-camp-school").collection("yoga");
    const popularClassCollection = client.db("summer-camp-school").collection("popular-Class");
    const popularInstructorCollection = client.db("summer-camp-school").collection("popular-instructor");
    const instructorsCollection = client.db("summer-camp-school").collection("instructors");
    const classesCollection = client.db("summer-camp-school").collection("classes");
    const cartsCollection = client.db("summer-camp-school").collection("carts");
    const usersCollection = client.db("summer-camp-school").collection("users");
    

    app.post('/users', async (req, res) => {
      const item = req.body;
      const result = await usersCollection.insertOne(item);
      res.send(result);
    })

    app.get('/popularClass', async(req,res)=>{
      const query={};
      const options={
        sort:{"students":-1}
      };
      const cursor=popularClassCollection.find(query,options)
        const result= await cursor.toArray();
        res.send(result)
    })

    app.get('/popularInstructor', async(req,res)=>{
        const result= await popularInstructorCollection.find().toArray();
        res.send(result)
    })

    app.get('/instructors', async(req,res)=>{
        const result= await instructorsCollection.find().toArray();
        res.send(result)
    })
    app.get('/classes', async(req,res)=>{
        const result= await classesCollection.find().toArray();
        res.send(result)
    })

     // cart collection apis
     app.get('/carts',  async (req, res) => {
      const email = req.query.email;

      if (!email) {
        res.send([]);
      }
      const query = { email: email };
      const result = await cartsCollection.find(query).toArray();
      res.send(result);
    });

    app.post('/carts', async (req, res) => {
      const item = req.body;
      const result = await cartsCollection.insertOne(item);
      res.send(result);
    })

    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartsCollection.deleteOne(query);
      res.send(result);
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("Summer Camp School is running")
})
app.listen(port,()=>{
    console.log(`Summer Camp School is running on port:${port}`);
})