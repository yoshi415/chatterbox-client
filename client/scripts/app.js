var app = {

  // message: {
  //   "username": username,
  //   "text": text,
  //   roomname: roomname
  // },
  server: 'https://api.parse.com/1/classes/chatterbox',
  
  message: {}, 

  init: function() {
    // retrieves data object filled of messages
    app.fetch(); 
    // grab username from URL
    var myUsername = location.search.split('username=')[1];
    // creates message object and send to handle submit method
    var room;
    $('#send').on('click', function() { app.message.text =  $("#chatMessage").val()
                                        app.message.username = myUsername;
                                          if (room) {
                                            app.message.roomname = room;
                                          } else {
                                            // defaults to lobby if no room name given
                                            app.message.roomname = 'lobby'
                                          }
                                        app.handleSubmit(app.message);
                                        })
    // add username to friends list
    $('#user').on('click', function() { app.addFriend($("#user").val() ) } );
    // add room name to #roomSelect div
    $('#addRoom').on('click', function() { app.addRoom(roomName) })
  },

  send: function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent: "' + message.text + '" by ' + message.username + " in room " + message.roomname + ".");
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    })
  },

  fetch: function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        // console.log('chatterbox: Message sent');
        console.log(data)

        app.container = data;
        for (var key in app.container.results) {
          app.addMessage(app.container.results[key], false)
        }
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    })
  },

  clearMessages: function() {
    $("#chats").children().remove();
  },

  addMessage: function(message, topOrBottom) {
    var textMessage = message.text;
    var userNameText = message.username;
    if (textMessage && userNameText) {
      if (textMessage.charAt(0).match(/^[0-9a-zA-Z]{1,16}$/)) {
        if (userNameText.charAt(0).match(/^[0-9a-zA-Z]{1,16}$/)) {
          // if (userNameText === '')
          //   $('#chats').topOrBottom("<div class='textbox'><a href=# id='user'>" + message.username + "</a>: " + message.text + "</div>");

          //$('#chats').topOrBottom("<div class='textbox'><a href=# id='user'>" + message.username + "</a>: " + message.text + "</div>");

          if (topOrBottom) {
            $('#chats').prepend("<div class='textbox'><a href=# id='user'>" + userNameText + "</a>: " + message.text + "</div>");
          } else {
            $('#chats').append("<div class='textbox'><a href=# id='user'>" + userNameText + "</a>: " + message.text + "</div>");
          }     
        }
      }
    }
  },

  addRoom: function(roomName) {
    $('#roomSelect').append("<div>" + roomName + "</div>")
  },

  addFriend: function(username) {
    console.log(username)
    console.log("test")
  },

  handleSubmit: function(message) {
    // sends message object to parse server
    app.send(message);
    // sends message object to addMessage method
    app.addMessage(message, true);
  }
}
