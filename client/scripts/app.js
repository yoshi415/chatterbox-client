var app = {

  // message: {
  //   "username": username,
  //   "text": text,
  //   roomname: roomname
  // },
  server: 'https://api.parse.com/1/classes/chatterbox',
  
  message: {}, 

  init: function() {
    app.fetch(); // retrieves data object filled of messages
    $('#send').on('click', function() { app.handleSubmit($("#chatMessage").val()) });
    app.message.username 
    $('#user').on('click', function() { app.addFriend() } );
  },

  send: function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    })
  },

  // displayMessages: function(messages) {
  //   for (var key in messages) {
  //     app.addMessages(messages[key].text);
  //   }
  // },

  fetch: function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        // console.log('chatterbox: Message sent');
        app.container = data;
        for (var key in app.container.results) {
          app.addMessage(app.container.results[key])
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

  addMessage: function(message) {
    var textMessage = message.text;
    var userNameText = message.username;
    if (textMessage && userNameText) {
      if (textMessage.charAt(0).match(/^[0-9a-zA-Z]{1,16}$/)) {
        if (userNameText.charAt(0).match(/^[0-9a-zA-Z]{1,16}$/)) {
          $('#chats').append("<div class='textbox'><a href=# id='user'>" + message.username + "</a>: " + message.text + "</div>");
        }
      }
    }
  },

  addRoom: function(roomName) {
    $('#roomSelect').append("<div>" + roomName + "</div>")
  },

  addFriend: function(username) {
    
  },

  handleSubmit: function(message) {

    app.send(message);
    console.log("message is ", message)
    app.addMessage(message);
  }
}
