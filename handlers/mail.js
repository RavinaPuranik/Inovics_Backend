const nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'inovicsapp@gmail.com',
    pass: 'Inovics_App'
  }
});

exports.send = (options,res) => {

  var mailOptions = {
      from: 'Inovics Application <inovicsapp@gmail.com>',
      to: options.email,
      subject: options.subject,
      text: options.text,
      html: options.html
  };

  const send = transport.sendMail(mailOptions, (error,info) => {
    if(error){
      console.log(error);
       res.json({error:true,message:'SOmething went wrong with the mail'})
    }
  });

};
