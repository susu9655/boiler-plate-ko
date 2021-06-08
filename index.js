const express = require('express')
const { Mongoose } = require('mongoose')
const app = express()
const port = 5000
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://susu:a1234@boilerplate.y0xsy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
  useNewUrlParser:true,useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})