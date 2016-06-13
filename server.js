/**
 * Created by CoBLiN on 2016/05/23.
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
//var $ = require('jquery');
var io = require('socket.io')(http);

var players = [{
    name:'name' ,
    guess:'',
    score: 0,
    room:'lobby'


}];
var clients=0;
var rooms = [{
    name: 'lobby',
    abbrevio:'ABBREVIO',
    maxPlayers:50,
    players:1



},
    {
        name: 'notlobby',
        abbrevio:'',

        maxPlayers:50,
        players:0



    },

    {
        name: 'someRoom',
        abbrevio:'',

        maxPlayers:50,
        players:0



    },{
        name:'smallroom',
        abbrevio:'',
        maxPlayers:1,
        players:0



    }

];




app.use(express.static('public'));


app.get('/',function(req,res){

    res.sendFile(__dirname +'/index.html');

});

startGame('notlobby');
startGame('someRoom');  //----------------------------------------------------
startGame('smallroom');


io.on('connect',function(socket){
console.log("client connected:");
//socket.room = 'lobby';
//    io.emit('rooms',rooms);
   io.sockets.in(socket.room).emit('rooms',rooms,getPlayersFor(socket.room),getAbbrevio(socket.room));
socket.on('newPlayer',function(name){
   //assign to socket
 //   rooms[0].players++;
 //  addPlayer(name,'lobby');
  //  socket.name = name;
    //socket.room = 'lobby';
    //socket.join('lobby');
    //create player obj
    if(!nameExists(name)){
        addPlayer(name,'lobby');
        socket.name = name;
        socket.room = 'lobby';
        socket.join('lobby');
        players.push({
            name: name,
            score: 0,
            guess: '',
            room: 'lobby'


        });

        io.sockets.in(socket.room).emit('rooms',rooms,getPlayersFor(socket.room),getAbbrevio(socket.room));
        console.log('player: ' + name + ' joined the lobby' );
        io.sockets.in(socket.room).emit('chat',' just joined',socket.name);
    }else{
      socket.emit('nametaken');
console.log('error nametaken');

    }






 //   console.log(getPlayersFor(socket.room));
});

socket.on('room',function(room){
    if(socket.room != room){
        if(getRoom(room).players<(getRoom(room).maxPlayers)) {
            socket.leave(socket.room);
            // removePlayer(socket.name,socket.room);
            clearPlayer(socket.name);
            console.log(socket.name + " left " + socket.room);
            lessPlayer(socket.room);
            socket.room = room;
            console.log(socket.name + " joined " + socket.room);

            addPlayer(socket.name, socket.room);
            //   changeRoom(socket.name,socket.room);
            socket.join(socket.room);


        }else{
            socket.emit('roomfull');

        }
    }

    io.sockets.in(socket.room).emit('rooms',rooms,getPlayersFor(socket.room),getAbbrevio(socket.room));
    console.log(rooms);
  //  console.log(players);
});

//io.sockets.in(socket.room).emit('rooms',rooms);

//io.sockets.in(socket.room).emit('players',getPlayers(socket.room));

//console.log(io.sockets.adapter.rooms);
   // for(var w in io.sockets.adapter.rooms[socket.room]){
    //    console.log(JSON.stringify(io.sockets.adapter.rooms[socket.room][w].name));

  //  }


    socket.on('guess',function(gs){

        if(socket.room!='lobby') {
            guess(socket.name, gs);
            io.sockets.in(socket.room).emit('rooms',rooms,getPlayersFor(socket.room),getAbbrevio(socket.room));

        }else{
            io.sockets.in(socket.room).emit('rooms',rooms,getPlayersFor(socket.room),getAbbrevio(socket.room));

            io.sockets.in(socket.room).emit('chat',gs,socket.name);

        }


    });
socket.on('vote',function(player){
    vote(player);
    totalVotes = getScore(socket.room);
    io.sockets.in(socket.room).emit('rooms',rooms,getPlayersFor(socket.room),getAbbrevio(socket.room));
    if(totalVotes>=getPlayersFor(socket.room).length){
        endGame(socket.room);
    }

});



socket.on('disconnect',function(){
    console.log(socket.id + "disconnected");
    io.sockets.in(socket.room).emit('chat',' just left',socket.name);
  socket.leave(socket.room);
    removePlayer(socket.name,socket.room);
    io.sockets.in(socket.room).emit('rooms',rooms,getPlayersFor(socket.room),getAbbrevio(socket.room));

});





    });


function clearPlayer(name){
    for (var u in players){
        if(players[u].name == name){
            players[u].score = 0;
            players[u].guess = '';

        }
    }



}
function clearPlayers(room){
    for (var u in players){

        if(players[u].room == room){
            players[u].score = 0;
            players[u].guess = '';

        }
    }



}


function changeRoom(name,room){
    for (var t in players)
if(players[t].name == name){
    players[t].room = room;


}



}




function nameExists(name){
    var ex = false;
    for(var f in players){
        if(players[f].name == name){
            ex =true;
        }


    }
    return ex;

}




function getRoom(name) {
    for (var h in rooms) {
        if (rooms[h].name == name) {
            return rooms[h];
        }

    }
}

    function getPlayersFor(roomName){
        var plrs = [];
        for(var h in players){
            if (players[h].room == roomName){
                plrs.push(players[h]);
            }

        }
return plrs;

}
function addPlayer(player,room) {
    for (var h in rooms) {
        if (rooms[h].name == room) {
            rooms[h].players++;


        }

        for (var x in players) {
            if (players[x].name == player) {
                players[x].room = room
            }
        }


    }
}
function getAbbrevio(room){
    for (var y in rooms){
        if(rooms[y].name == room){
            return rooms[y].abbrevio;
        }
    }




}



function vote(player){



    for(var f in players){
        if(players[f].name == player){
            players[f].score = players[f].score + 1;
//totalVotes = getScore(socket.room);




        }

    }


}




function guess(name,gs){
    for(var d in players){

        if(players[d].name == name){
            players[d].guess = gs;
        }
    }



}


function abbrevio(){
    var abbr = '';
    var alph = ['a','b','c','d','e','f','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    for(var i = 1;i<=(Math.floor(Math.random()*5) + 2);i++){
        abbr = abbr + alph[Math.floor(Math.random()*alph.length)]


    }
    abbr = abbr.toUpperCase();




    return abbr;

}


function startGame(room){

    clearPlayers(room);


   for(var q in rooms){
       if(rooms[q].name == room){
           rooms[q].totalvotes = 0;
           rooms[q].abbrevio = abbrevio();
       }


   }
    io.sockets.in(room).emit('rooms',rooms,getPlayersFor(room),getAbbrevio(room));

    //   io.sockets.in(room).emit('abbrevio',abbrevio());



}


function getScore(room){
    var total = 0;
   var plrs = getPlayersFor(room);
    for(var g in plrs){
       total =total + plrs[g].score;

   }


    return total
}

function endGame(room){
    var winner = '';
    var winnerscore = 0;
    var plrs = getPlayersFor(room)
for(var w in plrs ){
if (plrs[w].score > winnerscore){
    winner = plrs[w].name;
    winnerscore = plrs[w].score;

}


}


io.sockets.in(room).emit('endGame',winner);
startGame(room);

}

function lessPlayer(room) {
    for (var h in rooms) {
        if (rooms[h].name == room) {
            rooms[h].players--;
            //    rooms[h].players.push(player);
        }

    }
}

function removePlayer(player,room){
    for(var h in rooms){
        if (rooms[h].name == room){
            rooms[h].players--;
        //    rooms[h].players.push(player);
        }

    }
    for(var z in players){

        if(players[z].name==player){
           players.splice(z,1);
        }
    }




}


function inRoom(player){
    var inroom = false;
    for(var f in rooms){
        for(var g in rooms[f].players){
            if(rooms[f].players[g].name == player){
                inroom = true;
            }
        }
    }
    return inroom;

}



http.listen(process.env.PORT ||5000,function(){
   console.log('listenning on port 5000');

});