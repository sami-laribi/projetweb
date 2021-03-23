const bg="url('https://www.teahub.io/photos/full/220-2205714_get-the-latest-movies-data-src-kodi-tv.jpg')";
var n=0;
var div="div";
let idmovie=299534;
var butid=0;
var idinput="idi";
var allmovies=[];


function onsucess(response){ 
	 return response.json();
	}

function onfail(error){ 
   console.log('error : ', error);
	}

function movie(){
          var data=fetch('https://api.themoviedb.org/3/movie/'+idmovie+'?api_key=b1cd873b996025c059ed17379953c1b8&language=en-US').then(onsucess,onfail).then(function(data) {
          n=n+1;  
          div=div+n.toString();
          butid=butid+1;
          idinput=idinput+"1";
          addcomponent(div,bg,data.release_date,data.original_title,data.poster_path);
          n=n+1;
          get_input("who has acted or directed this movie ?",div+n.toString());
  });
}

movie(idmovie);
/* avengers id:299534 */
/* get the id of movie with the name : 
https://api.themoviedb.org/3/search/movie?  api_key=b1cd873b996025c059ed17379953c1b8&query=suicide+squad */
/* get the name of movie with id :
https://api.themoviedb.org/3/movie/299534?api_key=b1cd873b996025c059ed17379953c1b8&language=en-US */
/* get the names of actors with movie id : https://api.themoviedb.org/3/movie/299534/credits?api_key=b1cd873b996025c059ed17379953c1b8&language=en-US */
/*get the all movies of an actor or director with his id : https://api.themoviedb.org/3/person/155/movie_credits?api_key=b1cd873b996025c059ed17379953c1b8&language=en-US*/
/*get the id with name of actor :
http://api.tmdb.org/3/search/person?api_key=b1cd873b996025c059ed17379953c1b8&query=tom%20hanks
*/
  
  





function addcomponent (divmovact,bg,rl,origin_titl,imgg) {
   /*create Div*/
      var div = document.createElement("div");
      div.id=divmovact;
      div.style.backgroundImage=bg;
      div.style.backgroundSize="cover";
      div.style.color="white";
      div.style.padding="0px 11px 5px"
      div.className="container border col-sm";
      document.body.appendChild(div);
  
  /*create the title */
      var h1 = document.createElement("h1");
      var h1c = document.createTextNode(origin_titl);
      h1.appendChild(h1c);
      document.getElementById(divmovact).appendChild(h1)
  
  /*create the release date*/ 
      var h6 = document.createElement("h6");
      var h6c = document.createTextNode(rl);
      h6.appendChild(h6c);
      document.getElementById(divmovact).appendChild(h6)
  
  /*create the image*/
      var img = document.createElement("img"); img.src="https://www.themoviedb.org/t/p/w600_and_h900_bestv2"+imgg;
      img.className="img-fluid img-thumbnail";
      img.style.height="250px";
      document.getElementById(divmovact).appendChild(img)
  
}    











function get_input(actdict,d){
   /*create div*/
      var div = document.createElement("div");
      div.id=d;
      div.style.background="#001926";
      div.style.padding="13px 12px";
      div.className="container border mb-3";
      document.body.appendChild(div);
  
  
   /*create input text field*/
     var input = document.createElement("input");
     input.type="text";
     input.id=idinput;
     input.placeholder=actdict;
     input.className="form-control";
     input.onclick = function(){
          document.getElementById(idinput).value="";
          document.getElementById(idinput).style.color="black";
     };
     document.getElementById(d).appendChild(input);
  
  /*create sumbit button*/
     var but = document.createElement("input");
     but.className="btn btn-primary ";
     but.type="submit";
     but.id=butid;
     but.value="verify";
     but.onclick = function(){
          if(actdict=="who has acted or directed this movie ?"){
              verify(1);
          }
          else{
              verify(2);    
          }
     };
     but.style.marginTop="4px";
     document.getElementById(d).appendChild(but);
    var inp=document.getElementById(idinput);
if(inp!=null){
 inp.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   document.getElementById(butid).click();
  }
});
}
}



function verify(a){
      /*verification if we are in movie case*/

          if(a==1){
              var p=0;
              const  k="";
              var input=document.getElementById(idinput).value;
              /*getting id from a person name */
              var data2=fetch('https://api.tmdb.org/3/search/person?api_key=b1cd873b996025c059ed17379953c1b8&query='+input).then(onsucess,onfail).then(function(data2) {
              /*getting  all movies that the person worked in*/
                    var data3=fetch('https://api.themoviedb.org/3/person/'+data2.results[0].id+'/movie_credits?api_key=b1cd873b996025c059ed17379953c1b8').then(onsucess,onfail).then(function(data3) {
                    /*comparing if the movie id indeed correspond to the actor or director*/
                    for (var i in data3.cast){
                        if(data3.cast[i].id ==idmovie){
                            p=1;
                            break;
                        }
                    }
                    if(p==0){
                        for (var j in data3.crew){
                            if(data3.crew[j].id ==idmovie){
                            p=1;
                            break;
                            }
                        }
                    }
                    /*if its corresponding we print all his info and the input field*/
                    if(p==1){ 
                        n=n+1;
                        idinput=idinput+"1";
                        allmovies.push(data3.cast[i].title);
                        console.log(allmovies);
                        addcomponent(div+n.toString(),bg,"department of "+data2.results[0].known_for_department,data2.results[0].name,data2.results[0].profile_path);
                        document.getElementById( butid ).disabled=true;   
                        butid=butid+1;
                        n=n+1;
                        get_input("find me a movie in which this actor or director has been in ?",div+n.toString());
                    /*if not we get an error message in the input field*/
                    }else{
                        document.getElementById(idinput).value="incorrect, try again !";
                        document.getElementById(idinput).style.color="red";
                    }

                    });
           
              });
          }
          /*this is the case of choosing an actor or director*/
          else{
              var p1=0;
              var input=document.getElementById(idinput).value;
              /*we get the movie id with the the text that he just submited*/
              var  data3=fetch('https://api.themoviedb.org/3/search/movie?api_key=b1cd873b996025c059ed17379953c1b8&query='+input).then(onsucess,onfail).then(function(data3) {
              /*we compare if he put thee same movie twice, but we compare it with the first one because the api 
              is accurate , and with one word the maybe exists in an a title he get all titles , like when typing 
              iron man he gets all movies with iron man in it */
              if(allmovies.includes(data3.results[0].original_title)){
                  document.getElementById(idinput).value="you can't choose the same movie twice !";
                  document.getElementById(idinput).style.color="red"; 
              }
              /*if its a new movie we now verify if its really his movie or not*/
              else{
                  var exidinput=idinput.substring(0, idinput.length-1);
                  console.log(exidinput);
                  var exinput=input=document.getElementById(exidinput).value;
                  console.log(exinput);
                  /*we get the id of that person*/
                  var data5=fetch('https://api.tmdb.org/3/search/person?api_key=b1cd873b996025c059ed17379953c1b8&query='+exinput).then(onsucess,onfail).then(function(data5) {
                  /*we get the all movies that he worked in */
                  var data6=fetch('https://api.themoviedb.org/3/person/'+data5.results[0].id+'/movie_credits?api_key=b1cd873b996025c059ed17379953c1b8').then(onsucess,onfail).then(function(data6) {
                  
                  for (var i in data6.cast){
                        if(data6.cast[i].id==data3.results[0].id){
                            p1=1;
                            break;
                        }
                  }
                   if(p1==0){
                        for (var j in data3.crew){
                            if(data6.crew[j].id ==data3.results[0].id){
                            p1=1;
                            break;
                            }
                        }
                    }
                  /*if its all good we do the same thing and we call movie to repeat the work with new parameters*/ 
                  if(p1==1){
                        idmovie=data3.results[0].id;
                        console.log(idmovie);
                        document.getElementById( butid ).disabled=true;  
                        allmovies.push(data3.results[0].original_title);
                        movie();
                   }            
                   else{
                        document.getElementById(idinput).value="he wasn't in this movie ! ";
                        document.getElementById(idinput).style.color="red"; 
                    }  
                   });
               
            });   
         }  
      });
  }   
}