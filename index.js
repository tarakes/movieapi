const express = require('express');
const { MongoClient } = require('mongodb');
const cors=require('cors');
require('dotenv').config();
const app = express();
const  corsOptions = {
    origin: process.env.REACT_FRONTEND
  }
app.use(cors(corsOptions));
const url = process.env.DATABASE_URL;
const dbName = 'insynk';
const pageSize=10;
const client = new MongoClient(url);
client.connect().then(()=>{
    console.log("database connected");
})
.catch((error)=>{
    console.log(error);
})

const db = client.db(dbName);
const collection = db.collection('movie');
app.get("/",async (req,res)=>{
    const pageNumber=req.query.pageno;
    if(!pageNumber || pageNumber<=0)
    pageNumber=1;

    try {
        const movieList=await collection.find({}).skip((pageNumber-1)*pageSize).limit(pageSize).toArray();
        res.send(movieList);
    } catch (error) {
        res.sendStatus(500);
    }
  
   
})
app.get("/filter",async(req,res)=>{
    const moviename=req.query.moviename;
    if(moviename===undefined)
    {
        res.sendStatus(400);
        return;
    }
   try {
    const movieList=await collection.find( { title: { $regex: `(?i)${moviename}` } } ).toArray();
    res.send(movieList);

   } catch (error) {
    console.log(error);
    res.sendStatus(500);
   }
})
app.listen(4000,()=>{
    console.log("server listening on 4000");
})