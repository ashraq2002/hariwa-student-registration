/**
 * Utility to dispatch verification email via EmailJS REST API
 */
export const sendEmailJSOTP = async ({ email, name = 'Student', otpCode, verificationLink }) => {
  const serviceId = process.env.VITE_EMAILJS_SERVICE_ID || process.env.EMAILJS_SERVICE_ID || 'service_5f20wwf';
  const templateId = process.env.VITE_EMAILJS_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID || 'template_5lu0tee';
  const publicKey = process.env.VITE_EMAILJS_PUBLIC_KEY || process.env.EMAILJS_PUBLIC_KEY || 'UYHugHXkmt8Uy6VkW';
  const privateKey = process.env.VITE_EMAILJS_PRIVATE_KEY || process.env.EMAILJS_PRIVATE_KEY || '';

  if (!serviceId || !templateId || !publicKey) {
    console.log(`[EmailJS] Service ID, Template ID or Public Key missing. Code for '${email}': ${otpCode}`);
    return { success: false, configured: false, error: 'EmailJS credentials incomplete' };
  }

  try {
    const bodyData = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        email: email,
        to_email: email,
        to_name: name,
        user_name: name,
        passcode: otpCode,
        otp_code: otpCode,
        verification_code: otpCode,
        verification_link: verificationLink || '',
        verify_url: verificationLink || '',
        time: '10 minutes',
        reply_to: email,
      },
    };

    if (privateKey) {
      bodyData.accessToken = privateKey;
    }

    console.log(`[EmailJS] Dispatching OTP '${otpCode}' to '${email}' using Service: ${serviceId}, Template: ${templateId}...`);

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(bodyData),
      signal: AbortSignal.timeout(8000),
    });

    const responseText = await response.text();

    if (response.ok) {
      console.log(`[EmailJS Success] Verification email dispatched to ${email}. Server response: ${responseText}`);
      return { success: true, configured: true, response: responseText };
    } else {
      console.error(`[EmailJS Error] HTTP ${response.status}: ${responseText}`);
      return { success: false, configured: true, error: `EmailJS Error (${response.status}): ${responseText}` };
    }
  } catch (err) {
    console.error(`[EmailJS Exception]`, err);
    return { success: false, configured: true, error: err.message };
  }
};

