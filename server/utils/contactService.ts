const emailjs = require('@emailjs/nodejs');

interface ContactData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

// Initialize EmailJS with public and private keys
emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY || '',
  privateKey: process.env.EMAILJS_PRIVATE_KEY || '',
});

// Send contact form email to admin
export const sendContactEmail = async (contactData: ContactData): Promise<void> => {
  console.log('=== EmailJS Configuration Check ===');
  console.log('EMAILJS_SERVICE_ID:', process.env.EMAILJS_SERVICE_ID || 'NOT SET');
  console.log('EMAILJS_TEMPLATE_ID:', process.env.EMAILJS_TEMPLATE_ID || 'NOT SET');
  console.log('EMAILJS_PUBLIC_KEY:', process.env.EMAILJS_PUBLIC_KEY ? 'SET' : 'NOT SET');
  console.log('EMAILJS_PRIVATE_KEY:', process.env.EMAILJS_PRIVATE_KEY ? 'SET' : 'NOT SET');
  console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'NOT SET');

  if (!process.env.EMAILJS_SERVICE_ID) {
    throw new Error('EMAILJS_SERVICE_ID is not configured in environment variables. Please add it to your .env file.');
  }
  if (!process.env.EMAILJS_TEMPLATE_ID) {
    throw new Error('EMAILJS_TEMPLATE_ID is not configured in environment variables. Please add it to your .env file.');
  }
  if (!process.env.EMAILJS_PUBLIC_KEY) {
    throw new Error('EMAILJS_PUBLIC_KEY is not configured in environment variables. Please add it to your .env file.');
  }
  if (!process.env.EMAILJS_PRIVATE_KEY) {
    throw new Error('EMAILJS_PRIVATE_KEY is not configured in environment variables. Please add it to your .env file.');
  }

  try {
    const templateParams = {
      to_email: process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'info@educonsult.pro',
      from_name: contactData.name,
      from_email: contactData.email,
      phone: contactData.phone,
      subject: contactData.subject,
      message: contactData.message,
    };

    console.log('=== Sending Contact Email ===');
    console.log('Template Params:', templateParams);
    
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      templateParams
    );
    
    console.log('✓ Contact email sent successfully');
    console.log('Status:', response.status);
    console.log('Text:', response.text);
  } catch (error: any) {
    console.error('✗ Error sending contact email:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    // Provide helpful error message
    if (error.text && error.text.includes('User ID')) {
      throw new Error('EmailJS configuration error: Please check your EMAILJS_PUBLIC_KEY in .env file');
    } else if (error.text && error.text.includes('Service')) {
      throw new Error('EmailJS configuration error: Please check your EMAILJS_SERVICE_ID in .env file');
    } else if (error.text && error.text.includes('Template')) {
      throw new Error('EmailJS configuration error: Please check your EMAILJS_TEMPLATE_ID in .env file');
    } else if (error.text && error.text.includes('Private Key')) {
      throw new Error('EmailJS configuration error: Please check your EMAILJS_PRIVATE_KEY in .env file');
    } else {
      throw new Error(`Failed to send email: ${error.message || error.text || 'Unknown error'}`);
    }
  }
};
