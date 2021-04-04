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
     let filePath = './public/img/'+substr+'.png';
     imageDataURI.outputFile(req.body.img, filePath);

      db.collection('historique').insertOne(req.body, function(err, res){
    console.log('1 Document inserted');
  })
  })



	
app.get('/saved', (req, res) => {
 db.collection('historique').find({}).toArray(function (err, data){
     if(data.length>0){

              var header="<html><head><link href='https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css' rel='stylesheet' integrity='sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6' crossorigin='anonymous'> <style> body{background_color:black;} </style></head>'<body><div class='container'><h1>Community Art </h1></div><br>";
              var content="";
              console.log((data[0].img).length);
              for (var i=0;i<data.length; i++){
                   		if(i==0){}
                      content='<div class="container"><div class="card"><h2>'+data[i].user+'</h2><h5>'+data[i].date+'</h5><br><img style="width:50%" src='+data[i].img+'><button class="btn btn-primary" onclick=\'javascript:(function() { var wind=window.open("about:blank"); wind.document.write("<img src='+data[i].img+'>"); wind.document.close(); })()\'> show image</button></div></div>'+content;
              }

                content=header+content+'<script>function click(){alert("kkbb");}</script></body></html>';
                res.send(content);
               
          }
          else{
            res.send("sorry no pictures yet ! try making some art in the whiteboard ");
  		}
	});
});

app.get('/open', (req, res) => {
	console.log(req.query['img'].length)
 res.send("<img src='"+req.query['img']+"'>");
});




http.listen(port, () => {
  console.log(`Example app listening at port :${port}`)
})

