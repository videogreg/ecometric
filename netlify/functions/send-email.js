exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const email = body.email;
    const carbonScore = body.carbonScore;

    if (!email || !carbonScore) {
      return { statusCode: 400, body: JSON.stringify({error: 'Missing fields'}) };
    }

    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: 'a9322d001@smtp-brevo.com',
        pass: process.env.BREVO_PASSWORD
      }
    });

    const subject = 'Your Carbon Footprint Report: ' + carbonScore + ' tonnes/year';
    
    const html = '<h1>EcoMetric Carbon Report</h1><p>Your score: ' + carbonScore + ' tonnes/year</p><p>Here are your top 10 actions to reduce emissions:</p><ol><li>Get a free solar estimate at EnergySage</li><li>Switch to a heat pump</li><li>Air seal your home</li><li>Switch to an EV or hybrid</li><li>Reduce beef consumption</li><li>Cut one flight per year</li><li>Switch to LED bulbs</li><li>Lower thermostat 2C at night</li><li>Buy secondhand before new</li><li>Join community solar</li></ol><p>Sources: EPA, NREL, EnergyStar, Project Drawdown</p>';

    await transporter.sendMail({
      from: '"EcoMetric" <ecomcip@gmail.com>',
      to: email,
      subject: subject,
      html: html
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};