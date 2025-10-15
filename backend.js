
const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Important for Railway deployment
app.use(express.json());
app.use(express.static('public'));

let otpStore = {};

sgMail.setApiKey('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');

// Send OTP
app.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);

    try {
        console.log('Trying to send email...');
        console.log('To:', email);

        await sgMail.send({
    to: email,
    from: 'dakshtulsiani1711@gmail.com',
    subject: 'Medical Records Access',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333; text-align: center;">Medical Records Access</h2>
            <p style="font-size: 16px; color: #666;">Your OTP is:</p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 48px; font-weight: bold; color: #007bff; background: #f8f9fa; padding: 20px 30px; border-radius: 10px; letter-spacing: 8px;">${otp}</span>
            </div>
            <p style="color: #666; font-size: 14px;">This code expires in 10 minutes.</p>
            <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
    `
});
        otpStore[email] = {
            otp: otp,
            expires: Date.now() + 10 * 60 * 1000
        };

        console.log('✅ Email sent successfully!');
        res.json({ success: true });

    } catch (error) {
        console.log('❌ Email error:', error.message);
        console.log('Error code:', error.code);
        res.json({ success: false, message: error.message });
    }
});

// Resend OTP (same as send-otp)
app.post('/resend-otp', async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);

    try {
        console.log('Resending OTP to:', email);

        await sgMail.send({
    to: email,
    from: 'dakshtulsiani1711@gmail.com',
    subject: 'Medical Records Access (Resent OTP)',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333; text-align: center;">Medical Records Access</h2>
            <p style="font-size: 16px; color: #666;">Your Resent OTP is:</p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 48px; font-weight: bold; color: #007bff; background: #f8f9fa; padding: 20px 30px; border-radius: 10px; letter-spacing: 8px;">${otp}</span>
            </div>
            <p style="color: #666; font-size: 14px;">This code expires in 10 minutes.</p>
            <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
    `
});
        otpStore[email] = {
            otp: otp,
            expires: Date.now() + 10 * 60 * 1000
        };

        console.log('✅ OTP resent successfully!');
        res.json({ success: true });

    } catch (error) {
        console.log('❌ Resend error:', error.message);
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
    
    // Send different profiles based on email
    if (email === 'dakshtulsiani1711@gmail.com') {
        res.json({ 
            success: true, 
            profiles: ['Harish Kumar Tulsiani', 'Nisha Prithiani', 'Dhruv Tulsiani', 'Daksh Tulsiani']
        });
    } else {
        // Extract username from email (everything before @)
        const username = email.split('@')[0];
        res.json({ 
            success: true, 
            profiles: [username] // Just the username as profile
        });
    }
}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server running on port', PORT);
});


