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

    const hasGasHeat = heatingType === 'gas' || heatingType === 'oil';
    const drivesALot = (miles || 0) > 300;
    const fliesOften = (flights || 0) > 3;
    const heavyMeat = diet === 'heavymeat';
    const highShopper = shopping === 'high';
    const largeHome = (homeSize || 0) > 2000;
    const highElectricity = (electricity || 0) > 900;

    // REAL actions with ACTUAL sources (EPA, NREL, Drawdown, Gov Canada)
    const actions = [];

    // 1. SOLAR
    actions.push({
      icon: '☀️',
      title: 'Get a Free Solar Estimate',
      desc: `Rooftop solar cuts grid emissions by 3-8 tonnes/year for typical homes. NREL data shows 20-year savings of $10,000-$30,000 after incentives.`,
      source: 'National Renewable Energy Laboratory (NREL)',
      link: 'https://www.nrel.gov/solar/solar-basics.html',
      affiliate: 'https://www.energysage.com/solar/carbon-offset/',
      affiliateCta: 'Get Free Solar Quote',
      savings: '3-8 tonnes/year'
    });

    // 2. HEATING
    if (hasGasHeat) {
      actions.push({
        icon: '🔥',
        title: 'Switch to a Cold-Climate Heat Pump',
        desc: `Heat pumps are 3x more efficient than gas furnaces. EPA estimates a 4-tonne annual reduction. US: 30% federal tax credit. Canada: up to $10,000 Greener Homes grant.`,
        source: 'U.S. EPA + Natural Resources Canada',
        link: 'https://www.energystar.gov/products/heating_cooling/heat_pumps',
        affiliate: null,
        affiliateCta: null,
        savings: '2-5 tonnes/year'
      });
    } else {
      actions.push({
        icon: '🏠',
        title: 'Air Seal and Insulate Your Home',
        desc: `EPA states air leaks waste 25-40% of heating/cooling energy. Sealing + attic insulation pays back in 2-5 years and cuts 0.5-1.5 tonnes/year.`,
        source: 'U.S. EPA EnergyStar',
        link: 'https://www.energystar.gov/campaign/seal_insulate',
        affiliate: null,
        affiliateCta: null,
        savings: '0.5-1.5 tonnes/year'
      });
    }

    // 3. TRANSPORTATION
    if (drivesALot) {
      actions.push({
        icon: '🚗',
        title: 'Switch to an Electric or Hybrid Vehicle',
        desc: `DOE data: EVs produce 60-68% fewer emissions than gas cars over lifetime. At ${((miles || 250) * 52).toLocaleString()} miles/year, an EV saves 2-4 tonnes annually.`,
        source: 'U.S. Department of Energy',
        link: 'https://afdc.energy.gov/vehicles/electric_emissions.php',
        affiliate: null,
        affiliateCta: null,
        savings: '2-4 tonnes/year'
      });
    } else {
      actions.push({
        icon: '🚌',
        title: 'Replace One Weekly Drive with Transit/Bike/Walk',
        desc: `A 20-mile round trip by bus instead of car saves ~5 kg CO2 per trip. Over a year: 0.3 tonnes saved + $150 in gas money.`,
        source: 'EPA GHG Equivalencies Calculator',
        link: 'https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator',
        affiliate: null,
        affiliateCta: null,
        savings: '0.3 tonnes/year'
      });
    }

    // 4. FLIGHTS
    if (fliesOften) {
      actions.push({
        icon: '✈️',
        title: 'Cut One Round-Trip Flight This Year',
        desc: `A single cross-country round trip (e.g., NYC-LA) emits ~0.8 tonnes CO2 per passenger. ICAO calculator confirms this. Take the train for trips under 500 miles.`,
        source: 'ICAO Carbon Emissions Calculator',
        link: 'https://www.icao.int/environmental-protection/Carbonoffset/Pages/default.aspx',
        affiliate: null,
        affiliateCta: null,
        savings: '0.8 tonnes/flight'
      });
    } else {
      actions.push({
        icon: '📹',
        title: 'Replace One Business Trip with Video Conference',
        desc: `A 2-hour video call produces ~0.002 kg CO2. Flying to that same meeting produces 200-500 kg. Remote work policies cut corporate emissions 40%.`,
        source: 'Carbon Trust / IPCC',
        link: 'https://www.carbontrust.com/our-work-and-impact/guides-reports-and-tools',
        affiliate: null,
        affiliateCta: null,
        savings: '0.2-0.5 tonnes/trip'
      });
    }

    // 5. DIET
    if (heavyMeat) {
      actions.push({
        icon: '🥩',
        title: 'Reduce Beef to Once Per Week',
        desc: `Beef produces 60 kg CO2 per kg of meat — 10x chicken, 50x beans. Oxford University study: halving meat cuts food emissions 35%.`,
        source: 'University of Oxford / Poore & Nemecek (2018)',
        link: 'https://ourworldindata.org/environmental-impacts-of-food',
        affiliate: null,
        affiliateCta: null,
        savings: '0.8-1.5 tonnes/year'
      });
    } else if (diet === 'moderate') {
      actions.push({
        icon: '🥗',
        title: 'Adopt "Meatless Mondays"',
        desc: `Skipping meat one day/week for a year saves 0.15 tonnes CO2 and $200+ in grocery costs. Johns Hopkins Center confirms health + climate benefits.`,
        source: 'Johns Hopkins Center for a Livable Future',
        link: 'https://www.mondaycampaigns.org/meatless-monday',
        affiliate: null,
        affiliateCta: null,
        savings: '0.15 tonnes/year'
      });
    } else {
      actions.push({
        icon: '🌱',
        title: 'Share Your Plant-Based Success',
        desc: `Your diet already saves 1-2 tonnes vs. average. Project Drawdown ranks plant-rich diets as the #4 most effective climate solution globally.`,
        source: 'Project Drawdown',
        link: 'https://drawdown.org/solutions/plant-rich-diets',
        affiliate: null,
        affiliateCta: null,
        savings: 'Already saving 1-2 tonnes'
      });
    }

    // 6. ELECTRICITY
    if (highElectricity) {
      actions.push({
        icon: '💡',
        title: 'Switch to LED Bulbs + Smart Power Strips',
        desc: `LEDs use 75% less energy than incandescent. EnergyStar estimates $225/year savings per household. Phantom load from devices = 10% of home energy.`,
        source: 'EnergyStar.gov',
        link: 'https://www.energystar.gov/products/lighting_fans/light_bulbs',
        affiliate: null,
        affiliateCta: null,
        savings: '0.3-0.6 tonnes/year'
      });
    } else {
      actions.push({
        icon: '🌙',
        title: 'Shift Usage to Off-Peak Hours',
        desc: `Many utilities charge 40-60% less at night. Running dishwasher/laundry after 9 PM reduces your bill and eases grid strain (which lowers carbon intensity).`,
        source: 'U.S. DOE Office of Electricity',
        link: 'https://www.energy.gov/oe/grid-modernization-initiative',
        affiliate: null,
        affiliateCta: null,
        savings: '$100-300/year'
      });
    }

    // 7. HOME SIZE
    if (largeHome) {
      actions.push({
        icon: '📐',
        title: 'Close Off and Don't Heat Unused Rooms',
        desc: `Heating 3,500 sq ft when you use 1,500 wastes enormous energy. Close vents in guest rooms. Better: downsize or rent unused space.`,
        source: 'Natural Resources Canada',
        link: 'https://www.nrcan.gc.ca/energy-efficiency/energy-star-canada/about/20523',
        affiliate: null,
        affiliateCta: null,
        savings: '0.5-1.2 tonnes/year'
      });
    } else {
      actions.push({
        icon: '🌡️',
        title: 'Lower Thermostat 2°C at Night',
        desc: `Programmable thermostats cost $30-100. EPA: every 1°C reduction saves 5% on heating. A 2°C nightly drop = 0.3 tonnes + $120/year.`,
        source: 'U.S. EPA',
        link: 'https://www.energystar.gov/products/heating_cooling/programmable_thermostats',
        affiliate: null,
        affiliateCta: null,
        savings: '0.3 tonnes/year'
      });
    }

    // 8. SHOPPING
    if (highShopper) {
      actions.push({
        icon: '🛒',
        title: 'Buy Secondhand Before New',
        desc: `Manufacturing one new laptop = 200 kg CO2. One sofa = 100 kg. Facebook Marketplace, Kijiji (Canada), and thrift stores cut this to near zero.`,
        source: 'Ellen MacArthur Foundation',
        link: 'https://ellenmacarthurfoundation.org/topics/circular-economy-introduction/overview',
        affiliate: null,
        affiliateCta: null,
        savings: '0.5-2 tonnes/year'
      });
    } else {
      actions.push({
        icon: '♻️',
        title: 'Repair Instead of Replace',
        desc: `Right to Repair laws are expanding. iFixit shows how to fix appliances, electronics, and clothing. Extending product life 2x cuts manufacturing emissions 50%.`,
        source: 'iFixit / Repair Association',
        link: 'https://www.ifixit.com/',
        affiliate: null,
        affiliateCta: null,
        savings: '0.2-0.8 tonnes/year'
      });
    }

    // 9. WATER (universal)
    actions.push({
      icon: '🚿',
      title: 'Install Low-Flow Showerheads (5-Minute Showers)',
      desc: `Heating water = 18% of home energy. Low-flow heads cut hot water use 40%. A family of 4 saves 0.2 tonnes + $100/year in water heating.`,
      source: 'U.S. DOE + WaterSense',
      link: 'https://www.epa.gov/watersense',
      affiliate: null,
      affiliateCta: null,
      savings: '0.2 tonnes/year'
    });

    // 10. COMMUNITY SOLAR (universal)
    actions.push({
      icon: '🌍',
      title: 'Join a Community Solar Garden',
      desc: `No roof? No problem. Community solar lets you subscribe to local solar farms. NREL: subscribers save 10-15% on bills with zero installation.`,
      source: 'NREL Community Solar Research',
      link: 'https://www.nrel.gov/solar/community-solar.html',
      affiliate: null,
      affiliateCta: null,
      savings: '1-3 tonnes/year'
    });

    // Build HTML
    let actionsHtml = '';
    actions.forEach((action, index) => {
      actionsHtml += `
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #059669;">
          <div style="display: flex; align-items: start; gap: 12px;">
            <div style="font-size: 24px; flex-shrink: 0;">${action.icon}</div>
            <div style="flex: 1;">
              <div style="font-weight: bold; color: #065f46; font-size: 16px; margin-bottom: 4px;">${index + 1}. ${action.title}</div>
              <p style="color: #4b5563; font-size: 14px; line-height: 1.5; margin: 0 0 8px 0;">${action.desc}</p>
              <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                <span style="font-size: 12px; color: #059669; font-weight: 600;">💨 ${action.savings}</span>
                <span style="font-size: 11px; color: #6b7280;">Source: ${action.source}</span>
              </div>
              <div style="margin-top: 10px;">
                <a href="${action.link}" style="display: inline-block; color: #059669; text-decoration: underline; font-size: 13px; font-weight: 600; margin-right: 15px;">Learn More →</a>
                ${action.affiliate ? `<a href="${action.affiliate}" style="display: inline-block; background: #f59e0b; color: white; padding: 6px 14px; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: 600;">${action.affiliateCta} →</a>` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    });

    const potentialSavings = (carbonScore * 0.45).toFixed(1);

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #333;">
        <div style="background: linear-gradient(135deg, #065f46 0%, #047857 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">EcoMetric</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your 10-Point Carbon Reduction Plan</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #065f46; margin-top: 0;">Hi there! 👋</h2>
          <p>Your carbon footprint: <strong style="color: #059669; font-size: 18px;">${carbonScore.toFixed(2)} tonnes/year</strong></p>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #065f46; margin-top: 0;">📊 How You Compare</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr style="border-bottom: 1px solid #e5e7eb;"><td style="padding: 8px;">Your Score</td><td style="padding: 8px; text-align: right; font-weight: bold; color: #059669;">${carbonScore.toFixed(1)} tonnes</td></tr>
              <tr style="border-bottom: 1px solid #e5e7eb;"><td style="padding: 8px;">USA Average</td><td style="padding: 8px; text-align: right;">16.0 tonnes</td></tr>
              <tr style="border-bottom: 1px solid #e5e7eb;"><td style="padding: 8px;">Canada Average</td><td style="padding: 8px; text-align: right;">15.6 tonnes</td></tr>
              <tr><td style="padding: 8px;">Paris Target</td><td style="padding: 8px; text-align: right; color: #3b82f6;">2.5 tonnes</td></tr>
            </table>
          </div>

          <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
            <p style="margin: 0; color: #065f46; font-size: 15px;">
              <strong>💡 The truth:</strong> You don't need to do all 10. Implementing just <strong>3-4 of the highest-impact actions</strong> below could cut your footprint by ~<strong>${potentialSavings} tonnes</strong> and save <strong>$1,000-2,500/year</strong>.
            </p>
          </div>

          <h2 style="color: #065f46; margin-bottom: 20px;">🎯 Your 10 Personalized Actions</h2>
          <p style="color: #6b7280; font-size: 13px; margin-bottom: 20px;">Every action links to real government or scientific sources. Only one includes an affiliate link (solar estimate) — because it directly matches the recommendation.</p>
          
          ${actionsHtml}

          <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin-top: 30px; border-left: 4px solid #f59e0b;">
            <h3 style="margin-top: 0; color: #92400e;">☀️ Ready to Start?</h3>
            <p style="margin-bottom: 15px;">Pick <strong>2 actions</strong> from above. Commit for 30 days. Then add more. Small consistent changes beat perfect plans.</p>
            <a href="https://www.energysage.com/solar/carbon-offset/" style="display: inline-block; background: #f59e0b; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Get Free Solar Quote →</a>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
            <p>EcoMetric Carbon Intelligence Platform</p>
            <p>Sources: EPA, NREL, EnergyStar, Project Drawdown, Oxford University, IPCC</p>
            <p><a href="https://ecometric-carbon-calc.netlify.app" style="color: #059669;">Calculate Again</a></p>
          </div>
        </div>
      </div>
    `;

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
      subject: `Your 10-Point Carbon Plan (Score: ${carbonScore.toFixed(1)} tonnes)`,
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