const https = require('https');
const crypto = require('crypto');

const GIGACHAT_KEY = "ZDY2ODkxYjUtZDBkNi00MTM4LWJjZDUtMzBkODc2N2NlNjk5OmM0YjkxZjNlLTM2YTYtNGEwNS1iODk5LWQyNGY1ODUxOGU1Yg==";
const GIGACHAT_SCOPE = "GIGACHAT_API_PERS";

async function httpsRequest(url, options) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function test() {
  console.log("1. Requesting Token...");
  try {
    const authRes = await httpsRequest('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Basic ${GIGACHAT_KEY}`,
        'RqUID': crypto.randomUUID(),
      },
      body: `scope=${encodeURIComponent(GIGACHAT_SCOPE)}`
    });

    console.log("Status:", authRes.statusCode);
    const authData = JSON.parse(authRes.data);
    const token = authData.access_token;

    if (!token) {
      console.error("No token received:", authRes.data);
      return;
    }

    console.log("2. Sending Chat Request...");
    const chatRes = await httpsRequest('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        model: 'GigaChat',
        messages: [{ role: 'user', content: 'Привет! Расскажи о себе кратко.' }],
        temperature: 0.7
      })
    });

    console.log("Chat Status:", chatRes.statusCode);
    console.log("Response:", chatRes.data);
  } catch (e) {
    console.error("Error:", e.message);
  }
}

test();
