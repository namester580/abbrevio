/**
 * Created by CoBLiN on 2016/05/23.
 */
 $(document).ready(function(){

    var voted = false;
    var guessed = false;
    var players = [];
    socket = io();
 //   var room = 'lobby';
  //  var table = $('#rooms');
socket.on('connect',function(){
    voted = false; //=======================================
    guessed = false;
    socket.emit('newPlayer',prompt('enter a username'));
//guessed = false;

});

//.. global
socket.on('endGame',function(winner){

    alert('winner is:' + winner);



    guessed = false;
    voted = false;
});





    $('form').submit(function () {
        // socket.emit('guess', $('#m').val());
       // if(socket.room!='lobby'){
      //  alert(socket.room);
            if (guessed == false ) {


                var guess = $('#m').val();
                socket.emit('guess', guess);
                $('#m').val('');
                guessed = true;


            } else
        {
            alert('already guessed');
        }




        return false;
    });





//--------------------------------------------------------------socket.emit('nawPlayer','marco');

    var hAbbrevio = $('h1');

//document.write('<h1 style="text-align: center">' + acro + '<h1>');
        //   $('li').remove();
        hAbbrevio.text(abbrevio);
//$('h1').innerHTML(acro);

socket.on('chat',function(msg,plr){
  //  $('li').remove();
 //   $('#players').append('<li id =' + plr +'>' +  plr +':' + msg   + '</li>');
    $('#msgs').append('<li>' +  plr +':' + msg   + '</li>');

    guessed = false;


});




    socket.on('rooms',function(rooms,players,abbrevio) {
        hAbbrevio.text(abbrevio);
        if(abbrevio != 'ABBREVIO'){
            $('#msgs li').remove();
         //   alert('k');
            //$('#rooms li').remove();
           // $('#players li').remove();
        }
        $('#rooms li').remove();
        $('#players li').remove();

$('.room').remove();
        //  alert(socket.id);
        for (var a in rooms) {
       //    alert(rooms[a].name);
            // $('#rooms').append('<li><p>' + rooms[a].name +'</p><p>' + rooms[a].abbrevio + '</p><p>' + rooms[a].players.length + '</p><p>' + rooms[a].maxPlayers + '</p>' );
            $('#rooms').append('<tr class = "room" id =' + rooms[a].name + '>' + '<td>' + rooms[a].name + '</td>' + '<td>' + rooms[a].abbrevio + '</td>' + '<td>' + rooms[a].players + '</td>' + '<td>' + rooms[a].maxPlayers + '</td>' + '</tr>');
        //    $("#abbrevio").html(rooms[a].abbrevio);

makeClick(rooms[a].name);





        }

for(var e in players){

    $('#players').append('<li id =' + players[e].name +'>' +  players[e].name +':' +  players[e].guess + '----------------------' + players[e].score   + '</li>');



    if(players[e].guess != ''){
        $('#' + players[e].name).click(


                function() {
                   //   alert( players[e].name);
                    if(voted==false) {
                        vote(players[e].name);

                        voted = true;
                    }else{
                        alert('already voted');
                    }




                }

        );

    }else{
        $('#' +players[e].name).click(function(){
            alert('this user has not geussed yet, cant vote');
        });
    }





}

    });
    //to make the room elements clickable(workaround)
    function makeClick(el){
        $('#'+el).click(function(){
           // alert(el);
if(el!=socket.room){
    socket.emit('room',el);
guessed = false;
    voted = false;
}



        });

    }

    function vote(usernm) {
        socket.emit('vote', usernm);

    }

 });
