require("dotenv").config();
var express = require("express");
var logger = require("morgan");
var app = express();
var fs = require("fs");
var Twit = require("twit");
const server = require("http").Server(app);
var io = require("socket.io")(server);

// Load in config data stuff and pass to app locals
var config = require("./config");
app.locals = config;

// Set the view engine to ejs
app.set("view engine", "ejs");

// Set up logging
if (app.get("env") === "production") {
  app.use(logger("combined"));
} else {
  app.use(logger("dev"));
}
console.log(`### Node environment mode is '${app.get("env")}'`);

// Serve static content
app.use("/public", express.static("public"));

// Routing to controllers
var route_path = "./routes/";
fs.readdirSync(route_path).forEach(function(file) {
  console.log(`### Loading routes from ${route_path}${file}`);
  var route = require(route_path + file);
  app.use("/", route);
});

let activeUsers = [];

io.on("connection", function(socket) {
  T.get(
    "search/tweets",
    { q: "#covid19", count: 100, result_type: "top", lang: "en" },
    function(err, data, response) {
      var tweetArray = [];
      for (let index = 0; index < data.statuses.length; index++) {
        const tweet = data.statuses[index];
        let tweetID = tweet.id_str;
        //tried to get metric info... could not...
        // T.get('labs/1/tweets/metrics/private?ids='+tweetID, function(err, stuff, res){
        //   // for(let i = 0; i < stuff.)
        //   console.log(stuff)
        // })
        var tweetbody = {
          text: tweet.text,
          userActualName: tweet.user.name,
          userScreenName: "@" + tweet.user.screen_name,
          userImage: tweet.user.profile_image_url_https,
          userDescription: tweet.user.description
        };
        try {
          if (tweet.entities.media[0].media_url_https) {
            tweetbody["image"] = tweet.entities.media[0].media_url_https;
          }
        } catch (err) {}
        tweetArray.push(tweetbody);
      }
      io.emit("allTweet", tweetArray);
    }
  );

  var stream = T.stream("statuses/filter", {
    track: "#covid19",
    language: "en"
  });

  stream.on("tweet", function(tweet) {
    io.emit("tweet", { tweet: tweet });
  });

  //socketio code
  socket.on('username', function(username) {
    socket.username = username;
    activeUsers.push(socket.username)
    console.log(activeUsers)
    io.emit('is_online', socket.username);
    io.emit('update_users', activeUsers);
  });

  socket.on('disconnect', function(username) {
    const index = activeUsers.indexOf(socket.username);
    if (index > -1) {
      activeUsers.splice(index, 1);
      console.log(activeUsers)
      io.emit('is_offline', socket.username);
      io.emit('update_users', activeUsers);
    }
  })

  socket.on('chat_message', function(message) {
      io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
  });
  


});

var T = new Twit({
  consumer_key: "Asg3z5Up73BeQXwCknYNe0SuI",
  consumer_secret: "kFB9LgaQGQk7ymZO2mzAAqyC9EVsgoakI0LpPB9hqXDFrcV6wb",
  access_token: "1649159186-51DkopG4F72h7b2nU46QbFsfZjRoBxjRzUeDgTN",
  access_token_secret: "5M7PhJTjlm9M6nmEtfSYvWXHyH9v29JK0EiN0mqQmuAZV",
  timeout_ms: 60 * 1000 // optional HTTP request timeout to apply to all requests.
});

// Start the server, wow!
var port = process.env.PORT || 3000;
// app.listen(port);
const listener = server.listen(port, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

// console.log(`### Server listening on port ${port}`);
