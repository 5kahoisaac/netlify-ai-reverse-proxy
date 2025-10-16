const routes = require('../../routes.json');

exports.handler = async (event, context) => {
  const { httpMethod, path, headers, body, queryStringParameters } = event;

  // Handle CORS preflight
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': '86400'
      }
    };
  }

  // Find matching route
  const route = routes.find(r => path.startsWith(r.route));
  if (!route) {
    return {
      statusCode: 404,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Route not found' })
    };
  }

  // Build target URL
  const targetPath = path.replace(route.route, '');
  const queryString = queryStringParameters 
    ? '?' + new URLSearchParams(queryStringParameters).toString()
    : '';
  const targetUrl = `${route.url}${targetPath}${queryString}`;

  // Forward request
  try {
    const response = await fetch(targetUrl, {
      method: httpMethod,
      headers: {
        ...headers,
        host: undefined,
        'x-forwarded-for': undefined,
        'x-forwarded-proto': undefined
      },
      body: httpMethod !== 'GET' ? body : undefined
    });

    const responseBody = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': response.headers.get('content-type') || 'application/json'
      },
      body: responseBody
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Proxy error', message: error.message })
    };
  }
};
