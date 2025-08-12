import nodemailer from 'nodemailer';

// This is our email transporter setup.
// It's the "machine" that logs into our email account and sends messages.
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER, // The email address from our .env file
        pass: process.env.EMAIL_PASS  // The App Password from our .env file
    },
    // This part is the fix for the certificate error.
    // It tells nodemailer to ignore certificate validation during development.
    tls: {
        rejectUnauthorized: false
    }
});

// This is a reusable function to send an email.
// We'll call this from our controller.
const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER, // The sender's email
            to: to,                      // The recipient's email
            subject: subject,            // The subject line of the email
            text: text                   // The body of the email
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export default sendEmail;