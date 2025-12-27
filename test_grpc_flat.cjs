const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const https = require('https');
const crypto = require('crypto');
const path = require('path');

const GIGACHAT_KEY = process.env.GIGACHAT_KEY || "ZDY2ODkxYjUtZDBkNi00MTM4LWJjZDUtMzBkODc2N2NlNjk5OmM0YjkxZjNlLTM2YTYtNGEwNS1iODk5LWQyNGY1ODUxOGU1Yg==";
const GIGACHAT_SCOPE = process.env.GIGACHAT_SCOPE || "GIGACHAT_API_PERS";

async function httpsRequest(url, options) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { ...options, rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function run() {
  try {
    const authRes = await httpsRequest('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${GIGACHAT_KEY}`,
        'RqUID': crypto.randomUUID(),
      },
      body: `scope=${encodeURIComponent(GIGACHAT_SCOPE)}`
    });
    const token = JSON.parse(authRes.data).access_token;

    const packageDefinition = protoLoader.loadSync(path.join(__dirname, 'yandex-cloud-function', 'gigachat.proto'), {
      keepCase: true, longs: String, enums: String, defaults: true, oneofs: true
    });
    const proto = grpc.loadPackageDefinition(packageDefinition);
    const client = new proto.gigachat.v1.ChatService('gigachat.devices.sberbank.ru:443', grpc.credentials.createSsl());

    const metadata = new grpc.Metadata();
    metadata.add('authorization', `Bearer ${token}`);

    const request = {
      model: 'GigaChat',
      messages: [{ role: 'user', content: 'Привет! Ответь одним словом.' }],
      temperature: 0.1,
      max_tokens: 10
    };

    console.log("Sending gRPC request with flat params...");
    client.chat(request, metadata, (err, response) => {
      if (err) {
        console.error("gRPC Error:", err.message);
      } else {
        console.log("gRPC Success:", response.alternatives[0].message.content);
      }
      process.exit(0);
    });
  } catch (e) {
    console.error("Test Error:", e.message);
    process.exit(1);
  }
}
run();
