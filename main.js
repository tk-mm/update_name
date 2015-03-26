var Twit = require('twit');

var T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

T.get('account/verify_credentials', function(err, data) {
  var screen_name = data.screen_name;
  var stream = T.stream('user');
  stream.on('tweet', function(tweet){
    var reg = new RegExp("^(.+?)\\(@" + screen_name + "\\)$");
    var m = tweet.text.match(reg);
    if (m) {
      var newName = m[1];
      var replyId = tweet.id_str;
      // プロフィールの変更
      T.post('account/update_profile', {name: newName}, function () {});
      // 変更をリプライ
      replyText = "@" + tweet.user.screen_name + ' ' + newName + 'に改名しました';
      T.post('statuses/update', { status: replyText, "in_reply_to_status_id": replyId }, function() {});
    }
  });
});

