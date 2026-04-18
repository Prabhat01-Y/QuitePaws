const nodemailer = require('nodemailer');

const sendEmail = async ({ email, subject, message }) => {
  try {
    // Dynamically generate a test account if no real SMTP is provided in .env
    // This allows the feature to work instantly without needing a Gmail App Password right now.
    let transporter;
    let etherealAccount;

    if (process.env.SMTP_HOST) {
      // Use real SMTP if user configured it in backend/.env
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Sandbox Mode: Use Ethereal fake email service
      etherealAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, 
        auth: {
          user: etherealAccount.user, // generated ethereal user
          pass: etherealAccount.pass, // generated ethereal password
        },
      });
      console.log('✉️  [Nodemailer] Running in Sandbox Mode (Ethereal)');
    }

    // Build the email envelope
    const mailOptions = {
      from: 'QuietPaws Adoption Team <adoptions@quietpaws.org>',
      to: email,
      subject: subject,
      html: message, // Allow HTML formatting
    };

    const info = await transporter.sendMail(mailOptions);
    
    // In Sandbox mode, we print the URL so the developer can actually "read" the simulated email
    if (!process.env.SMTP_HOST) {
      console.log('✅  [Nodemailer] Simulated Email Sent Successfully!');
      console.log('🔗  Preview URL: ' + nodemailer.getTestMessageUrl(info));
    } else {
      console.log(`✅  [Nodemailer] Real Email Sent to ${email}`);
    }

  } catch (error) {
    console.error('❌  [Nodemailer] Error sending email: ', error);
  }
};

module.exports = sendEmail;
