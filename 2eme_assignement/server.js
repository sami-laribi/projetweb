const express = require('express')
const app = express()
const bodyParser = require("body-parser")
var imageDataURI = require("image-data-uri")




const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@cluster0.syhwt.mongodb.net/whiteboard?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



app.use(express.urlencoded({ extended: true }));
app.use(bodyParser({limit: '50mb'}));
// parse application/json
app.use(express.json());



const port = process.env.PORT || 3031
const http = require('http').createServer(app)
const io = require('socket.io')(http)



client.connect(err => {
  db = client.db("whiteboard");
});
  
app.use(express.static('public'))

//I listen for socket connection
io.on('connect', (socket) => {
  //Once a user is connected I wait for him to send me figure on the event 'send_figure' or line with the event 'send_line'
  console.log('New connection')
  socket.on('send_figure', (figure_specs) => {
    //Here I received the figure specs, all I do is send back the specs to all other client with the event share figure
    socket.broadcast.emit('share_figure', figure_specs)
  })

  socket.on('send_line', (line_specs) => {
    //Here I received the line specs, all I do is send back the specs to all other client with the event share line
    socket.broadcast.emit('share_line', line_specs)
  })
})


app.post('/save', (req, res) => {
	 const nom=(req.body.img).toString();
	 const substr=nom.substr(nom.length-25,25);
     let filePath = './img/'+substr+'.png';
     imageDataURI.outputFile(req.body.img, filePath);

      db.collection('historique').insertOne(req.body, function(err, res){
    console.log('1 Document inserted');
  })
  })




app.post('/saved', (req, res) => {
 db.collection('historique').find({user: req.body.user}).toArray(function (err, data){
    res.send(data);
  })
});




http.listen(port, () => {
  console.log(`Example app listening at port :${port}`)
})

