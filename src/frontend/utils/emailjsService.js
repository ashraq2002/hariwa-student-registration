import emailjs from '@emailjs/browser';

/**
 * EmailJS Configuration Constants
 * 
 * Reads from Vite environment variables (VITE_EMAILJS_*)
 * with fallback placeholders for development/testing.
 */
export const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_5f20wwf';
export const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_5lu0tee';
export const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'UYHugHXkmt8Uy6VkW';

/**
 * Sends a 6-digit password reset OTP email using @emailjs/browser.
 *
 * Expected EmailJS Template Variables:
 *  - {{to_email}}: Destination email address (e.g. user@gmail.com)
 *  - {{otp_code}}: The 6-digit random numeric verification code
 *  - {{user_name}}: The user's full name or email display handle
 * 
 * Additional fallback aliases included for compatibility:
 *  - {{email}}, {{passcode}}, {{verification_code}}
 *
 * @param {Object} options
 * @param {string} options.to_email - Recipient's email address
 * @param {string|number} options.otp_code - 6-digit OTP code
 * @param {string} [options.user_name] - Optional recipient name
 * @returns {Promise<import('@emailjs/browser').EmailJSResponseStatus>}
 */
export const sendPasswordResetEmail = async ({ to_email, otp_code, user_name }) => {
  const trimmedEmail = to_email ? to_email.trim() : '';
  const cleanName = user_name || (trimmedEmail ? trimmedEmail.split('@')[0] : 'User');

  const templateParams = {
    to_email: trimmedEmail,
    otp_code: String(otp_code),
    user_name: cleanName,
    // Complementary aliases to match various EmailJS template parameter naming conventions:
    email: trimmedEmail,
    passcode: String(otp_code),
    verification_code: String(otp_code),
    time: '60s',
  };

  const emailPromise = emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    templateParams,
    EMAILJS_PUBLIC_KEY
  );

  // Safety timeout of 6 seconds so user is never stuck hanging if EmailJS service is slow
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('EmailJS dispatch timed out (6s)')), 6000);
  });

  return await Promise.race([emailPromise, timeoutPromise]);
};
