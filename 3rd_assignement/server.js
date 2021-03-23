'use strict';

const express = require('express');

// Constants
const PORT = process.env.PORT;
// App
const app = express();

app.use(express.static('.'));

app.get('/', (req, res) => {
   var regip = req.ip;
   if (regip.substr(0, 7) == "::ffff:") {
      regip=regip.substr(7)
   }
   console.log(regip);
   res.send("<a href='https://murmuring-lowlands-72364.herokuapp.com/index.html'> click me </a>");

});
app.listen(PORT, console.log(`Running on port ${PORT}`)  );
