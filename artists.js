var process = require('process');
var request = require('request');
var cheerio = require('cheerio');
var nodemailer = require("nodemailer");
var jsonData = require('./credentials.json');

var Alist = new Array();
var Tlist = new Array();
var bodyPrep = new Array();
var body;


if (process.argv.length <= 2) {
  console.log("Please Enter Artist!");
  return;
} else {
  var args = process.argv.splice(2, process.argv.length - 1);
  request('https://www.popvortex.com/music/charts/top-rap-songs.php', function (error, response, html) {
    if (!error && response.statusCode == 200) {

      var $ = cheerio.load(html);

      args.forEach((el) => {

        $('p.title-artist').each(function (i, element) {
          var artist = $(this).children('em.artist').text();
          var song = $(this).children('cite.title').text();

          if (artist.includes(el)) {
            Alist.push(artist);
            Tlist.push(song);
            console.log(artist + " " + song);
          } else if (song.includes(el)) {
            Alist.push(artist);
            Tlist.push(song);
            console.log(artist + " " + song);
          }

          if (i == 25) {
            return false;
          }
        });
      });

      if (Alist.length != 0) {
        Alist.forEach((element, index) => {
          bodyPrep.push("<b>" + element + "</b>" + " " + "<i>" + Tlist[index] + "</i><br>");
        });

        body = bodyPrep.join('');

        async function main() {
          var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: jsonData.sender_email,
              pass: jsonData.sender_password,
            },
          });

          var subject = Alist.filter((element, index, array) => {
            return array.indexOf(element) === index;
          });

          var info = await transporter.sendMail({
            from: jsonData.from + "👻" + '<' + jsonData.sender_email + '>',
            to: jsonData.to,
            subject: "Your artist(s) are: " + subject,
            text: "Hello world?",
            html: body,
          });

          console.log("Message sent: %s", info.messageId);
        }
        main().catch(console.error);
      } else {
        console.log("Artist not found");
        return;
      }
    }
  });
}



