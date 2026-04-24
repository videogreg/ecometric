import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const { email, carbonScore, homeSize, electricity, miles } = JSON.parse(event.body || '{}');

  if (!email || !carbonScore) {
    return { statusCode: 400, body: 'Missing required fields' };
  }

  // Create Gmail transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ecomcip@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  // Personalized tips based on score
  let tips = '';
  if (carbonScore > 10) {
    tips = `
      <h3>🎯 Your Top 3 Actions (High Impact)</h3>
      <ol>
        <li><strong>Switch to Solar:</strong> With your ${carbonScore.toFixed(1)} tonne footprint, solar panels could cut 40% of your emissions. <a href="https://www.energysage.com/solar/carbon-offset/">Get a free estimate</a></li>
        <li><strong>Upgrade Insulation:</strong> Your home size suggests significant heating/cooling losses. Weatherstripping pays for itself in 6 months.</li>
        <li><strong>Reduce Driving:</strong> At ${miles || 'your current'} miles/week, switching one trip to transit saves 0.5 tonnes/year.</li>
      </ol>
    `;
  } else if (carbonScore > 5) {
    tips = `
      <h3>🎯 Your Top 3 Actions (Moderate Impact)</h3>
      <ol>
        <li><strong>LED + Smart Thermostat:</strong> Simple upgrades save $300/year and 1.2 tonnes CO2.</li>
        <li><strong>Shop Carbon-Neutral:</strong> Replace 3 household products with sustainable alternatives. <a href="https://earthhero.com/">Browse verified brands</a></li>
        <li><strong>Home Energy Audit:</strong> Most homes waste 30% of energy. A free audit reveals your biggest opportunities.</li>
      </ol>
    `;
  } else {
    tips = `
      <h3>🌟 You're Doing Great! Keep It Up</h3>
      <ol>
        <li><strong>Share Your Success:</strong> Tell friends how you achieved ${carbonScore.toFixed(1)} tonnes. Most North Americans are at 16 tonnes!</li>
        <li><strong>Carbon Offsets:</strong> For remaining emissions, consider verified offsets at $15-25/tonne.</li>
        <li><strong>Community Action:</strong> Join local sustainability groups to amplify your impact.</li>
      </ol>
    `;
  }

  // Email HTML template
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: linear-gradient(135deg, #065f46 0%, #047857 100%); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px;">EcoMetric</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Your Personalized Carbon Report</p>
      </div>
      
      <div style="padding: 30px; background: #f9fafb;">
        <h2 style="color: #065f46; margin-top: 0;">Hi there! 👋</h2>
        <p>Thanks for using EcoMetric. Here's your personalized carbon footprint analysis:</p>
        
        <div style="background: white; padding: 25px; border-radius: 10px; margin: 20px 0; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="font-size: 48px; font-weight: bold; color: #059669;">${carbonScore.toFixed(2)}</div>
          <div style="color: #6b7280; font-size: 14px;">tonnes CO2 / year</div>
          <div style="margin-top: 15px; padding: 10px; background: #ecfdf5; border-radius: 5px; font-size: 14px; color: #065f46;">
            ${carbonScore > 16 ? '⚠️ Above North American average (16 tonnes)' : 
              carbonScore > 10 ? '⚠️ Moderate - room for improvement' : 
              carbonScore > 5 ? '✅ Below average - good work!' : 
              '🌟 Excellent! Top 10% performer'}
          </div>
        </div>

        <div style="background: white; padding: 25px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="color: #065f46; margin-top: 0;">📊 How You Compare</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px;">Your Score</td>
              <td style="padding: 10px; text-align: right; font-weight: bold; color: #059669;">${carbonScore.toFixed(1)} tonnes</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px;">USA Average</td>
              <td style="padding: 10px; text-align: right;">16.0 tonnes</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px;">Canada Average</td>
              <td style="padding: 10px; text-align: right;">15.6 tonnes</td>
            </tr>
            <tr>
              <td style="padding: 10px;">Paris Agreement Target</td>
              <td style="padding: 10px; text-align: right; color: #3b82f6;">2.5 tonnes</td>
            </tr>
          </table>
        </div>

        <div style="background: white; padding: 25px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          ${tips}
        </div>

        <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="margin-top: 0; color: #92400e;">☀️ Ready to Save Money?</h3>
          <p style="margin-bottom: 15px;">Solar panels typically save $1,200/year and cut 8+ tonnes of CO2. Get your free estimate:</p>
          <a href="https://www.energysage.com/solar/carbon-offset/" style="display: inline-block; background: #f59e0b; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Get Free Solar Quote</a>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
          <p>EcoMetric Carbon Intelligence Platform</p>
          <p><a href="https://ecometric-carbon-calc.netlify.app" style="color: #059669;">Calculate Again</a> | <a href="https://ecometric-carbon-calc.netlify.app/blog" style="color: #059669;">Read Our Blog</a></p>
          <p style="margin-top: 10px;">You're receiving this because you used our carbon calculator.</p>
        </div>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: '"EcoMetric" <ecomcip@gmail.com>',
      to: email,
      subject: `Your Carbon Footprint Report: ${carbonScore.toFixed(1)} tonnes/year`,
      html: htmlContent
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Email sent' })
    };
  } catch (error) {
    console.error('Email error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email' })
    };
  }
};