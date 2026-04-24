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

    // Build email with simple concatenation only
    let html = '';
    
    // Header
    html += '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">';
    html += '<div style="background:linear-gradient(135deg,#065f46 0%,#047857 100%);padding:30px;text-align:center;color:white;">';
    html += '<h1 style="margin:0;font-size:28px;">EcoMetric</h1>';
    html += '<p style="margin:10px 0 0 0;opacity:0.9;">Your 10-Point Carbon Reduction Plan</p>';
    html += '</div>';
    
    // Body
    html += '<div style="padding:30px;background:#f9fafb;">';
    html += '<h2 style="color:#065f46;margin-top:0;">Hi there!</h2>';
    html += '<p>Your carbon footprint: <strong style="color:#059669;font-size:18px;">' + carbonScore.toFixed(2) + ' tonnes/year</strong></p>';
    
    // Comparison box
    html += '<div style="background:white;padding:20px;border-radius:10px;margin:20px 0;box-shadow:0 2px 4px rgba(0,0,0,0.1);">';
    html += '<h3 style="color:#065f46;margin-top:0;">How You Compare</h3>';
    html += '<table style="width:100%;border-collapse:collapse;font-size:14px;">';
    html += '<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px;">Your Score</td><td style="padding:8px;text-align:right;font-weight:bold;color:#059669;">' + carbonScore.toFixed(1) + ' tonnes</td></tr>';
    html += '<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px;">USA Average</td><td style="padding:8px;text-align:right;">16.0 tonnes</td></tr>';
    html += '<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px;">Canada Average</td><td style="padding:8px;text-align:right;">15.6 tonnes</td></tr>';
    html += '<tr><td style="padding:8px;">Paris Target</td><td style="padding:8px;text-align:right;color:#3b82f6;">2.5 tonnes</td></tr>';
    html += '</table>';
    html += '</div>';
    
    // Tip box
    html += '<div style="background:#ecfdf5;border:1px solid #a7f3d0;padding:15px;border-radius:8px;margin-bottom:25px;">';
    html += '<p style="margin:0;color:#065f46;font-size:15px;"><strong>Good news:</strong> Implementing 3-4 high-impact actions could cut your footprint by ~' + (carbonScore * 0.4).toFixed(1) + ' tonnes and save $1,000-2,500/year.</p>';
    html += '</div>';
    
    // Actions header
    html += '<h2 style="color:#065f46;margin-bottom:20px;">Your Top 10 Actions</h2>';
    html += '<p style="color:#6b7280;font-size:13px;margin-bottom:20px;">Every action links to real government or scientific sources.</p>';
    
    // Action 1
    html += actionCard('1', '&#9729;', 'Get a Free Solar Estimate', 'Solar cuts 3-8 tonnes/year. NREL data shows 20-year savings of $10,000-$30,000 after incentives.', '3-8 tonnes/year', 'National Renewable Energy Laboratory', 'https://www.nrel.gov/solar/solar-basics.html', 'https://www.energysage.com/solar/carbon-offset/', 'Get Free Quote');
    
    // Action 2
    html += actionCard('2', '&#128293;', 'Switch to a Heat Pump', '3x more efficient than gas furnaces. EPA estimates 4-tonne annual reduction. US: 30% tax credit. Canada: up to $10,000 grant.', '2-5 tonnes/year', 'U.S. EPA + Natural Resources Canada', 'https://www.energystar.gov/products/heating_cooling/heat_pumps', null, null);
    
    // Action 3
    html += actionCard('3', '&#127968;', 'Air Seal and Insulate', 'EPA states air leaks waste 25-40% of heating/cooling. Sealing pays back in 2-5 years and cuts 0.5-1.5 tonnes/year.', '0.5-1.5 tonnes/year', 'U.S. EPA EnergyStar', 'https://www.energystar.gov/campaign/seal_insulate', null, null);
    
    // Action 4
    html += actionCard('4', '&#128663;', 'Switch to an Electric Vehicle', 'DOE data: EVs produce 60-68% fewer emissions than gas cars. Saves 2-4 tonnes annually for average drivers.', '2-4 tonnes/year', 'U.S. Department of Energy', 'https://afdc.energy.gov/vehicles/electric_emissions.php', null, null);
    
    // Action 5
    html += actionCard('5', '&#129385;', 'Reduce Beef Consumption', 'Beef produces 60 kg CO2 per kg — 10x chicken, 50x beans. Oxford study: halving meat cuts food emissions 35%.', '0.8-1.5 tonnes/year', 'University of Oxford', 'https://ourworldindata.org/environmental-impacts-of-food', null, null);
    
    // Action 6
    html += actionCard('6', '&#9992;', 'Cut One Flight This Year', 'One cross-country round trip emits ~0.8 tonnes CO2. ICAO calculator confirms. Take train for trips under 500 miles.', '0.8 tonnes/flight', 'ICAO', 'https://www.icao.int/environmental-protection/Carbonoffset/Pages/default.aspx', null, null);
    
    // Action 7
    html += actionCard('7', '&#128161;', 'Switch to LED Bulbs', 'LEDs use 75% less energy. EnergyStar estimates $225/year savings. Phantom load from devices = 10% of home energy.', '0.3-0.6 tonnes/year', 'EnergyStar.gov', 'https://www.energystar.gov/products/lighting_fans/light_bulbs', null, null);
    
    // Action 8
    html += actionCard('8', '&#127777;', 'Lower Thermostat at Night', 'Programmable thermostats cost $30-100. EPA: every 1C reduction saves 5% on heating. 2C nightly drop = 0.3 tonnes + $120/year.', '0.3 tonnes/year', 'U.S. EPA', 'https://www.energystar.gov/products/heating_cooling/programmable_thermostats', null, null);
    
    // Action 9
    html += actionCard('9', '&#9851;', 'Buy Secondhand Before New', 'Manufacturing one laptop = 200 kg CO2. One sofa = 100 kg. Secondhand cuts this to near zero.', '0.5-2 tonnes/year', 'Ellen MacArthur Foundation', 'https://ellenmacarthurfoundation.org/topics/circular-economy-introduction/overview', null, null);
    
    // Action 10
    html += actionCard('10', '&#127758;', 'Join Community Solar', 'No roof? No problem. Subscribe to local solar farms. NREL: subscribers save 10-15% on bills with zero installation.', '1-3 tonnes/year', 'NREL Community Solar Research', 'https://www.nrel.gov/solar/community-solar.html', null, null);
    
    // CTA box
    html += '<div style="background:#fef3c7;padding:20px;border-radius:10px;margin-top:30px;border-left:4px solid #f59e0b;">';
    html += '<h3 style="margin-top:0;color:#92400e;">Ready to Start?</h3>';
    html += '<p style="margin-bottom:15px;">Pick <strong>2 actions</strong> from above. Commit for 30 days. Then add more.</p>';
    html += '<a href="https://www.energysage.com/solar/carbon-offset/" style="display:inline-block;background:#f59e0b;color:white;padding:12px 25px;text-decoration:none;border-radius:5px;font-weight:bold;">Get Free Solar Quote</a>';
    html += '</div>';
    
    // Footer
    html += '<div style="text-align:center;margin-top:30px;padding-top:20px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;">';
    html += '<p>EcoMetric Carbon Intelligence Platform</p>';
    html += '<p>Sources: EPA, NREL, EnergyStar, Project Drawdown, Oxford University</p>';
    html += '<p><a href="https://ecometric-carbon-calc.netlify.app" style="color:#059669;">Calculate Again</a></p>';
    html += '</div>';
    
    html += '</div>';
    html += '</div>';

    await transporter.sendMail({
      from: '"EcoMetric" <ecomcip@gmail.com>',
      to: email,
      subject: 'Your 10-Point Carbon Plan (Score: ' + carbonScore.toFixed(1) + ' tonnes)',
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

// Helper function to build each action card safely
function actionCard(num, icon, title, desc, savings, source, learnLink, affiliateLink, affiliateCta) {
  let card = '';
  card += '<div style="background:white;padding:20px;border-radius:8px;margin-bottom:15px;border-left:4px solid #059669;">';
  card += '<div style="display:flex;align-items:start;gap:12px;">';
  card += '<div style="font-size:24px;flex-shrink:0;">' + icon + '</div>';
  card += '<div style="flex:1;">';
  card += '<div style="font-weight:bold;color:#065f46;font-size:16px;margin-bottom:4px;">' + num + '. ' + title + '</div>';
  card += '<p style="color:#4b5563;font-size:14px;line-height:1.5;margin:0 0 8px 0;">' + desc + '</p>';
  card += '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">';
  card += '<span style="font-size:12px;color:#059669;font-weight:600;">&#128168; ' + savings + '</span>';
  card += '<span style="font-size:11px;color:#6b7280;">Source: ' + source + '</span>';
  card += '</div>';
  card += '<div style="margin-top:10px;">';
  card += '<a href="' + learnLink + '" style="display:inline-block;color:#059669;text-decoration:underline;font-size:13px;font-weight:600;margin-right:15px;">Learn More &#8594;</a>';
  
  if (affiliateLink) {
    card += '<a href="' + affiliateLink + '" style="display:inline-block;background:#f59e0b;color:white;padding:6px 14px;text-decoration:none;border-radius:4px;font-size:12px;font-weight:600;">' + affiliateCta + ' &#8594;</a>';
  }
  
  card += '</div>';
  card += '</div>';
  card += '</div>';
  card += '</div>';
  return card;
}