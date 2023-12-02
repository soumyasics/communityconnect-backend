const express=require('express')
const bodyParser=require('body-parser')
const db=require('./DBConnection')
const app=express()
const cors=require('cors')
const multer=require('multer') 
  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(express.static(`${__dirname}/upload`));

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use(cors())
app.get('/', (req, res) => {
    res.send('working')
})
const route=require('./routes')
app.use('/community_api',route)

app.listen(4003,()=>{
    console.log("Server created successfully");
})