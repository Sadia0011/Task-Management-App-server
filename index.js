const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app=express();
const port=process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uok4zlq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const UserCollection = client.db("taskManagementApp").collection("user");
    const TaskCollection = client.db("taskManagementApp").collection("task");

// user info
app.post("/user",async(req,res)=>{
    const user=req.body;
    const result=await UserCollection.insertOne(user)
    res.send(result)
})

app.get("/user",async(req,res)=>{
    const result=await UserCollection.find().toArray();
    console.log(result)
    res.send(result)
})

// add task
app.post("/addtask",async(req,res)=>{
    const task=req.body;
    const result=await TaskCollection.insertOne(task)
    res.send(result)
})

app.get("/addtask",async(req,res)=>{
    const result=await TaskCollection.find().toArray();
    res.send(result)
    })

    // user added task
    app.get("/userAddedtask",async(req,res)=>{
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
          query = { email: req.query.email }
      }
      const result=await TaskCollection.find(query).toArray();
        res.send(result)
    })

// delete
app.delete("/deletetask/:id",async(req,res)=>{
  const id=req.params.id;
  const query={_id:new ObjectId(id)}
  console.log("deleted id",query)
  const result=await TaskCollection.deleteOne(query)
  res.send(result)
})

// update task

app.get("/updatetask/:id",async(req,res)=>{
  const id=req.params.id;
  console.log(id)
  const query={_id:new ObjectId(id)}
  const result=await TaskCollection.findOne(query);
  console.log("update",result)
  res.send(result)
})

app.put("/updatetask/:id", async (req, res) => {
const id = req.params.id;
const filter = {
    _id: new ObjectId(id)
}
const options = {
    upsert: true
}
const item = req.body;
const updatedItem = {
    $set: {
      title:item.title,
      description:item.description,
      deadline:item.deadline,
      priority:item.priority,
      status:item.status
    }
}
const result = await TaskCollection.updateOne(filter, updatedItem, options);
res.send(result)
})

// update task status
app.patch("/updateTaskStatus/:id", async (req, res) => {
  const id = req.params.id;
  const status = req.body.status;

  const filter = {
    _id: new ObjectId(id)
  };

  const update = {
    $set: {
      status: status
    }
  };

  const result = await TaskCollection.updateOne(filter, update);

  res.send(result);
});

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/",async(req,res)=>{
    res.send("task management app server in running")
})

app.listen(port,()=>{
    console.log(`task management app is running on ${port}`)
})