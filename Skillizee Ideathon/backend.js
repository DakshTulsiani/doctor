const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());
app.use(express.static('public'));

let otpStore = {};

const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: 'dakshtulsiani1711@gmail.com',
        pass: 'yvdv dqvf vzui hoqj'
    }
});

// Send actual OTP
app.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);

    try {
        console.log('Trying to send email...');
        console.log('From:', transporter.options.auth.user);
        console.log('To:', email);

        await transporter.sendMail({
            from: transporter.options.auth.user,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP is: ${otp}`
        });

        otpStore[email] = {
            otp: otp,
            expires: Date.now() + 5 * 60 * 1000
        };

        console.log('✅ Email sent successfully!');
        res.json({ success: true });

    } catch (error) {
        console.log('❌ Email error:', error.message);
        console.log('Error code:', error.code);
        res.json({ success: false, message: error.message });
    }
});

// Verify OTP
app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    // Check if OTP exists for this email
    if (!otpStore[email]) {
        return res.json({ success: false, message: 'No OTP found for this email' });
    }

    const storedData = otpStore[email];

    // Check if OTP has expired
    if (Date.now() > storedData.expires) {
        delete otpStore[email];
        return res.json({ success: false, message: 'OTP has expired' });
    }

    // Check if OTP matches
    if (storedData.otp.toString() === otp.toString()) {
        delete otpStore[email]; // Clear used OTP
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Invalid OTP' });
    }
});

// Start server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});