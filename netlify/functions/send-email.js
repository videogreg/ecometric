const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  console.log('=== FUNCTION STARTED ===');
  console.log('HTTP Method:', event.httpMethod);
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    console.log('Request body:', JSON.stringify(body));
    
    const { email, carbonScore } = body;
    
    if (!email || !carbonScore) {
      console.log('Missing fields - email:', email, 'carbonScore:', carbonScore);
      return { statusCode: 400, body: JSON.stringify({error: 'Missing fields'}) };
    }

    console.log('GMAIL_APP_PASSWORD exists:', !!process.env.GMAIL_APP_PASSWORD);
    console.log('GMAIL_APP_PASSWORD length:', process.env.GMAIL_APP_PASSWORD ? process.env.GMAIL_APP_PASSWORD.length : 0);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ecomcip@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    console.log('Attempting to send email to:', email);
    
    const result = await transporter.sendMail({
      from: '"EcoMetric" <ecomcip@gmail.com>',
      to: email,
      subject: `Carbon Report: ${carbonScore} tonnes/year`,
      text: `Your carbon footprint is ${carbonScore} tonnes/year.`
    });

    console.log('Email sent! Message ID:', result.messageId);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, messageId: result.messageId })
    };
    
  } catch (error) {
    console.error('=== FUNCTION ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', JSON.stringify(error));
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message,
        code: error.code,
        name: error.name
      })
    };
  }
};