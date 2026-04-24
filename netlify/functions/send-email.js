exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { email, carbonScore, homeSize, electricity, miles } = body;
    
    if (!email || !carbonScore) {
      return { statusCode: 400, body: JSON.stringify({error: 'Missing fields'}) };
    }

    // Personalized tips
    let tips = '';
    if (carbonScore > 10) {
      tips = `
        <h3>🎯 Your Top 3 Actions (High Impact)</h3>
        <ol>
          <li><strong>Switch to Solar:</strong> Solar panels could cut 40% of your emissions. <a href="https://www.energysage.com/solar/carbon-offset/">Get a free estimate</a></li>
          <li><strong>Upgrade Insulation:</strong> Weatherstripping pays for itself in 6 months.</li>
          <li><strong>Reduce Driving:</strong> Switching one trip to transit saves 0.5 tonnes/year.</li>
        </ol>
      `;
    } else if (carbonScore > 5) {
      tips = `
        <h3>🎯 Your Top 3 Actions (Moderate Impact)</h3>
        <ol>
          <li><strong>LED + Smart Thermostat:</strong> Save $300/year and 1.2 tonnes CO2.</li>
          <li><strong>Shop Carbon-Neutral:</strong> <a href="https://earthhero.com/">Browse verified brands</a></li>
          <li><strong>Home Energy Audit:</strong> Most homes waste 30% of energy.</li>
        </ol>
      `;
    } else {
      tips = `
        <h3>🌟 You're Doing Great!</h3>
        <ol>
          <li><strong>Share Your Success:</strong> Most North Americans are at 16 tonnes!</li>
          <li><strong>Carbon Offsets:</strong> Consider verified offsets at $15-25/tonne.</li>
          <li><strong>Community Action:</strong> Join local sustainability groups.</li>
        </ol>
      `;
    }

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
          </div>

          <div style="background: white; padding: 25px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #065f46; margin-top: 0;">📊 How You Compare</h3>
            <p><strong>Your Score:</strong> ${carbonScore.toFixed(1)} tonnes</p>
            <p><strong>USA Average:</strong> 16.0 tonnes</p>
            <p><strong>Canada Average:</strong> 15.6 tonnes</p>
            <p><strong>Paris Target:</strong> 2.5 tonnes</p>
          </div>

          <div style="background: white; padding: 25px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            ${tips}
          </div>

          <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="margin-top: 0; color: #92400e;">☀️ Ready to Save Money?</h3>
            <p>Solar panels typically save $1,200/year. <a href="https://www.energysage.com/solar/carbon-offset/" style="color: #f59e0b; font-weight: bold;">Get Free Solar Quote</a></p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
            <p>EcoMetric Carbon Intelligence Platform</p>
            <p><a href="https://ecometric-carbon-calc.netlify.app" style="color: #059669;">Calculate Again</a></p>
          </div>
        </div>
      </div>
    `;

    // Use Resend REST API directly
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'EcoMetric <ecomcip@gmail.com>',
        to: email,
        subject: `Your Carbon Footprint Report: ${carbonScore.toFixed(1)} tonnes/year`,
        html: htmlContent
      })
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Resend error:', resendData);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: resendData.message || 'Email send failed' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, id: resendData.id })
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};