// functions/getMenu.js
const Airtable = require('airtable');
const BASE_ID = 'app7DRz7PW09pOYRL';
const TABLE_NAME = 'Imported';

exports.handler = async function(event, context) {
  console.log('Function `getMenu` invoked');
  
  if (!process.env.AIRTABLE_API_KEY) {
    console.error('AIRTABLE_API_KEY is missing');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error' })
    };
  }

  try {
    Airtable.configure({
      endpointUrl: 'https://api.airtable.com',
      apiKey: process.env.AIRTABLE_API_KEY
    });
    
    const base = Airtable.base(BASE_ID);
    console.log('Fetching records from Airtable');
    const records = await base(TABLE_NAME).select().all();
    console.log(`Fetched ${records.length} records`);

    const categories = {
      'Gustose': [],
      'Bianche': [],
      'Al Metro': []
    };

    records.forEach(record => {
      let category = record.get('Category');
      if (categories[category]) {
        categories[category].push({
          id: record.id,
          name: record.get('Name'),
          description: record.get('Description'),
          price: record.get('Price'),
          order: record.get('Order')
        });
      }
    });

    // Sort items in each category by order
    Object.keys(categories).forEach(category => {
      categories[category].sort((a, b) => (a.order || 0) - (b.order || 0));
    });

    console.log('Successfully processed records');
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTION",
      },
      body: JSON.stringify(categories)
    };
  } catch (err) {
    console.error('Error in getMenu:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data', details: err.message })
    };
  }
}