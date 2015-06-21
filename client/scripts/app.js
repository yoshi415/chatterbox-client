var app = {

  server: 'https://api.parse.com/1/classes/chatterbox',
  
  message: {}, 
  rooms: {},

  init: function() {
    // retrieves data object filled of messages
    app.fetch(); 
    // grab username from URL
    var myUsername = location.search.split('username=')[1];
    // creates message object and send to handle submit method
    var room;
    $('#newRoom').on('click', function() { app.addRoom($("#roomText").val()) } );
    $('#send').on('click', function() { app.message.text =  $("#chatMessage").val();
                                        app.message.username = myUsername;
                                          if (room) {
                                            app.message.roomname = room;
                                          } else {
                                            // defaults to lobby if no room name given
                                            app.message.roomname = 'lobby';
                                          }
                                        app.handleSubmit(app.message);
                                        });
    // add username to friends list
    $('body').delegate('#user', 'click', function() { app.addFriend($(this).text() )});

    $('#roomSelect').change(function() { app.clearMessages();
                                         // display messages with specific roomname
                                       })
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
        console.log(data)
        for (var key in data.results) {
          app.addMessage(data.results[key], false)
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
    // slice time out of parse object and format to PST
    if (!message.createdAt) {
      message.createdAt = String(new Date());
    }
    var hours = message.createdAt.slice(11, 13) - 7;
    var ampm = "AM";
    if (hours > 11) {
      hours -= 12;
      ampm = "PM"
    }
    var minutes = message.createdAt.slice(14, 16);
    var time = hours + ":" + minutes + " " + ampm;
    
    // test for falsy values
    if (textMessage && userNameText) {
      // only allow letters or numbers in text or username
      if (textMessage.charAt(0).match(/^[0-9a-zA-Z]{1,16}$/)) {
        if (userNameText.charAt(0).match(/^[0-9a-zA-Z]{1,16}$/)) {
          // false if called from fetch
          // true if called from addMessage directly
          if (topOrBottom) {
            $('#chats').prepend("<div class='textbox " + userNameText + "'><a href='#' id='user'>" + userNameText + "</a>: " + message.text + "</br> sent at: " + time + "</div>");
          } else {
            $('#chats').append("<div class='textbox " + userNameText + "'><a href='#' id='user'>" + userNameText + "</a>: " + message.text +  "</br> sent at: " + time + "</div>");
          }
          app.rooms[message.roomname] = message.roomname;
          
          $('#roomSelect').html('');
          for (var key in app.rooms) {
            $('#roomSelect').append("<option value=" + app.rooms[key] + ">" + app.rooms[key] + "</option>")                 
          }
        }
      }
    }
  },

  addRoom: function(roomName) {
    $('#roomSelect').append("<option value=" + roomName + ">" + roomName + "</option>")
  },

  addFriend: function(username) {
    // add username to friends list
    $("." + username).addClass("friends");
    $('#friendsList').append("<li>" + username + "</li>")
  },

  handleSubmit: function(message) {
    // sends message object to parse server
    app.send(message);
    // sends message object to addMessage method
    app.addMessage(message, true);
  }
}
