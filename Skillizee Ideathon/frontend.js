
async function sendOTP() {
    const email = document.getElementById('patientEmail').value;

    if (!email.includes('@') || !email.includes('.')) {
        alert('Please enter a valid email address!');
        return;
    }

    try {
        const response = await fetch('/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });

        const result = await response.json();
        console.log('Server response:', result);

        if (result.success) {
            localStorage.setItem('patientEmail', email);
            alert('OTP sent! Check your email.');
            window.location.href = 'otp.html';
        } else {
            alert('Server error: ' + result.message);
        }
    } catch (error) {
        console.log('Network error:', error);
        alert('Network error: ' + error.message);
    }
}

async function verifyOTP() {
    const email = localStorage.getItem('patientEmail');
    const otp = document.getElementById('otpInput').value;

    if (!otp || otp.length !== 6) {
        alert('Please enter a 6-digit OTP');
        return;
    }

    try {
        const response = await fetch('/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, otp: otp })
        });

        const result = await response.json();

        if (result.success) {
            alert('OTP Verified! Going to profiles...');
            window.location.href = 'profiles.html';
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('Error verifying OTP');
    }
}

async function resendOTP() {
    const email = localStorage.getItem('patientEmail');

    try {
        const response = await fetch('/resend-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });

        const result = await response.json();

        if (result.success) {
            alert('New OTP sent! Check your email.');
        } else {
            alert('Failed to resend OTP');
        }
    } catch (error) {
        alert('Error resending OTP');
    }

}
