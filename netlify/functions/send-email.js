exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { email, carbonScore, homeSize, electricity, miles, vehicleType, flights, diet, shopping, heatingType, occupants } = body;
    
    if (!email || !carbonScore) {
      return { statusCode: 400, body: JSON.stringify({error: 'Missing fields'}) };
    }

    // Determine user profile for personalization
    const isHighEmitter = carbonScore > 12;
    const isLowEmitter = carbonScore < 8;
    const hasGasHeat = heatingType === 'gas' || heatingType === 'oil';
    const drivesALot = (miles || 0) > 300;
    const fliesOften = (flights || 0) > 3;
    const heavyMeat = diet === 'heavymeat';
    const highShopper = shopping === 'high';
    const largeHome = (homeSize || 0) > 2000;
    const highElectricity = (electricity || 0) > 900;

    // Build Top 10 personalized actions
    const actions = [];

    // 1. SOLAR (Highest impact for most)
    actions.push({
      icon: '☀️',
      title: 'Get a Free Solar Estimate',
      desc: `Solar panels typically save $1,200/year and cut ${(carbonScore * 0.35).toFixed(1)} tonnes from your ${carbonScore.toFixed(1)} tonne footprint. Most systems pay for themselves in 6-8 years.`,
      link: 'https://www.energysage.com/solar/carbon-offset/',
      cta: 'Get Free Quote',
      impact: 'HIGH'
    });

    // 2. HEATING (if gas/oil)
    if (hasGasHeat) {
      actions.push({
        icon: '🔥',
        title: 'Switch to a Cold-Climate Heat Pump',
        desc: `Your ${heatingType === 'oil' ? 'heating oil' : 'natural gas'} system produces ~${(carbonScore * 0.25).toFixed(1)} tonnes/year. A heat pump cuts this by 70% and qualifies for up to $10,000 in Canadian rebates / 30% US tax credit.`,
        link: 'https://www.energysage.com/heat-pumps/',
        cta: 'Compare Heat Pumps',
        impact: 'HIGH'
      });
    } else {
      actions.push({
        icon: '🏠',
        title: 'Weatherstrip & Insulate Your Home',
        desc: `Your ${homeSize || 1500} sq ft home likely leaks 30% of heated air. A $50 weatherstripping kit saves $200/year and cuts 0.8 tonnes CO2.`,
        link: 'https://www.energysage.com/energy-efficiency/',
        cta: 'Learn More',
        impact: 'HIGH'
      });
    }

    // 3. TRANSPORTATION
    if (drivesALot) {
      actions.push({
        icon: '🚗',
        title: 'Switch to an Electric or Hybrid Vehicle',
        desc: `You drive ${miles || 250} miles/week (${((miles || 250) * 52).toLocaleString()}/year). An EV would cut your transport emissions by 75% and save $1,500/year in gas.`,
        link: 'https://www.energysage.com/evs/',
        cta: 'Explore EVs',
        impact: 'HIGH'
      });
    } else {
      actions.push({
        icon: '🚌',
        title: 'Replace One Drive Per Week with Transit/Bike',
        desc: `Even at ${miles || 250} miles/week, replacing just 20 miles with transit saves 0.5 tonnes/year and $150 in gas.`,
        link: 'https://www.energysage.com/energy-efficiency/',
        cta: 'See How',
        impact: 'MEDIUM'
      });
    }

    // 4. FLIGHTS
    if (fliesOften) {
      actions.push({
        icon: '✈️',
        title: 'Cut One Round-Trip Flight This Year',
        desc: `You take ${flights || 2} flights/year. Skipping just one cross-country round trip saves 1.5 tonnes CO2 — equivalent to driving 3,700 miles.`,
        link: 'https://www.energysage.com/energy-efficiency/',
        cta: 'Alternatives',
        impact: 'HIGH'
      });
    } else {
      actions.push({
        icon: '✈️',
        title: 'Buy Carbon Offsets for Future Flights',
        desc: `At ${flights || 2} flights/year, verified offsets cost ~$15-25/tonne. Neutralize your flight emissions for $30-50/year.`,
        link: 'https://www.energysage.com/energy-efficiency/',
        cta: 'Learn Offsets',
        impact: 'LOW'
      });
    }

    // 5. DIET
    if (heavyMeat) {
      actions.push({
        icon: '🥩',
        title: 'Adopt "Meatless Mondays" (Then Expand)',
        desc: `Your heavy meat diet produces ~3.3 tonnes/year. Cutting meat 2 days/week drops this to 2.5 tonnes — saving 0.8 tonnes and $800/year on groceries.`,
        link: 'https://earthhero.com/',
        cta: 'Shop Plant-Based',
        impact: 'HIGH'
      });
    } else if (diet === 'moderate') {
      actions.push({
        icon: '🥗',
        title: 'Reduce Beef to Once Per Week',
        desc: `Beef creates 10x more emissions than chicken. Swapping one beef meal for chicken or beans saves 0.4 tonnes/year.`,
        link: 'https://earthhero.com/',
        cta: 'Find Alternatives',
        impact: 'MEDIUM'
      });
    } else {
      actions.push({
        icon: '🌱',
        title: 'Share Your Plant-Based Success',
        desc: `Your ${diet || 'plant-based'} diet is already saving 1-2 tonnes vs average. Tell friends — diet change is the #1 personal action for emissions.`,
        link: 'https://earthhero.com/',
        cta: 'Spread the Word',
        impact: 'MEDIUM'
      });
    }

    // 6. ELECTRICITY
    if (highElectricity) {
      actions.push({
        icon: '💡',
        title: 'Switch to LED Bulbs + Smart Power Strips',
        desc: `At ${electricity || 800} kWh/month, LEDs cut lighting costs by 75%. Smart strips kill "phantom load" from devices — combined savings: $250/year.`,
        link: 'https://earthhero.com/',
        cta: 'Shop Efficient',
        impact: 'MEDIUM'
      });
    } else {
      actions.push({
        icon: '🌙',
        title: 'Use Time-of-Use Pricing (If Available)',
        desc: `Your ${electricity || 800} kWh/month could cost 40% less if you shift laundry/dishwashing to off-peak hours. Check your utility's TOU plan.`,
        link: 'https://earthhero.com/',
        cta: 'Learn More',
        impact: 'MEDIUM'
      });
    }

    // 7. HOME SIZE / OCCUPANTS
    if (largeHome) {
      actions.push({
        icon: '📐',
        title: 'Downsize Unused Space or Rent a Room',
        desc: `Your ${homeSize || 1500} sq ft home costs more to heat/cool than you use. Renting a basement room splits emissions per person and generates income.`,
        link: 'https://www.energysage.com/energy-efficiency/',
        cta: 'Efficiency Tips',
        impact: 'MEDIUM'
      });
    } else {
      actions.push({
        icon: '🌡️',
        title: 'Lower Thermostat 2°C at Night',
        desc: `A programmable thermostat costs $30 and saves 5% on heating. For a typical home, that's 0.3 tonnes and $120/year.`,
        link: 'https://earthhero.com/',
        cta: 'Shop Thermostats',
        impact: 'MEDIUM'
      });
    }

    // 8. SHOPPING
    if (highShopper) {
      actions.push({
        icon: '🛒',
        title: 'Implement a "30-Day Purchase Rule"',
        desc: `Wait 30 days before non-essential purchases. This cuts impulse buying by 50%, saving $2,000/year and 1.5 tonnes of manufacturing/shipping emissions.`,
        link: 'https://earthhero.com/',
        cta: 'Shop Mindfully',
        impact: 'HIGH'
      });
    } else {
      actions.push({
        icon: '♻️',
        title: 'Buy Secondhand Before New',
        desc: `Platforms like Facebook Marketplace and ThredUp cut the emissions of new manufacturing by 80%. One secondhand sofa = 0.2 tonnes saved.`,
        link: 'https://earthhero.com/',
        cta: 'Browse Used',
        impact: 'LOW'
      });
    }

    // 9. WATER HEATING (universal)
    actions.push({
      icon: '🚿',
      title: 'Lower Water Heater to 120°F + Low-Flow Showerheads',
      desc: `Water heating is 18% of home energy. 120°F is safe and saves 0.2 tonnes/year. Low-flow heads cut hot water use by 40%.`,
      link: 'https://earthhero.com/',
      cta: 'Shop Low-Flow',
      impact: 'MEDIUM'
    });

    // 10. COMMUNITY / OFFSETS (universal)
    actions.push({
      icon: '🌍',
      title: 'Subscribe to a Community Solar Garden',
      desc: `No roof? No problem. Community solar lets you buy clean energy credits at 10-15% below utility rates. Available in 22 US states and growing in Canada.`,
      link: 'https://www.energysage.com/community-solar/',
      cta: 'Find Local Projects',
      impact: 'HIGH'
    });

    // Sort by impact
    const impactOrder = { 'HIGH': 0, 'MEDIUM': 1, 'LOW': 2 };
    actions.sort((a, b) => impactOrder[a.impact] - impactOrder[b.impact]);

    // Build HTML for Top 10
    let actionsHtml = '';
    actions.forEach((action, index) => {
      actionsHtml += `
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid ${action.impact === 'HIGH' ? '#059669' : action.impact === 'MEDIUM' ? '#f59e0b' : '#6b7280'};">
          <div style="display: flex; align-items: start; gap: 12px;">
            <div style="font-size: 24px; flex-shrink: 0;">${action.icon}</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span style="font-weight: bold; color: #065f46; font-size: 16px;">${index + 1}. ${action.title}</span>
                <span style="font-size: 11px; padding: 2px 8px; border-radius: 10px; background: ${action.impact === 'HIGH' ? '#d1fae5' : action.impact === 'MEDIUM' ? '#fef3c7' : '#f3f4f6'}; color: ${action.impact === 'HIGH' ? '#065f46' : action.impact === 'MEDIUM' ? '#92400e' : '#374151'};">${action.impact} IMPACT</span>
              </div>
              <p style="color: #4b5563; font-size: 14px; line-height: 1.5; margin: 0 0 10px 0;">${action.desc}</p>
              <a href="${action.link}" style="display: inline-block; background: ${action.impact === 'HIGH' ? '#059669' : '#6b7280'}; color: white; padding: 8px 16px; text-decoration: none; border-radius: 5px; font-size: 13px; font-weight: 600;">${action.cta} →</a>
            </div>
          </div>
        </div>
      `;
    });

    // Summary stats
    const highCount = actions.filter(a => a.impact === 'HIGH').length;
    const potentialSavings = (carbonScore * 0.45).toFixed(1);

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #333;">
        <div style="background: linear-gradient(135deg, #065f46 0%, #047857 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">EcoMetric</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your Personalized Carbon Action Plan</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #065f46; margin-top: 0;">Hi there! 👋</h2>
          <p>Thanks for calculating your footprint. You scored <strong style="color: #059669; font-size: 18px;">${carbonScore.toFixed(2)} tonnes/year</strong>.</p>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #065f46; margin-top: 0;">📊 Quick Comparison</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px;">Your Score</td>
                <td style="padding: 8px; text-align: right; font-weight: bold; color: #059669;">${carbonScore.toFixed(1)} tonnes</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px;">USA Average</td>
                <td style="padding: 8px; text-align: right;">16.0 tonnes</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px;">Canada Average</td>
                <td style="padding: 8px; text-align: right;">15.6 tonnes</td>
              </tr>
              <tr>
                <td style="padding: 8px;">Paris Target</td>
                <td style="padding: 8px; text-align: right; color: #3b82f6;">2.5 tonnes</td>
              </tr>
            </table>
          </div>

          <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
            <p style="margin: 0; color: #065f46; font-size: 15px;">
              <strong>💡 Good news:</strong> If you implement just the <strong>${highCount} HIGH-impact actions</strong> below, you could cut your footprint by ~<strong>${potentialSavings} tonnes</strong> and save <strong>$1,500-3,000/year</strong>.
            </p>
          </div>

          <h2 style="color: #065f46; margin-bottom: 20px;">🎯 Your Top 10 Personalized Actions</h2>
          <p style="color: #6b7280; font-size: 13px; margin-bottom: 20px;">Sorted by impact. Start with any HIGH impact item — they pay for themselves fastest.</p>
          
          ${actionsHtml}

          <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin-top: 30px; border-left: 4px solid #f59e0b;">
            <h3 style="margin-top: 0; color: #92400e;">☀️ Ready to Start?</h3>
            <p style="margin-bottom: 15px;">The #1 rule: <strong>don't try to do everything.</strong> Pick 2-3 actions from above and commit for 30 days. Then add more.</p>
            <a href="https://www.energysage.com/solar/carbon-offset/" style="display: inline-block; background: #f59e0b; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Get Free Solar Quote →</a>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
            <p>EcoMetric Carbon Intelligence Platform</p>
            <p><a href="https://ecometric-carbon-calc.netlify.app" style="color: #059669;">Calculate Again</a> | <a href="https://ecometric-carbon-calc.netlify.app/blog" style="color: #059669;">Read Our Blog</a></p>
            <p style="margin-top: 10px;">You're receiving this because you used our carbon calculator.</p>
          </div>
        </div>
      </div>
    `;

    // Use Brevo SMTP
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

    await transporter.sendMail({
      from: '"EcoMetric" <ecomcip@gmail.com>',
      to: email,
      subject: `🎯 Your Top 10 Carbon Actions (Score: ${carbonScore.toFixed(1)} tonnes)`,
      html: htmlContent
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