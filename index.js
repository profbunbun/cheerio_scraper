const process = require('process');
var args = process.argv[2];
var request = require('request');
var cheerio = require('cheerio');
var nodemailer = require("nodemailer");
let jsonData = require('./credentials.json')
var Alist= new Array();
var Tlist= new Array();
var bodyPrep = new Array();
var body;


request('https://www.popvortex.com/music/charts/top-rap-songs.php' , function (error, response, html) {
	if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        
        $('p.title-artist').each(function(i, element) {
        	var artist = $(this).children('em.artist').text();
            var song = $(this).children('cite.title').text();

            if (artist.includes(args)){
               // $(this).toArray();
               
                Alist.push(artist);
                Tlist.push(song);
                console.log(artist+ " " + song);
                }
            if ( i == 26){
                return false;
            }

            
           
        });
        
     
     
     
     Alist.forEach((element,index) => {
            bodyPrep.push( "<b>"+element+"</b>"+" "+"<i>"+Tlist[index] +"</i><br>");
           }) ;
  
         body = bodyPrep.join('');  

// async..await is not allowed in global scope, must use a wrapper
async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,//587,
      secure: true, // true for 465, false for other ports
      auth: {
        user: jsonData.sender_email, // generated ethereal user
        pass: jsonData.sender_password, // generated ethereal password
      },
    });
 
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: jsonData.from + "👻" + '<'+jsonData.sender_email+'>', // sender address
      to: jsonData.to, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html:body, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }
  
  main().catch(console.error);



        
	}
    
});



