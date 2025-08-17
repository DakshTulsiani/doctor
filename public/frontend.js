// Function to show styled messages instead of alerts
function showMessage(text, type = 'info') {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
    }
}

// Function to hide messages
function hideMessage() {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.style.display = 'none';
    }
}

async function sendOTP() {
    const email = document.getElementById('patientEmail').value;

    if (!email.includes('@') || !email.includes('.')) {
        showMessage('Please enter a valid email address!', 'error');
        return;
    }

    showMessage('Sending OTP... Please wait...', 'loading');

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
            showMessage('OTP sent! Check your email. Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'otp.html';
            }, 2000); // Redirect after 2 seconds
        } else {
            showMessage('Error: ' + result.message, 'error');
        }
    } catch (error) {
        console.log('Network error:', error);
        showMessage('Network error: ' + error.message, 'error');
    }
}

async function verifyOTP() {
    const email = localStorage.getItem('patientEmail');
    const otp = document.getElementById('otpInput').value;

    if (!otp || otp.length !== 6) {
        showMessage('Please enter a 6-digit OTP', 'error');
        return;
    }

    showMessage('Verifying OTP...', 'loading');

    try {
        const response = await fetch('/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, otp: otp })
        });

        const result = await response.json();

        if (result.success) {
    localStorage.setItem('availableProfiles', JSON.stringify(result.profiles));
    showMessage('OTP Verified! Going to profiles...', 'success');
    setTimeout(() => {
        window.location.href = 'profiles.html';
    }, 1500);
} else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        showMessage('Error verifying OTP', 'error');
    }
}

async function resendOTP() {
    const email = localStorage.getItem('patientEmail');

    if (!email) {
        showMessage('No email found. Please go back and enter email again.', 'error');
        return;
    }

    showMessage('Resending OTP...', 'loading');

    try {
        const response = await fetch('/resend-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });

        const result = await response.json();

        if (result.success) {
            showMessage('New OTP sent! Check your email.', 'success');
        } else {
            showMessage('Failed to resend OTP: ' + result.message, 'error');
        }
    } catch (error) {
        showMessage('Error resending OTP', 'error');
    }
}