/**
 * Yandex Cloud Function для WebStudio
 * 
 * Версия с YDB Serverless (бесплатно!)
 * 
 * Переменные окружения:
 * - YDB_ENDPOINT - endpoint YDB (например: grpcs://ydb.serverless.yandexcloud.net:2135)
 * - YDB_DATABASE - путь к базе (например: /ru-central1/b1gxxxxxx/etnxxxxxx)
 * - ROBOKASSA_MERCHANT_LOGIN - логин магазина в Robokassa
 * - ROBOKASSA_PASSWORD1 - пароль #1 для формирования подписи
 * - ROBOKASSA_PASSWORD2 - пароль #2 для проверки подписи
 * - ROBOKASSA_TEST_MODE - "true" для тестового режима
 * - TELEGRAM_BOT_TOKEN - токен бота Telegram
 * - TELEGRAM_CHAT_ID - ID чата для уведомлений о заказах
 * - TELEGRAM_AUTO_POST_CHAT_ID - ID чата для автопостов (опционально, используется TELEGRAM_CHAT_ID если не указано)
 * - SITE_URL - URL сайта для редиректов
 * - SMTP_EMAIL - email для отправки писем (Яндекс)
 * - SMTP_PASSWORD - пароль приложения Яндекс
 * - ADMIN_EMAIL - email администратора для входа в админ-панель
 * - ADMIN_PASSWORD - пароль администратора для входа в админ-панель
 * - YC_API_KEY - API ключ для Yandex Cloud AI
 * - YC_FOLDER_ID - Folder ID в Yandex Cloud
 * 
 * Банковские реквизиты (для оплаты по счёту):
 * - BANK_NAME - название банка (например: Сбербанк)
 * - BANK_BIK - БИК банка
 * - BANK_ACCOUNT - номер расчётного счёта
 * - BANK_CORR_ACCOUNT - корр. счёт (опционально)
 */

const crypto = require('crypto');
const https = require('https');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const { Driver, getCredentialsFromEnv, TypedValues, Types } = require('ydb-sdk');
const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2');

const SITE_URL = process.env.SITE_URL || 'https://www.mp-webstudio.ru';

// YDB Driver (инициализируется один раз)
let ydbDriver = null;

// Получаем Authorization header для Yandex Cloud API
function getYandexAuthHeader() {
    const apiKey = process.env.YC_API_KEY;
    if (!apiKey) {
        console.error('[YANDEX-AUTH] YC_API_KEY is not configured!');
        throw new Error('YC_API_KEY not configured');
    }

    // Yandex Cloud API strictly requires "Api-Key <key>" for API keys.
    // Ensure no leading/trailing spaces in the key.
    const cleanApiKey = apiKey.trim();

    // Check if the key starts with "Api-Key" - if so, don't duplicate it
    const authHeader = cleanApiKey.startsWith('Api-Key ') 
        ? cleanApiKey 
        : `Api-Key ${cleanApiKey}`;

    // Log minimal info for security, but enough to verify format
    console.log(`[YANDEX-AUTH] Header format: ${authHeader.substring(0, 15)}...`);
    console.log(`[YANDEX-AUTH] Key length: ${cleanApiKey.length}`);
    return authHeader;
}

async function getYdbDriver() {
    if (!ydbDriver) {
        const endpoint = process.env.YDB_ENDPOINT || 'grpcs://ydb.serverless.yandexcloud.net:2135';
        const database = process.env.YDB_DATABASE;

        if (!database) {
            throw new Error('YDB_DATABASE not configured');
        }

        const authService = getCredentialsFromEnv();
        ydbDriver = new Driver({ endpoint, database, authService });

        const timeout = 10000;
        if (!(await ydbDriver.ready(timeout))) {
            throw new Error('YDB driver failed to connect');
        }
        console.log('YDB driver connected to:', database);
    }
    return ydbDriver;
}

async function httpsRequest(urlString, options) {
    return new Promise((resolve, reject) => {
        const url = new URL(urlString);
        const startTime = Date.now();
        const requestId = crypto.randomUUID().substring(0, 8);

        console.log(`\n   [HTTPS-${requestId}] ========== HTTPS REQUEST START ==========`);
        console.log(`   [HTTPS-${requestId}] URL: ${urlString}`);
        console.log(`   [HTTPS-${requestId}] Method: ${options.method}`);
        console.log(`   [HTTPS-${requestId}] Hostname: ${url.hostname}:${url.port || 443}`);
        console.log(`   [HTTPS-${requestId}] Path: ${url.pathname}`);

        const bodySize = options.body ? Buffer.byteLength(options.body) : 0;
        console.log(`   [HTTPS-${requestId}] Request body size: ${bodySize} bytes`);
        console.log(`   [HTTPS-${requestId}] Headers: ${Object.keys(options.headers).join(', ')}`);

        // Определяем таймауты в зависимости от типа запроса
        // Для загрузки файлов используем более длинные таймауты
        const isUpload = options.isUpload || (bodySize > 100000);  // Большие файлы = upload
        const TIMEOUT_MS = isUpload ? 30000 : 12000;  // 30 сек для загрузки, 12 сек для обычных
        const SOCKET_TIMEOUT_MS = isUpload ? 30000 : 15000;  // 30 сек для загрузки, 15 сек для обычных

        console.log(`   [HTTPS-${requestId}] Request type: ${isUpload ? 'UPLOAD' : 'REGULAR'}, timeouts: ${TIMEOUT_MS}ms (main), ${SOCKET_TIMEOUT_MS}ms (socket)`);

        let socketTimeoutId = null;
        let requestTimeoutId = null;
        let hasResponded = false;
        let receivedFirstByte = false;
        let totalBytesReceived = 0;
        let socketConnected = false;
        let tlsConnected = false;
        let requestEnded = false;

        const cleanup = () => {
            if (requestTimeoutId) clearTimeout(requestTimeoutId);
            if (socketTimeoutId) clearTimeout(socketTimeoutId);
        };

        const elapsed = () => Math.round(Date.now() - startTime);
        const elapsedMs = () => Math.round(Date.now() - startTime);

        console.log(`   [HTTPS-${requestId}] Setting main timeout: ${TIMEOUT_MS}ms`);

        requestTimeoutId = setTimeout(() => {
            cleanup();
            const state = {
                elapsed: elapsed() + 'ms',
                hasResponded,
                receivedFirstByte,
                totalBytes: totalBytesReceived,
                socketConnected,
                tlsConnected,
                requestEnded
            };
            console.error(`   [HTTPS-${requestId}] ❌ MAIN TIMEOUT after ${elapsed()}ms`);
            console.error(`   [HTTPS-${requestId}] State:`, JSON.stringify(state));
            req.destroy();
            reject(new Error(`Request timeout after ${elapsed()}ms`));
        }, TIMEOUT_MS);

        const reqOptions = {
            method: options.method,
            headers: options.headers,
            rejectUnauthorized: false,
            timeout: SOCKET_TIMEOUT_MS,
            connectTimeout: 15000,
            keepAlive: true,
            keepAliveMsecs: 1000,
        };

        // Убедимся что Content-Length установлен если есть body
        if (options.body && !reqOptions.headers['Content-Length']) {
            reqOptions.headers['Content-Length'] = Buffer.byteLength(options.body);
        }

        console.log(`   [HTTPS-${requestId}] Creating HTTPS request with timeout: ${SOCKET_TIMEOUT_MS}ms`);

        const req = https.request(url, reqOptions, (res) => {
            hasResponded = true;
            console.log(`   [HTTPS-${requestId}] ✅ Response callback triggered after ${elapsedMs()}ms`);
            console.log(`   [HTTPS-${requestId}] Status code: ${res.statusCode}`);

            try {
                const tlsVersion = res.socket?.getProtocol?.() || 'unknown';
                const cipher = res.socket?.getCipher?.()?.name || 'unknown';
                console.log(`   [HTTPS-${requestId}] TLS: ${tlsVersion}, Cipher: ${cipher}`);
                console.log(`   [HTTPS-${requestId}] Response headers: content-type=${res.headers['content-type']}, content-length=${res.headers['content-length']}`);
            } catch (e) {
                console.log(`   [HTTPS-${requestId}] Could not get TLS info:`, e.message);
            }

            // Reset socket timeout on response start
            socketTimeoutId = setTimeout(() => {
                cleanup();
                console.error(`   [HTTPS-${requestId}] ❌ RESPONSE TIMEOUT after ${elapsed()}ms, received ${totalBytesReceived} bytes`);
                req.destroy();
                reject(new Error('Response timeout'));
            }, SOCKET_TIMEOUT_MS);

            let data = '';
            res.on('data', (chunk) => {
                if (!receivedFirstByte) {
                    receivedFirstByte = true;
                    console.log(`   [HTTPS-${requestId}] 📦 First byte received after ${elapsedMs()}ms`);
                }

                totalBytesReceived += chunk.length;
                console.log(`   [HTTPS-${requestId}] 📥 Data chunk: ${chunk.length} bytes (total: ${totalBytesReceived})`);

                // Reset timeout on each data chunk
                if (socketTimeoutId) clearTimeout(socketTimeoutId);
                socketTimeoutId = setTimeout(() => {
                    cleanup();
                    console.error(`   [HTTPS-${requestId}] ❌ DATA TIMEOUT after ${elapsed()}ms`);
                    req.destroy();
                    reject(new Error('Data timeout'));
                }, SOCKET_TIMEOUT_MS);

                data += chunk;
            });

            res.on('end', () => {
                cleanup();
                console.log(`   [HTTPS-${requestId}] ✨ Response ended after ${elapsedMs()}ms`);
                console.log(`   [HTTPS-${requestId}] Total response size: ${data.length} bytes`);
                console.log(`   [HTTPS-${requestId}] ========== REQUEST SUCCESS ==========\n`);
                resolve({ statusCode: res.statusCode || 500, data });
            });

            res.on('error', (err) => {
                console.error(`   [HTTPS-${requestId}] ❌ Response error:`, err.message);
            });
        });

        req.on('socket', (socket) => {
            console.log(`   [HTTPS-${requestId}] 🔌 Socket created, fd: ${socket.fd || 'unknown'}`);

            // Убедимся что socket не закроется преждевременно
            socket.setKeepAlive(true, 5000);  // Keep-alive каждые 5 сек
            socket.setNoDelay(true);           // Отключить Nagle для быстрой отправки
            socket.setTimeout(SOCKET_TIMEOUT_MS);  // Socket timeout

            socket.on('lookup', () => {
                console.log(`   [HTTPS-${requestId}] 🔍 DNS lookup started`);
            });

            socket.on('connect', () => {
                socketConnected = true;
                console.log(`   [HTTPS-${requestId}] 🌐 TCP connected after ${elapsedMs()}ms`);
            });

            socket.on('secureConnect', () => {
                tlsConnected = true;
                console.log(`   [HTTPS-${requestId}] 🔒 TLS handshake complete after ${elapsedMs()}ms`);
                // Reset timeout after TLS handshake
                socket.setTimeout(SOCKET_TIMEOUT_MS);
            });

            socket.on('close', (hadError) => {
                console.log(`   [HTTPS-${requestId}] ❌ Socket closed (hadError: ${hadError}) after ${elapsed()}ms`);
            });

            socket.on('timeout', () => {
                console.error(`   [HTTPS-${requestId}] ❌ SOCKET TIMEOUT after ${elapsed()}ms - destroying request`);
                socket.destroy();
                req.destroy();
            });

            socket.on('error', (err) => {
                console.error(`   [HTTPS-${requestId}] ❌ Socket error:`, err.code, err.message);
            });
        });

        req.on('error', (err) => {
            cleanup();
            console.error(`   [HTTPS-${requestId}] ❌ REQUEST ERROR after ${elapsed()}ms`);
            console.error(`   [HTTPS-${requestId}] Error code: ${err.code}`);
            console.error(`   [HTTPS-${requestId}] Error message: ${err.message}`);
            console.error(`   [HTTPS-${requestId}] Syscall: ${err.syscall || 'none'}`);
            console.error(`   [HTTPS-${requestId}] State: socket=${socketConnected}, tls=${tlsConnected}, firstByte=${receivedFirstByte}, totalBytes=${totalBytesReceived}`);
            console.error(`   [HTTPS-${requestId}] ========== REQUEST FAILED ==========\n`);
            reject(err);
        });

        req.on('timeout', () => {
            cleanup();
            console.error(`   [HTTPS-${requestId}] ⏱️ REQUEST TIMEOUT EVENT after ${elapsed()}ms`);
            console.error(`   [HTTPS-${requestId}] State: socket=${socketConnected}, tls=${tlsConnected}, firstByte=${receivedFirstByte}, totalBytes=${totalBytesReceived}`);
            req.destroy();
            reject(new Error('Socket timeout'));
        });

        req.on('abort', () => {
            console.log(`   [HTTPS-${requestId}] Request aborted after ${elapsed()}ms`);
        });

        if (options.body) {
            const bodyStr = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
            const bodyPreview = bodyStr.substring(0, 100) + (bodyStr.length > 100 ? '...' : '');
            console.log(`   [HTTPS-${requestId}] 📤 Writing body (${bodySize} bytes): ${bodyPreview}`);
            req.write(options.body);
            console.log(`   [HTTPS-${requestId}] Body written successfully`);
        }

        console.log(`   [HTTPS-${requestId}] 🚀 Calling req.end()`);
        requestEnded = true;
        req.end();
        console.log(`   [HTTPS-${requestId}] Waiting for response...`);
    });
}

module.exports.handler = async function (event, context) {
    // ВАЖНО: Первая строка логов для отладки триггеров
    console.log('[HANDLER-ENTRY]', JSON.stringify({
        hasMessages: !!event.messages,
        messageCount: event.messages?.length,
        httpMethod: event.httpMethod,
        isTimer: event.messages?.[0]?.event_metadata?.event_type?.includes('TimerMessage')
    }));

    console.log('[HANDLER START]', { method: event.httpMethod, path: event.path, timestamp: new Date().toISOString() });

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
    };

    if (event.httpMethod === 'OPTIONS') {
        console.log('[OPTIONS] Returning 200');
        return { 
            statusCode: 200, 
            headers,
            body: JSON.stringify({ ok: true })
        };
    }

    const query = event.queryStringParameters || {};
    let path = event.path || event.url || '';
    let method = event.httpMethod;

    try {
        let body = {};
        if (event.body) {
            let rawBody = event.isBase64Encoded 
                ? Buffer.from(event.body, 'base64').toString('utf-8')
                : event.body;

            try {
                body = JSON.parse(rawBody);
            } catch (e) {
                if (typeof rawBody === 'string' && rawBody.length > 0) {
                    const params = new URLSearchParams(rawBody);
                    body = Object.fromEntries(params);
                }
            }
        }

        let action = query.action || body.action || '';

        console.log('[REQUEST]', { method, action, path, bodyKeys: Object.keys(body) });

        // Support for Yandex Cloud Timer Triggers (moved after body parsing)
        if (event.messages && Array.isArray(event.messages)) {
            console.log('[TRIGGER-DETECTED]', JSON.stringify(event.messages[0]?.event_metadata));
            const message = event.messages[0];
            
            if (message.event_metadata?.event_type?.includes('TimerMessage') || 
                message.event_metadata?.event_type?.includes('ScheduledMessage')) {
                action = 'vk-auto-post';
                method = 'POST';
            }

            if (message.details?.payload) {
                try {
                    const payload = JSON.parse(message.details.payload);
                    if (payload.action) action = payload.action;
                    if (payload.httpMethod) method = payload.httpMethod;
                } catch (e) {
                    const rawPayload = String(message.details.payload).trim();
                    if (rawPayload === 'vk-auto-post') {
                        action = 'vk-auto-post';
                        method = 'POST';
                    }
                }
            }
        }

        // Robots.txt
        if (path.endsWith('/robots.txt')) {
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'text/plain' },
                body: "User-agent: *\nAllow: /\nSitemap: https://mp-webstudio.ru/sitemap.xml"
            };
        }

        // Sitemap.xml
        if (path.endsWith('/sitemap.xml')) {
            const pages = [
                { path: "", freq: "daily", priority: "1.0" },
                { path: "/order", freq: "weekly", priority: "0.9" },
                { path: "/privacy", freq: "monthly", priority: "0.5" },
                { path: "/offer", freq: "monthly", priority: "0.5" },
                { path: "/demo/food-delivery", freq: "monthly", priority: "0.8" },
                { path: "/demo/fitness", freq: "monthly", priority: "0.8" },
                { path: "/demo/cosmetics", freq: "monthly", priority: "0.8" },
                { path: "/demo/dental", freq: "monthly", priority: "0.8" },
                { path: "/demo/barber", freq: "monthly", priority: "0.8" },
                { path: "/demo/travel", freq: "monthly", priority: "0.8" },
                { path: "/demo/renovation", freq: "monthly", priority: "0.8" },
                { path: "/demo/streetwear", freq: "monthly", priority: "0.8" },
                { path: "/demo/socks", freq: "monthly", priority: "0.8" },
                { path: "/demo/photographer", freq: "monthly", priority: "0.8" },
                { path: "/demo/auto-service", freq: "monthly", priority: "0.8" },
                { path: "/demo/real-estate", freq: "monthly", priority: "0.8" },
                { path: "/demo/beauty-salon", freq: "monthly", priority: "0.8" },
                { path: "/demo/online-academy", freq: "monthly", priority: "0.8" },
            ];

            const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <lastmod>2026-01-09</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/xml' },
                body: sitemap
            };
        }

        // Telegram Bot Webhook
        if ((action === 'telegram-webhook' || path.includes('/telegram-webhook')) && method === 'POST') {
            return await handleTelegramWebhook(body, headers);
        }

        if ((action === 'contact' || path.includes('/contact')) && method === 'POST') {
            return await handleContact(body, headers);
        }

        if ((action === 'orders' || path.includes('/order')) && method === 'POST') {
            return await handleOrder(body, headers);
        }

        if ((action === 'robokassa/result' || path.includes('/robokassa/result')) && method === 'POST') {
            return await handleRobokassaResult({ ...body, ...query }, headers);
        }

        if (action === 'robokassa/success' || path.includes('/robokassa/success')) {
            return handleRobokassaSuccess(query);
        }

        if (action === 'robokassa/fail' || path.includes('/robokassa/fail')) {
            return handleRobokassaFail(query);
        }

        if ((action === 'pay-remaining' || action === 'orders/pay-remaining' || path.includes('/pay-remaining')) && method === 'POST') {
            return await handlePayRemaining(body, headers);
        }

        if ((action === 'additional-invoices' || path.includes('/additional-invoices')) && method === 'POST') {
            return await handleAdditionalInvoice(body, headers);
        }

        // POST /api/bank-invoice - создать счёт на оплату для юрлиц (предоплата)
        if ((action === 'bank-invoice' || path.endsWith('/bank-invoice')) && method === 'POST') {
            return await handleBankInvoice(body, headers);
        }

        // POST /api/bank-invoice/remaining - выставить счёт на остаток для юрлиц
        if ((action === 'bank-invoice-remaining' || path.includes('/bank-invoice/remaining')) && method === 'POST') {
            return await handleBankInvoiceRemaining(body, headers);
        }

        // POST /api/bank-invoice/addon - выставить доп. счёт для юрлиц
        if ((action === 'bank-invoice-addon' || path.includes('/bank-invoice/addon')) && method === 'POST') {
            return await handleBankInvoiceAddon(body, headers);
        }

        // POST /api/confirm-bank-payment - подтвердить оплату по счёту
        if ((action === 'confirm-bank-payment' || path.includes('/confirm-bank-payment')) && method === 'POST') {
            return await handleConfirmBankPayment(body, headers);
        }

        // POST /api/send-calculator-order - отправить заказ из калькулятора
        if ((action === 'send-calculator-order' || path.includes('/send-calculator-order')) && method === 'POST') {
            return await handleCalculatorOrder(body, headers);
        }

        // POST /api/admin/create-vk-product - ручное создание товара
        if (action === 'admin/create-vk-product' && method === 'POST') {
            const { title, description, price } = body;
            if (!title || !price) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ success: false, message: 'Title and price are required' }),
                };
            }
            const productId = await createVkProduct(title, description, price);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: !!productId, productId }),
            };
        }

        // POST /api/giga-chat - AI чат через Yandex AI
        if ((action === 'giga-chat' || path.includes('/giga-chat')) && method === 'POST') {
            console.log('[YANDEX-CHAT] Handler called');
            return await handleYandexChat(body, headers, event);
        }

        // POST ?action=delete-order - мягкое удаление заказа
        if (action === 'delete-order' && method === 'POST') {
            const orderIdToDelete = body.orderId;
            if (orderIdToDelete) {
                return await handleDeleteOrder(orderIdToDelete, headers);
            }
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ success: false, message: 'orderId is required' }),
            };
        }

        // POST ?action=orders/{id}/note - обновить заметку
        const noteActionMatch = action.match(/^orders\/([a-zA-Z0-9_-]+)\/note$/);
        if (noteActionMatch && method === 'POST') {
            return await handleUpdateOrderNote(noteActionMatch[1], body.note || '', headers);
        }

        // GET /api/orders - получить список всех заказов
        if ((action === 'orders' || path.endsWith('/orders')) && method === 'GET') {
            return await handleListOrders(query, headers);
        }

        // GET ?action=client-orders&email=... - заказы клиента по email (для Mini App)
        if (action === 'client-orders' && method === 'GET') {
            return await handleClientOrders(query, headers);
        }

        // GET /api/orders/:orderId - получить заказ по ID
        const orderMatch = path.match(/\/orders\/([a-zA-Z0-9_-]+)$/);
        if (orderMatch && method === 'GET') {
            return await handleGetOrder(orderMatch[1], headers);
        }

        // Также поддерживаем action=orders/orderId для совместимости с фронтендом
        const actionOrderMatch = action.match(/^orders\/([a-zA-Z0-9_-]+)$/);
        if (actionOrderMatch && method === 'GET') {
            return await handleGetOrder(actionOrderMatch[1], headers);
        }

        // Admin authentication
        if (action === 'admin-login' && method === 'POST') {
            return await handleAdminLogin(body, headers);
        }

        if (action === 'verify-admin' && method === 'POST') {
            return await handleVerifyAdmin(body, headers);
        }

        // DELETE /api/orders/:orderId - мягкое удаление заказа
        if (method === 'DELETE') {
            const deleteMatch = path.match(/\/orders\/([a-zA-Z0-9_-]+)$/);
            const deleteActionMatch = action.match(/^orders\/([a-zA-Z0-9_-]+)$/);
            const orderIdToDelete = deleteMatch?.[1] || deleteActionMatch?.[1] || body.orderId;
            if (orderIdToDelete) {
                return await handleDeleteOrder(orderIdToDelete, headers);
            }
        }

        // PATCH /api/orders/:orderId/note - обновить заметку
        if (method === 'PATCH' || (method === 'POST' && action.includes('/note'))) {
            const noteMatch = path.match(/\/orders\/([a-zA-Z0-9_-]+)\/note$/);
            const noteActionMatch = action.match(/^orders\/([a-zA-Z0-9_-]+)\/note$/);
            const orderIdForNote = noteMatch?.[1] || noteActionMatch?.[1] || body.orderId;
            if (orderIdForNote) {
                return await handleUpdateOrderNote(orderIdForNote, body.note || '', headers);
            }
        }

        console.log('[HANDLER] Body type:', body?.type);
        console.log('[HANDLER] Action:', action);

        if (action === 'vk-auto-post' || path.includes('/vk-auto-post')) {
            console.log('[HANDLER] Route matched: VK Auto Post');
            return await handleVkAutoPostYandex(headers);
        }

        if (body?.type === 'confirmation') {
            const VK_CONFIRMATION_CODE = process.env.VK_CONFIRMATION_CODE || '2310963c';
            console.log('[VK-CALLBACK] Handling confirmation request');
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'text/plain' },
                body: VK_CONFIRMATION_CODE
            };
        }

        if (body?.type === 'message_new') {
            console.log('[VK-CALLBACK] New message detected:', JSON.stringify(body));
            await handleVkMessage(body, headers);
            return {
                statusCode: 200,
                headers,
                body: 'ok'
            };
        }

        if (body?.type === 'message_typing_state') {
            const vkToken = process.env.VK_ACCESS_TOKEN;
            const userId = body.object.from_id;
            console.log(`[VK-CALLBACK] Typing state from user: ${userId}`);

            // We could send messages.setActivity to VK but usually it's not required to respond to typing_state
            // Just logging and returning 'ok' is enough to acknowledge the event.
            return {
                statusCode: 200,
                headers,
                body: 'ok'
            };
        }

        if (body?.type === 'message_reply' || body?.type === 'message_read') {
            console.log(`[VK-CALLBACK] Handling ${body.type}`);
            return {
                statusCode: 200,
                headers,
                body: 'ok'
            };
        }

        if (!body && !action) {
            console.log('[HANDLER] Falling back to default response (no body/action)');
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, message: "Service is active" })
            };
        }

    } catch (error) {
        console.error('Handler error:', error.message, error.stack);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, message: 'Internal server error', error: error.message }),
        };
    }
};

// ============ Telegram Bot Webhook ============


async function handleVkMessage(body, headers) {
    try {
        const vkToken = process.env.VK_ACCESS_TOKEN;
        const messageObj = body.object.message;
        const userId = messageObj.from_id;
        const text = messageObj.text;

        if (!text || userId < 0) return { statusCode: 200, headers, body: 'ok' };

        console.log(`[VK-CHAT-BOT] Message from ${userId}: ${text}`);

        const companyContext = (process.env.COMPANY_CONTEXT || '').trim();
        const systemPrompt = `Ты — профессиональный AI-ассистент компании MP.WebStudio. Ты хорошо знаешь все услуги, цены, процесс разработки и технологии студии.

${companyContext || 'MP.WebStudio — веб-студия полного цикла. Мы создаём современные и функциональные веб-решения для бизнеса.'}

ВАЖНЫЕ ПРАВИЛА:
- Отвечай вежливо и профессионально
- Если клиент спрашивает про цену — сразу скажи точную стоимость
- Если нужна консультация или уточнение деталей — предложи связаться по телефону или email
- Если спрашивают про сроки — скажи что сроки обговариваются при обсуждении проекта
- Поддержка после запуска — 1 месяц включен в цену
- Используй информацию о портфолио когда уместно
- Отвечай кратко и по существу

КОМАНДЫ ДЛЯ СИСТЕМЫ:
Если ты понимаешь, что нужно создать новую карточку услуги (товара) в ВК на основе обсуждения, добавь в конце ответа JSON блок:
:::create_vk_product:{"title": "Название", "description": "Описание", "price": 50000}:::
Используй это только если клиент явно выразил желание или если это логическое завершение обсуждения услуги.`;

        const aiResponse = await callYandexGPT(text, 'yandexgpt-lite', systemPrompt);
        const replyTextRaw = aiResponse.content;
        console.log(`[VK-CHAT-BOT] AI Raw Response: ${replyTextRaw}`);
        const replyText = await processAiCommands(replyTextRaw, userId);

        if (!replyText || replyText.trim() === '') {
            // Если текст пустой, мы не отправляем подтверждение сразу, 
            // так как создание товара идет асинхронно. 
            // Но чтобы избежать ошибки "message is empty", отправим статус ожидания
            console.log('[VK-CHAT-BOT] Empty reply text, sending status');
            return { statusCode: 200, headers, body: 'ok' };
        }

        const vkUrl = 'https://api.vk.com/method/messages.send';
        const params = {
            peer_id: userId,
            message: replyText,
            random_id: Math.floor(Math.random() * 1000000),
            access_token: vkToken,
            v: '5.131',
            group_id: process.env.VK_GROUP_ID
        };

        console.log(`[VK-CHAT-BOT] Sending to VK: ${JSON.stringify(params)}`);

        const response = await httpsRequest(vkUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(params).toString()
        });

        console.log(`[VK-CHAT-BOT] VK Response: ${JSON.stringify(response)}`);

        // Check for VK API internal error
        try {
            const vkResponseBody = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
            if (vkResponseBody && vkResponseBody.error) {
                console.error('[VK-CHAT-BOT] VK API Error Detail:', JSON.stringify(vkResponseBody.error));
            }
        } catch (e) {
            console.log('[VK-CHAT-BOT] Could not parse VK response body as JSON');
        }

        console.log(`[VK-CHAT-BOT] Replied to ${userId}`);
        return { statusCode: 200, headers, body: 'ok' };
    } catch (error) {
        console.error('[VK-CHAT-BOT] Error:', error.message);
        return { statusCode: 200, headers, body: 'ok' }; // Всегда возвращаем ok для ВК
    }
}

async function handleVkAutoPostYandex(headers) {
    try {
        console.log('[VK-AUTO-POST-YANDEX] Starting automation with Yandex AI');
        const vkToken = process.env.VK_ACCESS_TOKEN;
        const groupId = process.env.VK_GROUP_ID;
        const folderId = process.env.YC_FOLDER_ID;

        if (!vkToken || !groupId) {
            throw new Error('VK_ACCESS_TOKEN or VK_GROUP_ID not configured');
        }

        if (!folderId) {
            throw new Error('YC_FOLDER_ID not configured');
        }

        // YC_API_KEY проверяется внутри getYandexAuthHeader()

        // 1. Генерируем ТЕКСТ через Yandex GPT
        console.log('[VK-AUTO-POST-YANDEX] Generating dynamic text...');
        
        const themes = [
            {
                title: "Тренды веб-дизайна 2026",
                prompt: "Напиши пост о трендах веб-дизайна в 2026 году. Упомяни минимализм, нейросети в интерфейсах и скорость работы. Сделай упор на то, что MP.WebStudio уже внедряет это. Объясни, что конструкторы типа Тильда не справляются с такими задачами.",
                imagePrompt: "Futuristic 2026 web design trends, sleek UI interface, minimal glowing elements, 'MP.WebStudio' digital logo, high-tech aesthetic, 8k"
            },
            {
                title: "Скорость сайта = Прибыль",
                prompt: "Напиши пост о том, как медленный сайт убивает продажи. Объясни, почему важна техническая оптимизация и как Node.js превосходит тяжелые CMS типа WordPress и Bitrix. MP.WebStudio делает сайты, которые летают.",
                imagePrompt: "Fast website speed concept, motion blur, fiber optic data flow, professional web development, 'MP.WebStudio' branding, blue neon lighting"
            },
            {
                title: "Нейросети для бизнеса",
                prompt: "Напиши пост о пользе нейросетей для бизнеса. Расскажи про умные чаты и автоматизацию контента. Подчеркни, что на Node.js интеграция ИИ работает быстрее и надежнее, чем плагины для конструкторов.",
                imagePrompt: "Artificial Intelligence for business automation, neural network visualization, smart interface, 'MP.WebStudio' tech logo, deep blue and purple tones"
            },
            {
                title: "Свобода от конструкторов",
                prompt: "Напиши пост о том, почему пора уходить с Тильды и Вордпресс на профессиональную разработку на Node.js. Сделай акцент на полной собственности кода, отсутствии ограничений по дизайну и безопасности. Ты не арендуешь сайт, ты им владеешь.",
                imagePrompt: "Breaking through digital chains, professional code visualization, custom web architecture, 'MP.WebStudio' logo, metallic and neon style"
            },
            {
                title: "Безопасность вашего бизнеса",
                prompt: "Напиши пост о том, почему популярные CMS (Bitrix, WordPress) часто взламывают. Объясни преимущества безопасности кастомных решений на Node.js от MP.WebStudio. Защити свой бизнес от уязвимостей шаблонов.",
                imagePrompt: "Cybersecurity shield, digital fortress, secure code patterns, 'MP.WebStudio' protective shield logo, green and dark blue tones"
            }
        ];

        const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
        console.log(`[VK-AUTO-POST-YANDEX] Selected theme: ${selectedTheme.title}`);

        const systemPrompt = `Ты — эксперт веб-студии MP.WebStudio. Пиши посты для ВКонтакте.
ПРАВИЛА:
- Язык: Живой, понятный русский без сложной терминологии.
- Структура: Заголовок, 3-4 абзаца, призыв к действию, контакты.
- СТИЛЬ: Профессионально, но дружелюбно. Активно продвигай преимущество Node.js перед конструкторами (Tilda, WordPress, Bitrix).
- ССЫЛКИ: Пиши ссылки ПРОСТО ТЕКСТОМ (никаких [текст](ссылка)).

КОНТАКТЫ (ОБЯЗАТЕЛЬНО В КОНЦЕ):
Наш сайт: https://mp-webstudio.ru 
Наш Telegram: https://t.me/New_WebStudio/85
Наше сообщество ВК: https://vk.com/mp.webstudio

- ХЭШТЕГИ: #MPWebStudio #ВебСтудия #NodeJS #РазработкаСайтов #AI`;

        const textResponse = await callYandexGPT(selectedTheme.prompt, 'yandexgpt-lite', systemPrompt);
        const postText = textResponse.content;

        // 2. Генерируем КАРТИНКУ на ту же тему
        console.log('[VK-AUTO-POST-YANDEX] Generating matching image...');
        const imageBuffer = await generateYandexImage(selectedTheme.imagePrompt);
        console.log('[VK-AUTO-POST-YANDEX] Image generated, size:', imageBuffer.length, 'bytes');

        // 3. Загружаем картинку в ВК
        const photoId = await uploadPhotoToVk(vkToken, groupId, imageBuffer);
        if (!photoId) {
            throw new Error('Failed to upload photo to VK');
        }

        console.log('[VK-AUTO-POST-YANDEX] Photo uploaded, ID:', photoId);

        // 5. Публикуем пост в ВК
        const vkUrl = 'https://api.vk.com/method/wall.post';
        const bodyParams = new URLSearchParams({
            owner_id: `-${groupId}`,
            from_group: '1',
            message: postText,
            attachment: photoId,
            access_token: vkToken,
            v: '5.131'
        });

        const vkResult = await httpsRequest(vkUrl, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: bodyParams.toString()
        });

        const vkResultData = typeof vkResult.data === 'string' ? JSON.parse(vkResult.data) : vkResult.data;
        console.log('[VK-AUTO-POST-YANDEX] VK API Response:', JSON.stringify(vkResultData).substring(0, 200));

        // 6. ПУБЛИКАЦИЯ В TELEGRAM ГРУППУ/КАНАЛ (двухсообщенный формат)
        try {
            await sendPostToTelegramTwoMessages(imageBuffer, postText);
        } catch (tgError) {
            console.error('[VK-AUTO-POST-YANDEX] Telegram error:', tgError.message);
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                message: 'Post published to VK and Telegram (Dynamic Generation)',
                vkResponse: vkResultData 
            })
        };
    } catch (error) {
        console.error('[VK-AUTO-POST-YANDEX] Error:', error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, error: error.message })
        };
    }
}

async function sendPostToTelegramTwoMessages(imageBuffer, fullText) {
    const tgBotToken = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
    const tgChatId = (process.env.TELEGRAM_AUTO_POST_CHAT_ID || process.env.TELEGRAM_CHAT_ID || '').trim();

    console.log(`[TELEGRAM-TWO-MSG] Posting to Telegram (full text: ${fullText.length} chars)...`);

    if (!tgBotToken || !tgChatId) {
        console.log('[TELEGRAM-TWO-MSG] Telegram not configured, skipping');
        return;
    }

    const escapeMarkdownV2 = (text) => {
        return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
    };

    // СООБЩЕНИЕ 1: Только фото (без подписи)
    const tgUrl = `https://api.telegram.org/bot${tgBotToken}/sendPhoto`;
    const boundary = '----TGBoundary' + Math.random().toString(36).substring(2, 15);
    const CRLF = '\r\n';

    const parts = [];
    parts.push(`--${boundary}${CRLF}Content-Disposition: form-data; name="chat_id"${CRLF}${CRLF}${tgChatId}`);
    parts.push(`${CRLF}--${boundary}${CRLF}Content-Disposition: form-data; name="photo"; filename="image.png"${CRLF}Content-Type: image/png${CRLF}${CRLF}`);
    parts.push(`${CRLF}--${boundary}--`);

    const bodyStart = Buffer.from(parts[0] + parts[1]);
    const bodyEnd = Buffer.from(parts[2]);
    const body = Buffer.concat([bodyStart, imageBuffer, bodyEnd]);

    console.log('[TELEGRAM-TWO-MSG] Message 1: Photo only, size:', body.length, 'bytes');

    try {
        const tgResponse = await fetch(tgUrl, {
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': body.length.toString()
            },
            body: body,
            timeout: 60000
        });

        const tgData = await tgResponse.text();
        const tgResult = JSON.parse(tgData);

        if (tgResult.ok) {
            console.log('[TELEGRAM-TWO-MSG] ✅ Message 1 sent, msg_id:', tgResult.result?.message_id);
        } else {
            console.error('[TELEGRAM-TWO-MSG] ❌ Message 1 error:', tgResult.description);
            return;
        }
    } catch (e) {
        console.error('[TELEGRAM-TWO-MSG] Message 1 failed:', e.message);
        return;
    }

    // СООБЩЕНИЕ 2: Полный текст отдельным сообщением
    const escapedFull = escapeMarkdownV2(fullText);
    const messageUrl = `https://api.telegram.org/bot${tgBotToken}/sendMessage`;

    console.log('[TELEGRAM-TWO-MSG] Message 2: Full text (', fullText.length, 'chars)');

    try {
        const msgResponse = await fetch(messageUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: tgChatId,
                text: escapedFull,
                parse_mode: 'MarkdownV2'
            }),
            timeout: 15000
        });

        const msgData = await msgResponse.text();
        const msgResult = JSON.parse(msgData);

        if (msgResult.ok) {
            console.log('[TELEGRAM-TWO-MSG] ✅ Message 2 sent, msg_id:', msgResult.result?.message_id);
        } else {
            console.error('[TELEGRAM-TWO-MSG] ❌ Message 2 error:', msgResult.description);
        }
    } catch (e) {
        console.error('[TELEGRAM-TWO-MSG] Message 2 failed:', e.message);
    }
}

async function generateYandexImage(prompt) {
    const folderId = process.env.YC_FOLDER_ID;

    if (!folderId) {
        throw new Error('YC_FOLDER_ID not configured');
    }

    console.log('[YANDEX-ART] Starting image generation...');

    // ШАГ 1: Запустить асинхронную генерацию
    const startResponse = await httpsRequest('https://llm.api.cloud.yandex.net/foundationModels/v1/imageGenerationAsync', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getYandexAuthHeader()
        },
        body: JSON.stringify({
            modelUri: `art://${folderId}/yandex-art/latest`,
            generationOptions: {
                seed: Math.floor(Math.random() * 10000),
                aspectRatio: { widthRatio: '1', heightRatio: '1' }
            },
            messages: [{ weight: '1', text: prompt }]
        })
    });

    if (startResponse.statusCode !== 200) {
        throw new Error(`Image generation request failed: ${startResponse.statusCode}`);
    }

    const operationId = JSON.parse(startResponse.data).id;
    console.log('[YANDEX-ART] Operation ID:', operationId);

    // ШАГ 2: Polling для получения результата
    return await pollYandexImageStatus(operationId);
}

async function pollYandexImageStatus(operationId, maxAttempts = 60) {
    console.log('[YANDEX-ART] Polling image generation status...');

    for (let i = 0; i < maxAttempts; i++) {
        const statusResponse = await httpsRequest(`https://operation.api.cloud.yandex.net/operations/${operationId}`, {
            method: 'GET',
            headers: {
                'Authorization': getYandexAuthHeader()
            }
        });

        if (statusResponse.statusCode !== 200) {
            throw new Error(`Status check failed: ${statusResponse.statusCode}`);
        }

        const status = JSON.parse(statusResponse.data);

        if (status.done) {
            const imageBase64 = status.response.image;
            console.log('[YANDEX-ART] Image generation completed!');
            return Buffer.from(imageBase64, 'base64');
        }

        console.log(`[YANDEX-ART] Waiting... attempt ${i + 1}/${maxAttempts}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    throw new Error(`Image generation timeout after ${maxAttempts * 2}s`);
}

async function uploadPhotoToVk(token, groupId, imageData) {
    try {
        // 1. Получаем сервер для загрузки
        const serverUrl = `https://api.vk.com/method/photos.getWallUploadServer?group_id=${groupId}&access_token=${token}&v=5.131`;
        const serverRes = await httpsRequest(serverUrl, { method: 'GET', headers: {} });

        if (serverRes.statusCode !== 200) {
            throw new Error(`Failed to get upload server: HTTP ${serverRes.statusCode}`);
        }

        const serverData = JSON.parse(serverRes.data);
        console.log('[VK-UPLOAD] Server response:', JSON.stringify(serverData).substring(0, 200));

        // Проверяем наличие ошибки в ответе ВК
        if (serverData.error) {
            const errorCode = serverData.error.error_code;
            const errorMsg = serverData.error.error_msg;

            // Специальная обработка ошибки 27 - проблема с токеном доступа
            if (errorCode === 27) {
                console.error('[VK-UPLOAD] ⚠️  ERROR 27: Group authorization failed');
                console.error('[VK-UPLOAD] SOLUTION: photos.getWallUploadServer requires a USER token (not group token)');
                console.error('[VK-UPLOAD] Please use VK_ACCESS_TOKEN from a user with admin rights in the group, not a group token');
                throw new Error(`VK API error 27: Access token must be a USER token with admin rights to the group, not a group token. Для загрузки фото ВК требует токен пользователя (User Token) с правами администратора в группе. Токен группы (Group Token) не поддерживает метод photos.getWallUploadServer.`);
            }

            throw new Error(`VK API error: ${errorCode} - ${errorMsg}`);
        }

        if (!serverData.response || !serverData.response.upload_url) {
            throw new Error(`Invalid server response: missing upload_url. Response: ${JSON.stringify(serverData)}`);
        }

        const uploadUrl = serverData.response.upload_url;
        console.log('[VK-UPLOAD] Got upload URL');

        // 2. Загружаем файл
        const boundary = '----WebKitFormBoundary' + crypto.randomUUID();

        // Убедимся что imageData это Buffer
        const imageBuffer = Buffer.isBuffer(imageData) ? imageData : Buffer.from(imageData);
        console.log(`[VK-UPLOAD] Image buffer size: ${imageBuffer.length} bytes`);

        // Формируем multipart body
        const header = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="photo"; filename="image.png"\r\nContent-Type: image/png\r\n\r\n`);
        const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
        const body = Buffer.concat([header, imageBuffer, footer]);

        console.log(`[VK-UPLOAD] Total multipart body size: ${body.length} bytes`);

        const uploadRes = await httpsRequest(uploadUrl, {
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`
            },
            body: body,
            isUpload: true
        });

        if (uploadRes.statusCode !== 200) {
            throw new Error(`Failed to upload photo: HTTP ${uploadRes.statusCode}`);
        }

        const uploadData = JSON.parse(uploadRes.data);
        console.log('[VK-UPLOAD] Upload response:', JSON.stringify(uploadData).substring(0, 200));

        // Проверяем структуру ответа загрузки (ВК возвращает поля напрямую, без wrapping)
        if (!uploadData.photo || !uploadData.server || !uploadData.hash) {
            throw new Error(`Invalid upload response: missing required fields. Response: ${JSON.stringify(uploadData)}`);
        }

        // 3. Сохраняем фото
        const saveUrl = `https://api.vk.com/method/photos.saveWallPhoto?group_id=${groupId}&photo=${uploadData.photo}&server=${uploadData.server}&hash=${uploadData.hash}&access_token=${token}&v=5.131`;
        const saveRes = await httpsRequest(saveUrl, { method: 'POST', headers: {} });

        if (saveRes.statusCode !== 200) {
            throw new Error(`Failed to save photo: HTTP ${saveRes.statusCode}`);
        }

        const saveData = JSON.parse(saveRes.data);
        console.log('[VK-UPLOAD] Save response:', JSON.stringify(saveData).substring(0, 200));

        // Проверяем наличие ошибки в ответе ВК
        if (saveData.error) {
            throw new Error(`VK API error on save: ${saveData.error.error_code} - ${saveData.error.error_msg}`);
        }

        if (!saveData.response || !Array.isArray(saveData.response) || saveData.response.length === 0) {
            throw new Error(`Invalid save response: missing photo data. Response: ${JSON.stringify(saveData)}`);
        }

        const savedPhoto = saveData.response[0];

        if (!savedPhoto.owner_id || !savedPhoto.id) {
            throw new Error(`Invalid saved photo data: missing owner_id or id. Data: ${JSON.stringify(savedPhoto)}`);
        }

        console.log(`[VK-UPLOAD] Photo saved successfully: photo${savedPhoto.owner_id}_${savedPhoto.id}`);
        return `photo${savedPhoto.owner_id}_${savedPhoto.id}`;
    } catch (e) {
        console.error('[VK-UPLOAD] Photo upload error:', e.message);
        return null;
    }
}


/**
 * Создание товара в ВК
 */
async function createVkProduct(title, description, price) {
    try {
        const vkToken = process.env.VK_ACCESS_TOKEN;
        const ownerId = process.env.VK_GROUP_ID; // Обычно отрицательный для групп
        
        if (!vkToken || !ownerId) {
            console.error('[VK-PRODUCT] Missing VK_ACCESS_TOKEN or VK_GROUP_ID');
            return null;
        }

        console.log(`[VK-PRODUCT] Creating product: ${title}, price: ${price}`);

        // 1. Получаем категорию (упрощенно - первая попавшаяся или дефолтная)
        // В реальности лучше задать конкретную категорию ID
        const categoryId = 600; // Разработка ПО / Сайты (примерный ID)

        const response = await httpsRequest('https://api.vk.com/method/market.add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                access_token: vkToken,
                v: '5.131',
                owner_id: ownerId.startsWith('-') ? ownerId : `-${ownerId}`,
                name: title,
                description: description,
                category_id: categoryId,
                price: price,
                deleted: 0,
                main_photo_id: process.env.VK_DEFAULT_PRODUCT_PHOTO_ID || ''
            }).toString()
        });

        const result = JSON.parse(response.data);
        if (result.error) {
            console.error('[VK-PRODUCT] VK API Error:', JSON.stringify(result.error));
            // Оповещаем пользователя об ошибке, если товар не создался
            const errorMsg = result.error.error_code === 100 ? 'Ошибка валидации данных (возможно, фото уже используется в другом товаре)' : result.error.error_msg;
            
            const params = {
                peer_id: userId,
                message: `Ошибка при создании товара: ${errorMsg}. Пожалуйста, попробуйте другое фото или проверьте настройки.`,
                random_id: Math.floor(Math.random() * 1000000),
                access_token: vkToken,
                v: '5.131',
                group_id: process.env.VK_GROUP_ID
            };
            await httpsRequest('https://api.vk.com/method/messages.send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(params).toString()
            });
            return null;
        }

        console.log('[VK-PRODUCT] Product created successfully:', result.response?.market_item_id);
        
        // Отправляем подтверждение пользователю после успешного создания
        const confirmParams = {
            peer_id: userId, // Нам нужно передать userId в эту функцию
            message: `Карточка товара "${title}" успешно создана! ✅`,
            random_id: Math.floor(Math.random() * 1000000),
            access_token: vkToken,
            v: '5.131',
            group_id: process.env.VK_GROUP_ID
        };
        // Мы не можем легко получить userId здесь без изменения сигнатуры функции,
        // поэтому оставим логирование, а подтверждение будем слать в handleVkMessage
        
        return result.response?.market_item_id;
    } catch (e) {
        console.error('[VK-PRODUCT] Error:', e.message);
        return null;
    }
}

/**
 * Парсинг ответа ИИ на наличие команд создания товара
 */
async function processAiCommands(text, userId) {
    const marker = ':::create_vk_product:';
    const jsonBlockRegex = /```(?:json)?\s*(\{[\s\S]*?\})\s*```/g;
    
    let match;
    let modifiedText = text;

    // Сначала ищем наш специальный маркер
    if (text.includes(marker)) {
        try {
            const parts = text.split(marker);
            const mainText = parts[0];
            const commandPart = parts[1].split(':::')[0];
            const productData = JSON.parse(commandPart);
            console.log('[AI-COMMAND] Detected via marker:', productData);
        // Запускаем создание асинхронно
        createVkProduct(productData.title, productData.description, productData.price)
            .then(async id => {
                if (id) {
                    console.log(`[AI-COMMAND] Product created (marker): ${id}`);
                    // Отправляем уведомление об успехе
                    const vkToken = process.env.VK_ACCESS_TOKEN;
                    const params = {
                        peer_id: userId,
                        message: `Карточка товара "${productData.title}" успешно создана! ✅`,
                        random_id: Math.floor(Math.random() * 1000000),
                        access_token: vkToken,
                        v: '5.131',
                        group_id: process.env.VK_GROUP_ID
                    };
                    await httpsRequest('https://api.vk.com/method/messages.send', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams(params).toString()
                    });
                }
            })
            .catch(err => console.error('[AI-COMMAND] Marker creation failed:', err));
            return mainText.trim();
        } catch (e) {
            console.error('[AI-COMMAND] Marker parsing error:', e.message);
        }
    }

    // Если маркера нет, ищем JSON блоки в формате ```json ... ```
    while ((match = jsonBlockRegex.exec(text)) !== null) {
        try {
            const productData = JSON.parse(match[1]);
            if (productData.title && productData.price) {
                console.log('[AI-COMMAND] Detected via JSON block:', productData);
                // Запускаем создание асинхронно
                createVkProduct(productData.title, productData.description, productData.price)
                    .then(async id => {
                        if (id) {
                            console.log(`[AI-COMMAND] Product created (JSON block): ${id}`);
                            // Отправляем уведомление об успехе
                            const vkToken = process.env.VK_ACCESS_TOKEN;
                            const params = {
                                peer_id: userId,
                                message: `Карточка товара "${productData.title}" успешно создана! ✅`,
                                random_id: Math.floor(Math.random() * 1000000),
                                access_token: vkToken,
                                v: '5.131',
                                group_id: process.env.VK_GROUP_ID
                            };
                            await httpsRequest('https://api.vk.com/method/messages.send', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                body: new URLSearchParams(params).toString()
                            });
                        }
                    })
                    .catch(err => console.error('[AI-COMMAND] JSON block creation failed:', err));
                // Удаляем этот блок из текста для пользователя
                modifiedText = modifiedText.replace(match[0], '').trim();
            }
        } catch (e) {
            // Игнорируем блоки, которые не являются валидным JSON для товара
        }
    }

    return modifiedText;
}

async function callYandexGPT(prompt, modelName = 'yandexgpt', systemText = 'Ты — полезный ассистент.') {
    const folderId = process.env.YC_FOLDER_ID;

    if (!folderId) {
        throw new Error('YC_FOLDER_ID not configured');
    }

    console.log('[YANDEX-GPT] Sending request to Yandex AI...');

    const response = await httpsRequest('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getYandexAuthHeader()
        },
        body: JSON.stringify({
            modelUri: `gpt://${folderId}/${modelName}/latest`,
            completionOptions: {
                stream: false,
                temperature: 0.7,
                maxTokens: 2000
            },
            messages: [
                { role: 'system', text: systemText },
                { role: 'user', text: prompt }
            ]
        })
    });

    if (response.statusCode !== 200) {
        console.error(`[YANDEX-GPT] API Error: ${response.statusCode}`, response.data);
        throw new Error(`Yandex GPT error: ${response.statusCode}`);
    }

    const data = JSON.parse(response.data);
    const content = data.result.alternatives[0].message.text;

    console.log('[YANDEX-GPT] Response received, length:', content.length);

    return {
        content: content,
        tokens: data.result.usage.totalTokens
    };
}

async function handleTelegramWebhook(body, headers) {
    try {
        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

        if (!TELEGRAM_BOT_TOKEN) {
            console.error('TELEGRAM_BOT_TOKEN not configured');
            return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
        }

        // Обработка команды /start
        if (body.message?.text === '/start') {
            const chatId = body.message.chat.id;
            const firstName = body.message.from?.first_name || 'Клиент';

            const text = `Привет, ${firstName}!\n\nДобро пожаловать в MP.WebStudio — веб-студию, где сайты создаёт искусственный интеллект.\n\nВыберите действие:`;

            const keyboard = {
                inline_keyboard: [
                    [{ text: 'Перейти на сайт', url: 'https://mp-webstudio.ru' }]
                ]
            };

            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                    reply_markup: keyboard
                })
            });
        }

        return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    } catch (error) {
        console.error('Telegram webhook error:', error.message);
        return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }
}

// ============ YDB Operations ============

async function createOrderInYdb(orderData) {
    const driver = await getYdbDriver();
    const orderId = generateOrderId();
    const now = new Date().toISOString();

    // Валидация входных данных
    const clientName = String(orderData.clientName || '').trim();
    const clientEmail = String(orderData.clientEmail || '').trim();
    const clientPhone = String(orderData.clientPhone || '').trim();
    const projectType = String(orderData.projectType || '').trim();
    const projectDescription = String(orderData.projectDescription || '').trim();
    const amount = String(orderData.amount || '0').trim();
    const totalAmount = String(orderData.totalAmount || amount).trim();
    const selectedFeatures = String(orderData.selectedFeatures || '').trim();
    const status = String(orderData.status || 'pending').trim();
    const paymentMethod = String(orderData.paymentMethod || 'card').trim();
    const companyName = String(orderData.companyName || '').trim();
    const companyInn = String(orderData.companyInn || '').trim();
    const companyKpp = String(orderData.companyKpp || '').trim();
    const companyAddress = String(orderData.companyAddress || '').trim();

    if (!clientName || !clientEmail) {
        throw new Error('clientName and clientEmail are required');
    }

    await driver.tableClient.withSession(async (session) => {
        const queryText = `
            DECLARE $id AS Utf8;
            DECLARE $client_name AS Utf8;
            DECLARE $client_email AS Utf8;
            DECLARE $client_phone AS Utf8;
            DECLARE $project_type AS Utf8;
            DECLARE $project_description AS Utf8;
            DECLARE $amount AS Utf8;
            DECLARE $total_amount AS Utf8;
            DECLARE $selected_features AS Utf8;
            DECLARE $status AS Utf8;
            DECLARE $created_at AS Utf8;
            DECLARE $payment_method AS Utf8;
            DECLARE $company_name AS Utf8;
            DECLARE $company_inn AS Utf8;
            DECLARE $company_kpp AS Utf8;
            DECLARE $company_address AS Utf8;

            UPSERT INTO orders (id, client_name, client_email, client_phone, project_type, project_description, amount, total_amount, selected_features, status, created_at, payment_method, company_name, company_inn, company_kpp, company_address)
            VALUES ($id, $client_name, $client_email, $client_phone, $project_type, $project_description, $amount, $total_amount, $selected_features, $status, $created_at, $payment_method, $company_name, $company_inn, $company_kpp, $company_address);
        `;

        const preparedQuery = await session.prepareQuery(queryText);

        await session.executeQuery(preparedQuery, {
            '$id': TypedValues.utf8(orderId),
            '$client_name': TypedValues.utf8(clientName),
            '$client_email': TypedValues.utf8(clientEmail),
            '$client_phone': TypedValues.utf8(clientPhone),
            '$project_type': TypedValues.utf8(projectType),
            '$project_description': TypedValues.utf8(projectDescription),
            '$amount': TypedValues.utf8(amount),
            '$total_amount': TypedValues.utf8(totalAmount),
            '$selected_features': TypedValues.utf8(selectedFeatures),
            '$status': TypedValues.utf8(status),
            '$created_at': TypedValues.utf8(now),
            '$payment_method': TypedValues.utf8(paymentMethod),
            '$company_name': TypedValues.utf8(companyName),
            '$company_inn': TypedValues.utf8(companyInn),
            '$company_kpp': TypedValues.utf8(companyKpp),
            '$company_address': TypedValues.utf8(companyAddress),
        });
    });

    console.log('Order created in YDB:', orderId);
    return orderId;
}

async function getOrderFromYdb(orderId) {
    const driver = await getYdbDriver();
    let order = null;

    await driver.tableClient.withSession(async (session) => {
        const queryText = `
            DECLARE $id AS Utf8;
            SELECT *
            FROM orders
            WHERE id = $id;
        `;

        const preparedQuery = await session.prepareQuery(queryText);

        const result = await session.executeQuery(preparedQuery, {
            '$id': TypedValues.utf8(orderId),
        });

        console.log('YDB raw result:', JSON.stringify(result, null, 2));

        if (result.resultSets && result.resultSets.length > 0) {
            const resultSet = result.resultSets[0];
            const rows = resultSet.rows || [];
            const columns = resultSet.columns || [];

            console.log('YDB rows count:', rows.length);
            console.log('YDB columns:', JSON.stringify(columns.map(c => c.name)));

            if (rows.length > 0) {
                const row = rows[0];
                console.log('YDB row structure:', JSON.stringify(row, null, 2));

                // Строим маппинг имени колонки -> индекс
                const columnMap = {};
                columns.forEach((col, idx) => {
                    columnMap[col.name] = idx;
                });
                console.log('Column mapping:', JSON.stringify(columnMap));

                // YDB SDK возвращает данные как массив items
                if (row.items && Array.isArray(row.items)) {
                    // Логируем каждый элемент для отладки
                    row.items.forEach((item, idx) => {
                        const colName = columns[idx] ? columns[idx].name : `unknown_${idx}`;
                        const value = getStringValue(item);
                        console.log(`  Column [${idx}] ${colName}: ${JSON.stringify(item)} -> "${value}"`);
                    });

                    // Извлекаем значения по имени колонки
                    const getValue = (colName) => {
                        const idx = columnMap[colName];
                        if (idx !== undefined && row.items[idx]) {
                            return getStringValue(row.items[idx]);
                        }
                        return '';
                    };

                    order = {
                        id: getValue('id'),
                        clientName: getValue('client_name'),
                        clientEmail: getValue('client_email'),
                        clientPhone: getValue('client_phone'),
                        projectType: getValue('project_type'),
                        projectDescription: getValue('project_description'),
                        amount: getValue('amount'),
                        status: getValue('status'),
                        createdAt: getValue('created_at'),
                        paidAt: getValue('paid_at'),
                        paymentMethod: getValue('payment_method') || 'card',
                        companyName: getValue('company_name'),
                        companyInn: getValue('company_inn'),
                        companyKpp: getValue('company_kpp'),
                        companyAddress: getValue('company_address'),
                        totalAmount: getValue('total_amount'),
                        selectedFeatures: getValue('selected_features'),
                        prepaymentConfirmedAt: getValue('prepayment_confirmed_at'),
                        remainingInvoiceSentAt: getValue('remaining_invoice_sent_at'),
                        remainingConfirmedAt: getValue('remaining_confirmed_at'),
                        internalNote: getValue('internal_note'),
                    };
                } else {
                    // Формат с именованными полями (на всякий случай)
                    order = {
                        id: getStringValue(row.id),
                        clientName: getStringValue(row.client_name),
                        clientEmail: getStringValue(row.client_email),
                        clientPhone: getStringValue(row.client_phone),
                        projectType: getStringValue(row.project_type),
                        projectDescription: getStringValue(row.project_description),
                        amount: getStringValue(row.amount),
                        status: getStringValue(row.status),
                        createdAt: getStringValue(row.created_at),
                        paidAt: getStringValue(row.paid_at),
                        paymentMethod: getStringValue(row.payment_method) || 'card',
                        companyName: getStringValue(row.company_name),
                        companyInn: getStringValue(row.company_inn),
                        companyKpp: getStringValue(row.company_kpp),
                        companyAddress: getStringValue(row.company_address),
                        totalAmount: getStringValue(row.total_amount),
                        selectedFeatures: getStringValue(row.selected_features),
                        prepaymentConfirmedAt: getStringValue(row.prepayment_confirmed_at),
                        remainingInvoiceSentAt: getStringValue(row.remaining_invoice_sent_at),
                        remainingConfirmedAt: getStringValue(row.remaining_confirmed_at),
                        internalNote: getStringValue(row.internal_note),
                    };
                }

                console.log('Parsed order:', JSON.stringify(order));
            }
        }
    });

    console.log('Order fetched from YDB:', JSON.stringify(order));
    return order;
}

// ============ Additional Invoices YDB Functions ============

async function saveAdditionalInvoiceToYdb(invoiceId, orderId, description, amount, status = 'pending') {
    const driver = await getYdbDriver();
    const now = new Date().toISOString();

    await driver.tableClient.withSession(async (session) => {
        const queryText = `
            DECLARE $id AS Utf8;
            DECLARE $order_id AS Utf8;
            DECLARE $description AS Utf8;
            DECLARE $amount AS Utf8;
            DECLARE $status AS Utf8;
            DECLARE $paid_at AS Utf8;

            UPSERT INTO additional_invoices (id, order_id, description, amount, status, paid_at)
            VALUES ($id, $order_id, $description, $amount, $status, $paid_at);
        `;

        const preparedQuery = await session.prepareQuery(queryText);

        await session.executeQuery(preparedQuery, {
            '$id': TypedValues.utf8(invoiceId),
            '$order_id': TypedValues.utf8(orderId),
            '$description': TypedValues.utf8(description || 'Дополнительные услуги'),
            '$amount': TypedValues.utf8(String(amount)),
            '$status': TypedValues.utf8(status),
            '$paid_at': TypedValues.utf8(status === 'paid' ? now : ''),
        });
    });

    console.log('Additional invoice saved to YDB:', invoiceId, 'status:', status);
}

async function updateAdditionalInvoiceStatusInYdb(invoiceId, status) {
    const driver = await getYdbDriver();
    const now = new Date().toISOString();

    await driver.tableClient.withSession(async (session) => {
        const queryText = `
            DECLARE $id AS Utf8;
            DECLARE $status AS Utf8;
            DECLARE $paid_at AS Utf8;

            UPDATE additional_invoices
            SET status = $status, paid_at = $paid_at
            WHERE id = $id;
        `;

        const preparedQuery = await session.prepareQuery(queryText);

        await session.executeQuery(preparedQuery, {
            '$id': TypedValues.utf8(invoiceId),
            '$status': TypedValues.utf8(status),
            '$paid_at': TypedValues.utf8(status === 'paid' ? now : ''),
        });
    });

    console.log('Additional invoice status updated in YDB:', invoiceId, 'to:', status);
}

async function getAdditionalInvoicesFromYdb(orderId) {
    const driver = await getYdbDriver();
    const invoices = [];

    await driver.tableClient.withSession(async (session) => {
        const queryText = `
            DECLARE $order_id AS Utf8;
            SELECT *
            FROM additional_invoices
            WHERE order_id = $order_id AND status = 'paid';
        `;

        const preparedQuery = await session.prepareQuery(queryText);

        const result = await session.executeQuery(preparedQuery, {
            '$order_id': TypedValues.utf8(orderId),
        });

        if (result.resultSets && result.resultSets.length > 0) {
            const resultSet = result.resultSets[0];
            const rows = resultSet.rows || [];
            const columns = resultSet.columns || [];

            const columnMap = {};
            columns.forEach((col, idx) => {
                columnMap[col.name] = idx;
            });

            rows.forEach(row => {
                if (row.items && Array.isArray(row.items)) {
                    const getValue = (colName) => {
                        const idx = columnMap[colName];
                        if (idx !== undefined && row.items[idx]) {
                            return getStringValue(row.items[idx]);
                        }
                        return '';
                    };

                    invoices.push({
                        id: getValue('id'),
                        orderId: getValue('order_id'),
                        description: getValue('description'),
                        amount: getValue('amount'),
                        status: getValue('status'),
                        paidAt: getValue('paid_at'),
                    });
                }
            });
        }
    });

    console.log('Additional invoices fetched from YDB:', invoices.length);
    return invoices;
}

function getStringValue(field) {
    if (field === null || field === undefined) return '';
    if (typeof field === 'string') return field;
    if (typeof field === 'number') return String(field);
    if (typeof field === 'boolean') return String(field);

    // YDB SDK возвращает специальные объекты с геттерами
    // Нормализуем через JSON для получения обычного объекта
    let normalizedField;
    try {
        normalizedField = JSON.parse(JSON.stringify(field));
    } catch (e) {
        normalizedField = field;
    }

    // Проверяем null значение
    if (normalizedField.nullFlagValue !== undefined) return '';

    // Прямое textValue (основной формат YDB для UTF8)
    if (normalizedField.textValue !== undefined && normalizedField.textValue !== null) {
        return String(normalizedField.textValue);
    }

    // UTF8 значение
    if (normalizedField.utf8Value !== undefined && normalizedField.utf8Value !== null) {
        return String(normalizedField.utf8Value);
    }

    // stringValue
    if (normalizedField.stringValue !== undefined && normalizedField.stringValue !== null) {
        return String(normalizedField.stringValue);
    }

    // int32Value / int64Value / uint64Value
    if (normalizedField.int32Value !== undefined) return String(normalizedField.int32Value);
    if (normalizedField.int64Value !== undefined) return String(normalizedField.int64Value);
    if (normalizedField.uint64Value !== undefined) return String(normalizedField.uint64Value);

    // doubleValue / floatValue
    if (normalizedField.doubleValue !== undefined) return String(normalizedField.doubleValue);
    if (normalizedField.floatValue !== undefined) return String(normalizedField.floatValue);

    // Вложенный value (для опциональных типов)
    if (normalizedField.value !== undefined && normalizedField.value !== null) {
        return getStringValue(normalizedField.value);
    }

    // bytesValue
    if (normalizedField.bytesValue !== undefined) {
        if (Buffer.isBuffer(normalizedField.bytesValue)) {
            return normalizedField.bytesValue.toString('utf-8');
        }
        if (typeof normalizedField.bytesValue === 'string') {
            try {
                return Buffer.from(normalizedField.bytesValue, 'base64').toString('utf-8');
            } catch (e) {
                return normalizedField.bytesValue;
            }
        }
        return String(normalizedField.bytesValue);
    }

    // text
    if (normalizedField.text !== undefined) return String(normalizedField.text);

    // Если это Buffer напрямую
    if (Buffer.isBuffer(field)) return field.toString('utf-8');

    // Попробуем взять первый не-null ключ со значением
    const keys = Object.keys(normalizedField);
    for (const key of keys) {
        if (key.endsWith('Value') && normalizedField[key] !== undefined && normalizedField[key] !== null) {
            return String(normalizedField[key]);
        }
    }

    // Для отладки
    console.log('Unknown field format, keys:', keys, 'value:', JSON.stringify(normalizedField));
    return '';
}

async function updateOrderStatusInYdb(orderId, status) {
    const driver = await getYdbDriver();
    const now = new Date().toISOString();

    await driver.tableClient.withSession(async (session) => {
        const queryText = `
            DECLARE $id AS Utf8;
            DECLARE $status AS Utf8;
            DECLARE $paid_at AS Utf8;

            UPDATE orders
            SET status = $status, paid_at = $paid_at
            WHERE id = $id;
        `;

        const preparedQuery = await session.prepareQuery(queryText);

        await session.executeQuery(preparedQuery, {
            '$id': TypedValues.utf8(orderId),
            '$status': TypedValues.utf8(status),
            '$paid_at': TypedValues.utf8(now),
        });
    });

    console.log('Order status updated in YDB:', orderId, '->', status);
}

function generateOrderId() {
    return 'ord_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// ============ Handlers ============

async function handleContact(data, headers) {
    try {
        await sendTelegramNotification(formatContactMessage(data));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, message: 'Заявка отправлена' }),
        };
    } catch (error) {
        console.error('Error handling contact:', error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, message: 'Ошибка отправки' }),
        };
    }
}

async function handleOrder(data, headers) {
    try {
        // Валидация
        if (!data.clientName || !data.clientEmail) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ success: false, message: 'Имя и email обязательны' }),
            };
        }

        const orderId = await createOrderInYdb(data);

        await sendTelegramNotification(formatOrderMessage({
            id: orderId,
            clientName: data.clientName,
            clientEmail: data.clientEmail,
            clientPhone: data.clientPhone,
            projectType: data.projectType,
            projectDescription: data.projectDescription || '',
            amount: data.amount,
        }));

        const orderDataForUrl = { projectType: data.projectType };
        const paymentUrl = generateRobokassaUrl(orderId, data.amount, orderDataForUrl);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                orderId: orderId,
                paymentUrl: paymentUrl,
                message: 'Заказ создан' 
            }),
        };
    } catch (error) {
        console.error('Error creating order:', error.message, error.stack);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, message: 'Ошибка создания заказа', error: error.message }),
        };
    }
}

function generateRobokassaSignature(merchantLogin, sum, invId, password, shpOrderId, receipt) {
    const signatureString = receipt 
        ? `${merchantLogin}:${sum}:${invId}:${receipt}:${password}:shp_orderId=${shpOrderId}`
        : `${merchantLogin}:${sum}:${invId}:${password}:shp_orderId=${shpOrderId}`;
    return crypto.createHash('md5').update(signatureString).digest('hex');
}

function generateRobokassaUrl(orderId, amount, order) {
    const merchantLogin = process.env.ROBOKASSA_MERCHANT_LOGIN;
    const password1 = process.env.ROBOKASSA_PASSWORD1;
    const isTestMode = process.env.ROBOKASSA_TEST_MODE === 'true';

    if (!merchantLogin || !password1) {
        console.error('Robokassa not configured');
        return null;
    }

    const numericAmount = parseFloat(amount) || 0;
    if (numericAmount <= 0) {
        console.error('Invalid amount:', amount);
        return null;
    }

    const invId = Date.now() % 1000000;
    
    // Номенклатура для чека
    const receipt = {
        items: [
            {
                name: `Оплата услуг по разработке сайта: ${order?.projectType || 'Услуги'}`,
                quantity: 1,
                sum: numericAmount,
                payment_method: 'full_prepayment',
                payment_object: 'service',
                tax: 'none'
            }
        ]
    };
    const receiptBase64 = encodeURIComponent(JSON.stringify(receipt));

    const signature = generateRobokassaSignature(merchantLogin, numericAmount, invId, password1, orderId, receiptBase64);

    const baseUrl = 'https://auth.robokassa.ru/Merchant/Index.aspx';

    const params = new URLSearchParams({
        MerchantLogin: merchantLogin,
        OutSum: numericAmount,
        InvId: invId,
        Description: 'Оплата услуг по разработке сайта',
        SignatureValue: signature,
        Receipt: receiptBase64,
        shp_orderId: orderId,
        IsTest: isTestMode ? '1' : '0',
        Email: order?.clientEmail || '',
    });

    return `${baseUrl}?${params.toString()}`;
}

async function handleRobokassaResult(data, headers) {
    console.log('Robokassa result - full data:', JSON.stringify(data));

    const OutSum = data.OutSum;
    const InvId = data.InvId;
    const SignatureValue = data.SignatureValue;
    const shp_orderId = data.shp_orderId;

    console.log('Robokassa result callback:', { OutSum, InvId, shp_orderId });

    if (!OutSum || !InvId || !SignatureValue) {
        console.error('Missing required Robokassa parameters');
        return { statusCode: 400, headers: { 'Content-Type': 'text/plain' }, body: 'missing params' };
    }

    const PASSWORD2 = process.env.ROBOKASSA_PASSWORD2;

    if (!PASSWORD2) {
        console.error('ROBOKASSA_PASSWORD2 not configured');
        return { statusCode: 500, headers: { 'Content-Type': 'text/plain' }, body: 'config error' };
    }

    const signatureString = `${OutSum}:${InvId}:${PASSWORD2}:shp_orderId=${shp_orderId}`;
    const calculatedSignature = crypto.createHash('md5').update(signatureString).digest('hex');

    console.log('Signature check:', { 
        expected: calculatedSignature.toLowerCase(), 
        received: SignatureValue.toLowerCase() 
    });

    if (calculatedSignature.toLowerCase() !== SignatureValue.toLowerCase()) {
        console.error('Invalid Robokassa signature');
        return { statusCode: 400, headers: { 'Content-Type': 'text/plain' }, body: 'bad sign' };
    }

    // Проверяем, это оплата дополнительного счёта или основного заказа
    const isAdditionalInvoicePayment = shp_orderId.startsWith('addinv_');

    if (isAdditionalInvoicePayment) {
        // Это оплата дополнительного счёта
        console.log('Processing additional invoice payment:', shp_orderId);

        // Извлекаем orderId из addinv_{orderIdSuffix}_{timestamp}
        // Пример: addinv_mjcv3hwa54rerggqx_lxyz123
        const parts = shp_orderId.split('_');
        // parts[0] = "addinv", parts[1] = "orderIdSuffix", parts[2] = "timestamp"
        const realOrderId = parts.length >= 2 ? `ord_${parts[1]}` : null;

        console.log('Extracted order ID from additional invoice:', realOrderId);

        let order = null;
        try {
            if (realOrderId) {
                order = await getOrderFromYdb(realOrderId);
                console.log('Order for additional invoice:', order);
            }
        } catch (error) {
            console.error('Error fetching order for additional invoice:', error.message);
        }

        // Обновляем статус счёта на "paid" в YDB (описание уже сохранено при создании)
        try {
            await updateAdditionalInvoiceStatusInYdb(shp_orderId, 'paid');
            console.log('Additional invoice status updated to paid in YDB');
        } catch (saveError) {
            console.error('Error updating additional invoice status in YDB:', saveError.message);
        }

        // Отправляем уведомление в Telegram
        if (order) {
            await sendTelegramNotification(`💳 Оплачен дополнительный счёт!
👤 Клиент: ${order.clientName}
📧 Email: ${order.clientEmail}
💰 Сумма: ${OutSum} ₽
📋 Заказ: ${realOrderId ? realOrderId.toUpperCase() : shp_orderId}

Статус основного заказа: ${order.status === 'paid' ? 'Предоплата получена' : order.status === 'completed' ? 'Завершён' : 'Ожидает оплаты'}`);

            // Отправляем email клиенту об оплате дополнительной услуги
            try {
                await sendAdditionalInvoiceEmail(order, OutSum, shp_orderId);
                console.log('Additional invoice email sent to:', order.clientEmail);
            } catch (emailError) {
                console.error('Failed to send additional invoice email:', emailError.message);
            }
        } else {
            await sendTelegramNotification(`💳 Оплачен дополнительный счёт!
💰 Сумма: ${OutSum} ₽
🆔 ID: ${shp_orderId}

(Данные заказа не найдены)`);
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'text/plain' },
            body: `OK${InvId}`,
        };
    }

    // Это оплата основного заказа (предоплата или остаток)
    let order = null;
    let isPrepayment = false;
    let additionalInvoices = [];
    try {
        order = await getOrderFromYdb(shp_orderId);
        console.log('Order fetched from YDB:', order);

        if (order) {
            if (order.status === 'paid') {
                await updateOrderStatusInYdb(shp_orderId, 'completed');
                console.log('Order fully paid (remaining):', shp_orderId);
                isPrepayment = false;
            } else {
                await updateOrderStatusInYdb(shp_orderId, 'paid');
                console.log('Order prepaid:', shp_orderId);
                isPrepayment = true;
            }
        }
    } catch (error) {
        console.error('Error fetching/updating order from YDB:', error.message, error.stack);
    }

    // Отправляем документы на email в зависимости от типа оплаты
    if (order && order.clientEmail) {
        if (isPrepayment) {
            // Предоплата - отправляем договор
            try {
                console.log('Generating contract PDF for order:', order.id);
                const pdfBuffer = await generateContractPDF(order);
                console.log('Contract PDF generated, size:', pdfBuffer.length);

                await sendContractEmail(order, pdfBuffer);
                console.log('Contract email sent to:', order.clientEmail);
            } catch (emailError) {
                console.error('Failed to send contract email:', emailError.message, emailError.stack);
            }

            // Формируем ссылку для оплаты остатка
            const payRemainingLink = `${SITE_URL}/pay-remaining?orderId=${shp_orderId}`;
            const prepaymentPercent = order.prepaymentPercent || 50;

            await sendTelegramNotification(`Получена предоплата!
👤 Клиент: ${order.clientName}
📧 Email: ${order.clientEmail}
📱 Телефон: ${order.clientPhone}
🌐 Тип: ${getProjectTypeName(order.projectType)}
💰 Сумма: ${OutSum} ₽ (${prepaymentPercent}%)
📋 Заказ: ${shp_orderId.toUpperCase()}
🔗 Ссылка для оплаты остатка:
${payRemainingLink}

Договор отправлен клиенту на email.`);
        } else {
            // Полная оплата - отправляем акт выполненных работ
            try {
                console.log('Generating completion act PDF for order:', order.id);

                // Получаем список всех оплаченных дополнительных счётов из YDB
                try {
                    console.log('Fetching additional invoices from YDB for order:', shp_orderId);
                    additionalInvoices = await getAdditionalInvoicesFromYdb(shp_orderId);
                    console.log('Additional invoices fetched from YDB:', additionalInvoices.length);
                } catch (fetchError) {
                    console.error('Error fetching additional invoices from YDB:', fetchError.message);
                }

                const pdfBuffer = await generateCompletionActPDF(order, additionalInvoices);
                console.log('Completion act PDF generated, size:', pdfBuffer.length);

                await sendCompletionActEmail(order, pdfBuffer);
                console.log('Completion act email sent to:', order.clientEmail);
            } catch (emailError) {
                console.error('Failed to send completion act email:', emailError.message, emailError.stack);
            }

            // Формируем сообщение о дополнительных счётах
            let additionalInvoicesMessage = '';
            if (additionalInvoices && additionalInvoices.length > 0) {
                const paidAdditional = additionalInvoices.filter(inv => inv.status === 'paid');
                if (paidAdditional.length > 0) {
                    additionalInvoicesMessage = '\n\n💳 <b>Дополнительные работы:</b>\n';
                    paidAdditional.forEach(inv => {
                        additionalInvoicesMessage += `• ${inv.description} - ${inv.amount} ₽\n`;
                    });
                }
            }

            await sendTelegramNotification(`Заказ полностью оплачен!
👤 Клиент: ${order.clientName}
📧 Email: ${order.clientEmail}
📱 Телефон: ${order.clientPhone}
🌐 Тип: ${getProjectTypeName(order.projectType)}
💰 Сумма: ${OutSum} ₽ (остаток)
📋 Заказ: ${shp_orderId.toUpperCase()}${additionalInvoicesMessage}

Акт выполненных работ отправлен клиенту.

⚠️ ВАЖНО: Отправьте клиенту данные доступа к сайту!
(URL админки, логин, пароль)`);
        }
    } else {
        await sendTelegramNotification(`
Оплата получена!

Заказ: ${shp_orderId}
Сумма: ${OutSum} руб.

(Данные клиента не найдены в базе YDB)
        `);
    }

    console.log('Order paid successfully:', shp_orderId);

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/plain' },
        body: `OK${InvId}`,
    };
}

function handleRobokassaSuccess(query) {
    const orderId = query.shp_orderId || '';

    return {
        statusCode: 302,
        headers: { 'Location': `${SITE_URL}/payment-success?orderId=${orderId}` },
        body: '',
    };
}

function handleRobokassaFail(query) {
    const orderId = query.shp_orderId || '';

    return {
        statusCode: 302,
        headers: { 'Location': `${SITE_URL}/payment-fail?orderId=${orderId}` },
        body: '',
    };
}

async function handleGetOrder(orderId, headers) {
    if (!orderId) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Не указан номер заказа' }),
        };
    }

    try {
        const order = await getOrderFromYdb(orderId);

        if (!order) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Заказ не найден' }),
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(order),
        };
    } catch (error) {
        console.error('Error fetching order:', error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Ошибка получения заказа' }),
        };
    }
}

// GET /api/orders - получить список всех заказов
async function handleListOrders(query, headers) {
    try {
        const showDeleted = query.all === 'true';
        const orders = await getAllOrdersFromYdb(showDeleted);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(orders),
        };
    } catch (error) {
        console.error('Error listing orders:', error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Ошибка получения списка заказов' }),
        };
    }
}

// GET ?action=client-orders&email=... - заказы клиента по email (для Telegram Mini App)
async function handleClientOrders(query, headers) {
    try {
        const email = (query.email || '').trim().toLowerCase();

        if (!email) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ success: false, message: 'Email обязателен' }),
            };
        }

        const allOrders = await getAllOrdersFromYdb(false);

        const clientOrders = allOrders.filter(order => 
            order.clientEmail && order.clientEmail.toLowerCase() === email
        );

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                orders: clientOrders,
                count: clientOrders.length 
            }),
        };
    } catch (error) {
        console.error('Error fetching client orders:', error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, error: 'Ошибка получения заказов' }),
        };
    }
}

// DELETE /api/orders/:orderId - мягкое удаление заказа
async function handleDeleteOrder(orderId, headers) {
    try {
        await softDeleteOrderInYdb(orderId);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, message: 'Заказ удалён' }),
        };
    } catch (error) {
        console.error('Error deleting order:', error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, error: 'Ошибка удаления заказа' }),
        };
    }
}

// PATCH /api/orders/:orderId/note - обновить заметку
async function handleUpdateOrderNote(orderId, note, headers) {
    try {
        await updateOrderNoteInYdb(orderId, note);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, message: 'Заметка обновлена' }),
        };
    } catch (error) {
        console.error('Error updating order note:', error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, error: 'Ошибка обновления заметки' }),
        };
    }
}

// Мягкое удаление заказа в YDB
async function softDeleteOrderInYdb(orderId) {
    const driver = await getYdbDriver();
    const now = new Date().toISOString();

    await driver.tableClient.withSession(async (session) => {
        const queryText = `
            DECLARE $id AS Utf8;
            DECLARE $deleted_at AS Utf8;

            UPDATE orders
            SET deleted_at = $deleted_at
            WHERE id = $id;
        `;

        const preparedQuery = await session.prepareQuery(queryText);
        await session.executeQuery(preparedQuery, {
            '$id': TypedValues.utf8(orderId),
            '$deleted_at': TypedValues.utf8(now),
        });
    });

    console.log('Order soft deleted:', orderId);
}

// Обновление заметки заказа в YDB
async function updateOrderNoteInYdb(orderId, note) {
    const driver = await getYdbDriver();

    await driver.tableClient.withSession(async (session) => {
        const queryText = `
            DECLARE $id AS Utf8;
            DECLARE $internal_note AS Utf8;

            UPDATE orders
            SET internal_note = $internal_note
            WHERE id = $id;
        `;

        const preparedQuery = await session.prepareQuery(queryText);
        await session.executeQuery(preparedQuery, {
            '$id': TypedValues.utf8(orderId),
            '$internal_note': TypedValues.utf8(note || ''),
        });
    });

    console.log('Order note updated:', orderId);
}

// Получение всех заказов из YDB
async function getAllOrdersFromYdb(includeDeleted = false) {
    const driver = await getYdbDriver();
    let orders = [];

    await driver.tableClient.withSession(async (session) => {
        let queryText;
        if (includeDeleted) {
            queryText = `SELECT * FROM orders ORDER BY created_at DESC;`;
        } else {
            queryText = `SELECT * FROM orders WHERE deleted_at IS NULL OR deleted_at = '' ORDER BY created_at DESC;`;
        }

        const result = await session.executeQuery(queryText);

        if (result.resultSets && result.resultSets.length > 0) {
            const resultSet = result.resultSets[0];
            const rows = resultSet.rows || [];
            const columns = resultSet.columns || [];

            // Строим маппинг имени колонки -> индекс
            const columnMap = {};
            columns.forEach((col, idx) => {
                columnMap[col.name] = idx;
            });

            orders = rows.map(row => {
                if (!row.items || !Array.isArray(row.items)) {
                    return null;
                }

                // Извлекаем значения по имени колонки
                const getValue = (colName) => {
                    const idx = columnMap[colName];
                    if (idx !== undefined && row.items[idx]) {
                        return getStringValue(row.items[idx]);
                    }
                    return '';
                };

                return {
                    id: getValue('id'),
                    clientName: getValue('client_name'),
                    clientEmail: getValue('client_email'),
                    clientPhone: getValue('client_phone'),
                    projectType: getValue('project_type'),
                    projectDescription: getValue('project_description'),
                    amount: getValue('amount'),
                    status: getValue('status'),
                    createdAt: getValue('created_at'),
                    paidAt: getValue('paid_at'),
                    invId: getValue('inv_id'),
                    internalNote: getValue('internal_note'),
                    deletedAt: getValue('deleted_at'),
                    paymentMethod: getValue('payment_method') || 'card',
                    companyName: getValue('company_name'),
                    companyInn: getValue('company_inn'),
                    companyKpp: getValue('company_kpp'),
                    companyAddress: getValue('company_address'),
                    totalAmount: getValue('total_amount'),
                    selectedFeatures: getValue('selected_features'),
                    prepaymentConfirmedAt: getValue('prepayment_confirmed_at'),
                    remainingInvoiceSentAt: getValue('remaining_invoice_sent_at'),
                    remainingConfirmedAt: getValue('remaining_confirmed_at'),
                };
            }).filter(Boolean);
        }
    });

    return orders;
}

async function handlePayRemaining(data, headers) {
    const { orderId } = data;

    if (!orderId) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, message: 'Не указан номер заказа' }),
        };
    }

    let order = null;
    try {
        order = await getOrderFromYdb(orderId);
    } catch (error) {
        console.error('Error fetching order from YDB:', error.message);
    }

    if (!order) {
        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, message: 'Заказ не найден' }),
        };
    }

    if (order.status === 'completed') {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, message: 'Заказ уже полностью оплачен' }),
        };
    }

    if (order.status !== 'paid') {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, message: 'Предоплата по заказу не подтверждена' }),
        };
    }

    const remainingAmount = (parseFloat(order.totalAmount || order.amount) - parseFloat(order.amount));
    const paymentUrl = generateRemainingPaymentUrl(orderId, remainingAmount, order);

    if (!paymentUrl) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, message: 'Ошибка формирования ссылки на оплату' }),
        };
    }

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            success: true,
            message: 'Ссылка на оплату сформирована',
            orderId: order.id,
            amount: remainingAmount.toString(),
            paymentUrl,
        }),
    };
}

function generateRemainingPaymentUrl(orderId, amount, order) {
    const merchantLogin = process.env.ROBOKASSA_MERCHANT_LOGIN;
    const password1 = process.env.ROBOKASSA_PASSWORD1;
    const isTestMode = process.env.ROBOKASSA_TEST_MODE === 'true';

    if (!merchantLogin || !password1) {
        console.error('Robokassa not configured');
        return null;
    }

    const numericAmount = parseFloat(amount) || 0;
    if (numericAmount <= 0) {
        console.error('Invalid amount:', amount);
        return null;
    }

    const invId = Date.now() % 1000000;

    // Номенклатура для чека (остаток)
    const receipt = {
        items: [
            {
                name: `Оплата остатка за разработку сайта: ${order?.projectType || 'Услуги'}`,
                quantity: 1,
                sum: numericAmount,
                payment_method: 'full_payment',
                payment_object: 'service',
                tax: 'none'
            }
        ]
    };
    const receiptBase64 = encodeURIComponent(JSON.stringify(receipt));

    const signature = generateRobokassaSignature(merchantLogin, numericAmount, invId, password1, orderId, receiptBase64);

    const baseUrl = 'https://auth.robokassa.ru/Merchant/Index.aspx';

    const params = new URLSearchParams({
        MerchantLogin: merchantLogin,
        OutSum: numericAmount.toString(),
        InvId: invId.toString(),
        Description: 'Оплата услуг по разработке сайта (остаток)',
        SignatureValue: signature,
        Receipt: receiptBase64,
        shp_orderId: orderId,
        IsTest: isTestMode ? '1' : '0',
        Email: order?.clientEmail || '',
    });

    return `${baseUrl}?${params.toString()}`;
}

async function handleAdditionalInvoice(data, headers) {
    const { orderId, amount, description } = data;

    if (!orderId || !amount) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, message: 'Требуются orderId и amount' }),
        };
    }

    // Нормализуем ID: убираем префикс ORD_ и переводим в нижний регистр
    let normalizedOrderId = orderId;
    if (orderId.toUpperCase().startsWith('ORD_')) {
        normalizedOrderId = orderId.substring(4); // убираем 'ORD_'
    }
    normalizedOrderId = 'ord_' + normalizedOrderId.toLowerCase();

    console.log('Original orderId:', orderId);
    console.log('Normalized orderId:', normalizedOrderId);

    let order = null;
    try {
        order = await getOrderFromYdb(normalizedOrderId);
    } catch (error) {
        console.error('Error fetching order from YDB:', error.message);
    }

    if (!order) {
        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, message: `Заказ не найден (искал: ${normalizedOrderId})` }),
        };
    }

    const numericAmount = parseFloat(amount) || 0;
    if (numericAmount <= 0) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, message: 'Сумма должна быть больше 0' }),
        };
    }

    const merchantLogin = process.env.ROBOKASSA_MERCHANT_LOGIN;
    const password1 = process.env.ROBOKASSA_PASSWORD1;
    const isTestMode = process.env.ROBOKASSA_TEST_MODE === 'true';

    if (!merchantLogin || !password1) {
        console.error('Robokassa not configured');
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, message: 'Сервис платежей не настроен' }),
        };
    }

    // Санитизируем описание для Robokassa:
    const safeDescription = (description || 'Дополнительные услуги')
        .replace(/\r?\n/g, '; ')
        .replace(/\)\s*/g, '. ')
        .replace(/\(\s*/g, '')
        .replace(/[<>\"\'\\]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 100);

    // Создаём уникальный ID для дополнительного счёта с префиксом addinv_
    const orderIdSuffix = normalizedOrderId.replace('ord_', '');
    const timestampId = Date.now().toString(36);
    const addInvUniqueId = `addinv_${orderIdSuffix}_${timestampId}`;

    const invId = (Date.now() + 2) % 1000000;
    
    // Номенклатура для доп. счёта
    const receipt = {
        items: [
            {
                name: `Оплата доп. услуг: ${safeDescription}`,
                quantity: 1,
                sum: numericAmount,
                payment_method: 'full_prepayment',
                payment_object: 'service',
                tax: 'none'
            }
        ]
    };
    const receiptBase64 = encodeURIComponent(JSON.stringify(receipt));

    const signatureString = `${merchantLogin}:${numericAmount}:${invId}:${receiptBase64}:${password1}:shp_orderId=${addInvUniqueId}`;
    const signature = crypto.createHash('md5').update(signatureString).digest('hex');

    const baseUrl = 'https://auth.robokassa.ru/Merchant/Index.aspx';

    const params = new URLSearchParams({
        MerchantLogin: merchantLogin,
        OutSum: numericAmount.toString(),
        InvId: invId.toString(),
        Description: `Доп. услуги: ${safeDescription}`,
        SignatureValue: signature,
        Receipt: receiptBase64,
        shp_orderId: addInvUniqueId,
        IsTest: isTestMode ? '1' : '0',
    });

    const paymentUrl = `${baseUrl}?${params.toString()}`;

    console.log('Additional invoice payment URL generated:');
    console.log('  MerchantLogin:', merchantLogin);
    console.log('  OutSum:', numericAmount);
    console.log('  InvId:', invId);
    console.log('  Description:', safeDescription);
    console.log('  shp_orderId:', addInvUniqueId);
    console.log('  IsTest:', isTestMode ? '1' : '0');
    console.log('  SignatureString:', signatureString);
    console.log('  Signature:', signature);
    console.log('  Full URL:', paymentUrl);

    // Сохраняем счёт в YDB сразу со статусом pending и реальным описанием
    try {
        await saveAdditionalInvoiceToYdb(addInvUniqueId, normalizedOrderId, description || 'Дополнительные услуги', numericAmount, 'pending');
        console.log('Additional invoice saved to YDB with pending status');
    } catch (saveError) {
        console.error('Error saving additional invoice to YDB:', saveError.message);
        // Продолжаем даже если сохранение не удалось
    }

    try {
        await sendTelegramNotification(`📄 Выставлен дополнительный счет!
👤 Клиент: ${order.clientName}
📧 Email: ${order.clientEmail}
💰 Сумма: ${numericAmount} ₽
📝 Описание: ${description || 'Разработка сайта'}
📋 Заказ: ${orderId}

🔗 Ссылка для оплаты:
${paymentUrl}`);
    } catch (notifyError) {
        console.error('Failed to send Telegram notification:', notifyError.message);
    }

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            success: true,
            message: 'Счет выставлен успешно',
            orderId: normalizedOrderId,
            originalOrderId: orderId,
            amount: numericAmount.toString(),
            paymentUrl,
        }),
    };
}

// ============ Bank Invoice for Legal Entities ============

async function handleBankInvoice(data, headers) {
    try {
        const { 
            clientName, clientEmail, clientPhone, 
            projectType, projectDescription, amount,
            companyName, companyInn, companyKpp, companyAddress,
            selectedFeatures, totalAmount
        } = data;

        // Валидация
        if (!clientName || !clientEmail || !companyName || !companyInn) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    success: false, 
                    message: 'Не заполнены обязательные поля (имя, email, название компании, ИНН)' 
                }),
            };
        }

        // Проверяем банковские реквизиты
        const bankName = process.env.BANK_NAME;
        const bankBik = process.env.BANK_BIK;
        const bankAccount = process.env.BANK_ACCOUNT;

        if (!bankName || !bankBik || !bankAccount) {
            console.error('Bank credentials not configured');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    success: false, 
                    message: 'Банковские реквизиты не настроены. Свяжитесь с администратором.' 
                }),
            };
        }

        // Создаём заказ в YDB
        const orderId = await createOrderInYdb({
            clientName,
            clientEmail,
            clientPhone: clientPhone || '',
            projectType: projectType || 'landing',
            projectDescription: projectDescription || 'Разработка сайта',
            amount: amount || '0',
            totalAmount: totalAmount || amount || '0',
            selectedFeatures: selectedFeatures || '',
            status: 'pending_bank_payment',
            paymentMethod: 'invoice',
            companyName,
            companyInn,
            companyKpp: companyKpp || '',
            companyAddress: companyAddress || '',
        });

        // Получаем номер счёта (используем timestamp + random для уникальности)
        const invoiceNumber = Date.now().toString().slice(-8);

        // Генерируем PDF счёта
        const pdfBuffer = await generateBankInvoicePDF({
            invoiceNumber,
            orderId,
            clientName,
            clientEmail,
            clientPhone,
            companyName,
            companyInn,
            companyKpp,
            companyAddress,
            projectType,
            projectDescription,
            amount: parseFloat(amount) || 0,
            bankName,
            bankBik,
            bankAccount,
            bankCorrAccount: process.env.BANK_CORR_ACCOUNT || '',
        });

        // Отправляем email со счётом
        await sendBankInvoiceEmail({
            clientName,
            clientEmail,
            companyName,
            orderId,
            invoiceNumber,
            amount: parseFloat(amount) || 0,
        }, pdfBuffer);

        // Уведомляем в Telegram
        await sendTelegramNotification(`🏢 Новый заказ с оплатой по счёту!

👤 Контактное лицо: ${clientName}
📧 Email: ${clientEmail}
📱 Телефон: ${clientPhone || 'не указан'}

🏛️ Компания: ${companyName}
🔢 ИНН: ${companyInn}
${companyKpp ? `КПП: ${companyKpp}` : ''}

📋 Проект: ${getProjectTypeName(projectType)}
💰 Сумма: ${new Intl.NumberFormat('ru-RU').format(parseFloat(amount) || 0)} ₽
📄 Счёт №${invoiceNumber} отправлен на email

🆔 ID заказа: ${orderId}`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Счёт создан и отправлен на email',
                orderId,
                invoiceNumber,
            }),
        };

    } catch (error) {
        console.error('Error creating bank invoice:', error.message, error.stack);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                success: false, 
                message: 'Ошибка создания счёта: ' + error.message 
            }),
        };
    }
}

// ============ Confirm Bank Payment ============

async function handleConfirmBankPayment(data, headers) {
    try {
        const { orderId, paymentType } = data; // paymentType: 'prepayment' | 'remaining'

        if (!orderId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ success: false, message: 'orderId обязателен' }),
            };
        }

        const order = await getOrderFromYdb(orderId);
        if (!order) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ success: false, message: 'Заказ не найден' }),
            };
        }

        const driver = await getYdbDriver();
        const now = new Date().toISOString();
        let newStatus = order.status;
        let updateField = '';

        if (paymentType === 'prepayment') {
            newStatus = 'in_progress';
        } else if (paymentType === 'remaining') {
            newStatus = 'completed';
        }

        await driver.tableClient.withSession(async (session) => {
            const queryText = paymentType === 'prepayment' 
                ? `DECLARE $id AS Utf8;
                   DECLARE $status AS Utf8;
                   DECLARE $prepayment_confirmed_at AS Utf8;
                   UPDATE orders SET status = $status, prepayment_confirmed_at = $prepayment_confirmed_at WHERE id = $id;`
                : `DECLARE $id AS Utf8;
                   DECLARE $status AS Utf8;
                   DECLARE $remaining_confirmed_at AS Utf8;
                   DECLARE $paid_at AS Utf8;
                   UPDATE orders SET status = $status, remaining_confirmed_at = $remaining_confirmed_at, paid_at = $paid_at WHERE id = $id;`;

            const preparedQuery = await session.prepareQuery(queryText);

            const params = paymentType === 'prepayment'
                ? {
                    '$id': TypedValues.utf8(orderId),
                    '$status': TypedValues.utf8(newStatus),
                    '$prepayment_confirmed_at': TypedValues.utf8(now),
                }
                : {
                    '$id': TypedValues.utf8(orderId),
                    '$status': TypedValues.utf8(newStatus),
                    '$remaining_confirmed_at': TypedValues.utf8(now),
                    '$paid_at': TypedValues.utf8(now),
                };

            await session.executeQuery(preparedQuery, params);
        });

        // Уведомление в Telegram
        const paymentTypeText = paymentType === 'prepayment' ? 'предоплаты' : 'остатка';
        await sendTelegramNotification(`✅ Подтверждена оплата ${paymentTypeText}!

🆔 Заказ: ${orderId}
👤 Клиент: ${order.clientName}
🏛️ Компания: ${order.companyName || 'Физлицо'}
💰 Статус: ${newStatus === 'in_progress' ? 'В работе' : 'Завершён'}`);

        // Если это оплата остатка — генерируем Акт
        if (paymentType === 'remaining') {
            try {
                const actPdf = await generateCompletionActPDF(order);
                await sendCompletionActEmail(order, actPdf);
            } catch (actError) {
                console.error('Error generating act:', actError.message);
            }
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: `Оплата ${paymentTypeText} подтверждена`,
                newStatus,
            }),
        };

    } catch (error) {
        console.error('Error confirming bank payment:', error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, message: error.message }),
        };
    }
}

// ============ Calculator Order ============

async function handleCalculatorOrder(body, headers) {
    try {
        const { name, phone, email, projectType, selectedFeatures, basePrice, totalPrice, description } = body;

        console.log("Calculator order request received");

        if (!name || !phone || !email || !projectType || !description) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ success: false, message: "Заполните все обязательные поля" }),
            };
        }

        if (!basePrice || !totalPrice) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ success: false, message: "Ошибка расчёта стоимости" }),
            };
        }

        const projectTypeLabel = projectType === "bizcard" ? "Сайт-визитка" : projectType === "landing" ? "Лендинг" : projectType === "corporate" ? "Корпоративный сайт" : "Интернет-магазин";

        let msg = "🎯 НОВЫЙ ЗАКАЗ ИЗ КАЛЬКУЛЯТОРА\n\n" + "📋 Проект:\n" + "• База: " + projectTypeLabel + "\n" + "• Стоимость базы: " + basePrice + " руб\n";

        if (selectedFeatures && selectedFeatures.length > 0) {
            msg += "\n📋 Выбранные опции:\n";
            for (let i = 0; i < selectedFeatures.length; i++) {
                msg += (i + 1) + ". " + selectedFeatures[i] + "\n";
            }
        }

        msg += "\n💰 Итого: " + totalPrice + " руб\n\n👤 Контакты:\n• Имя: " + name + "\n• Телефон: " + phone + "\n• Email: " + email + "\n\n📝 Описание:\n" + description;

        await sendTelegramNotification(msg);

        console.log("Calculator order sent successfully");
        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({ success: true, message: "Заказ успешно отправлен" }),
        };
    } catch (error) {
        console.error("Error sending calculator order:", error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, message: "Внутренняя ошибка сервера" }),
        };
    }
}

// ============ Bank Invoice Remaining (for legal entities) ============

async function handleBankInvoiceRemaining(data, headers) {
    try {
        const { orderId } = data;

        if (!orderId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ success: false, message: 'orderId обязателен' }),
            };
        }

        const order = await getOrderFromYdb(orderId);
        if (!order) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ success: false, message: 'Заказ не найден' }),
            };
        }

        if (order.paymentMethod !== 'invoice') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ success: false, message: 'Заказ не с оплатой по счёту' }),
            };
        }

        // Сумма остатка = предоплата (50%)
        const remainingAmount = parseFloat(order.amount) || 0;
        const invoiceNumber = Date.now().toString().slice(-8);

        // Генерируем PDF счёта на остаток
        const pdfBuffer = await generateBankInvoicePDF({
            invoiceNumber,
            orderId,
            clientName: order.clientName,
            clientEmail: order.clientEmail,
            clientPhone: order.clientPhone,
            companyName: order.companyName,
            companyInn: order.companyInn,
            companyKpp: order.companyKpp,
            companyAddress: order.companyAddress,
            projectType: order.projectType,
            projectDescription: 'Оплата остатка за разработку сайта',
            amount: remainingAmount,
            bankName: process.env.BANK_NAME,
            bankBik: process.env.BANK_BIK,
            bankAccount: process.env.BANK_ACCOUNT,
            bankCorrAccount: process.env.BANK_CORR_ACCOUNT || '',
        });

        // Отправляем email
        await sendBankInvoiceEmail({
            clientName: order.clientName,
            clientEmail: order.clientEmail,
            companyName: order.companyName,
            orderId,
            invoiceNumber,
            amount: remainingAmount,
            isRemaining: true,
        }, pdfBuffer);

        // Уведомление в Telegram
        await sendTelegramNotification(`📄 Выставлен счёт на ОСТАТОК!

🆔 Заказ: ${orderId}
👤 Клиент: ${order.clientName}
🏛️ Компания: ${order.companyName}
💰 Сумма: ${new Intl.NumberFormat('ru-RU').format(remainingAmount)} ₽
📄 Счёт №${invoiceNumber} отправлен на email`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Счёт на остаток отправлен',
                invoiceNumber,
            }),
        };

    } catch (error) {
        console.error('Error creating remaining invoice:', error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, message: error.message }),
        };
    }
}

// ============ Bank Invoice Addon (for legal entities) ============

async function handleBankInvoiceAddon(data, headers) {
    try {
        const { orderId, description, amount } = data;

        if (!orderId || !description || !amount) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ success: false, message: 'orderId, description и amount обязательны' }),
            };
        }

        const order = await getOrderFromYdb(orderId);
        if (!order) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ success: false, message: 'Заказ не найден' }),
            };
        }

        if (order.paymentMethod !== 'invoice') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ success: false, message: 'Заказ не с оплатой по счёту' }),
            };
        }

        const numericAmount = parseFloat(amount) || 0;
        const invoiceNumber = Date.now().toString().slice(-8);

        // Сохраняем доп. счёт в YDB
        const driver = await getYdbDriver();
        const invoiceId = 'addinv_' + generateOrderId().slice(4);
        const now = new Date().toISOString();

        await driver.tableClient.withSession(async (session) => {
            const queryText = `
                DECLARE $id AS Utf8;
                DECLARE $order_id AS Utf8;
                DECLARE $description AS Utf8;
                DECLARE $amount AS Utf8;
                DECLARE $status AS Utf8;
                DECLARE $invoice_number AS Utf8;
                DECLARE $payment_method AS Utf8;
                DECLARE $created_at AS Utf8;

                UPSERT INTO additional_invoices (id, order_id, description, amount, status, invoice_number, payment_method, created_at)
                VALUES ($id, $order_id, $description, $amount, $status, $invoice_number, $payment_method, $created_at);
            `;

            const preparedQuery = await session.prepareQuery(queryText);

            await session.executeQuery(preparedQuery, {
                '$id': TypedValues.utf8(invoiceId),
                '$order_id': TypedValues.utf8(orderId),
                '$description': TypedValues.utf8(description),
                '$amount': TypedValues.utf8(numericAmount.toString()),
                '$status': TypedValues.utf8('pending'),
                '$invoice_number': TypedValues.utf8(invoiceNumber),
                '$payment_method': TypedValues.utf8('invoice'),
                '$created_at': TypedValues.utf8(now),
            });
        });

        // Генерируем PDF счёта
        const pdfBuffer = await generateBankInvoicePDF({
            invoiceNumber,
            orderId,
            clientName: order.clientName,
            clientEmail: order.clientEmail,
            clientPhone: order.clientPhone,
            companyName: order.companyName,
            companyInn: order.companyInn,
            companyKpp: order.companyKpp,
            companyAddress: order.companyAddress,
            projectType: order.projectType,
            projectDescription: description,
            amount: numericAmount,
            bankName: process.env.BANK_NAME,
            bankBik: process.env.BANK_BIK,
            bankAccount: process.env.BANK_ACCOUNT,
            bankCorrAccount: process.env.BANK_CORR_ACCOUNT || '',
        });

        // Отправляем email
        await sendBankInvoiceEmail({
            clientName: order.clientName,
            clientEmail: order.clientEmail,
            companyName: order.companyName,
            orderId,
            invoiceNumber,
            amount: numericAmount,
            isAddon: true,
            addonDescription: description,
        }, pdfBuffer);

        // Уведомление в Telegram
        await sendTelegramNotification(`📄 Выставлен ДОП. СЧЁТ!

🆔 Заказ: ${orderId}
👤 Клиент: ${order.clientName}
🏛️ Компания: ${order.companyName}
📝 Описание: ${description}
💰 Сумма: ${new Intl.NumberFormat('ru-RU').format(numericAmount)} ₽
📄 Счёт №${invoiceNumber} отправлен на email`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Дополнительный счёт отправлен',
                invoiceId,
                invoiceNumber,
            }),
        };

    } catch (error) {
        console.error('Error creating addon invoice:', error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, message: error.message }),
        };
    }
}

// Admin Authentication with HMAC-signed tokens
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'mp-webstudio-admin-secret-2024';
const TOKEN_EXPIRY_HOURS = 24;

function generateAdminToken() {
    const now = Date.now();
    const expiry = now + (TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);
    const payload = JSON.stringify({ exp: expiry, iat: now, role: 'admin' });
    const payloadBase64 = Buffer.from(payload).toString('base64url');
    const signature = crypto.createHmac('sha256', ADMIN_TOKEN_SECRET)
        .update(payloadBase64)
        .digest('base64url');
    return `${payloadBase64}.${signature}`;
}

function verifyAdminToken(token) {
    if (!token || typeof token !== 'string') return false;

    const parts = token.split('.');
    if (parts.length !== 2) return false;

    const [payloadBase64, signature] = parts;

    // Verify signature
    const expectedSignature = crypto.createHmac('sha256', ADMIN_TOKEN_SECRET)
        .update(payloadBase64)
        .digest('base64url');

    if (signature !== expectedSignature) return false;

    // Verify expiry
    try {
        const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString());
        if (payload.exp < Date.now()) return false;
        return true;
    } catch {
        return false;
    }
}

async function handleAdminLogin(data, headers) {
    const { email, password } = data;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        console.error('ADMIN_EMAIL or ADMIN_PASSWORD not configured');
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, message: 'Admin not configured' }),
        };
    }

    // Constant-time comparison to prevent timing attacks
    const safeCompare = (a, b) => {
        if (!a || !b) return false;
        const bufA = Buffer.from(a);
        const bufB = Buffer.from(b);
        if (bufA.length !== bufB.length) return false;
        return crypto.timingSafeEqual(bufA, bufB);
    };

    const emailMatch = safeCompare(email?.toLowerCase(), adminEmail?.toLowerCase());
    const passwordMatch = safeCompare(password, adminPassword);

    if (emailMatch && passwordMatch) {
        const token = generateAdminToken();
        console.log('Admin login successful');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, token }),
        };
    }

    console.log('Admin login failed - invalid credentials');
    return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ success: false, message: 'Invalid credentials' }),
    };
}

async function handleVerifyAdmin(data, headers) {
    const { token } = data;
    const valid = verifyAdminToken(token);

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ valid }),
    };
}

async function generateBankInvoicePDF(data) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        const doc = new PDFDocument({ size: 'A4', margin: 40 });

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        const path = require('path');
        doc.registerFont('Roboto', path.join(__dirname, 'Roboto-Regular.ttf'));
        doc.registerFont('Roboto-Bold', path.join(__dirname, 'Roboto-Bold.ttf'));

        const formatPrice = (price) => new Intl.NumberFormat('ru-RU').format(price);
        const date = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

        // Заголовок
        doc.fontSize(16).font('Roboto-Bold').text(`СЧЁТ НА ОПЛАТУ № ${data.invoiceNumber}`, { align: 'center' });
        doc.fontSize(10).font('Roboto').text(`от ${date}`, { align: 'center' });
        doc.moveDown(1.5);

        // Блок получателя
        doc.fontSize(11).font('Roboto-Bold').text('ПОЛУЧАТЕЛЬ:');
        doc.moveDown(0.3);
        doc.fontSize(10).font('Roboto');
        doc.text('Пимашин Михаил Игоревич');
        doc.text('Самозанятый (НПД)');
        doc.text(`ИНН: 711612442203`);
        doc.text(`Адрес: 301766, Тульская обл., г. Донской, ул. Новая, 49`);
        doc.moveDown(0.5);

        // Банковские реквизиты
        doc.font('Roboto-Bold').text('Банковские реквизиты:');
        doc.font('Roboto');
        doc.text(`Банк: ${data.bankName}`);
        doc.text(`БИК: ${data.bankBik}`);
        doc.text(`Расчётный счёт: ${data.bankAccount}`);
        if (data.bankCorrAccount) {
            doc.text(`Корр. счёт: ${data.bankCorrAccount}`);
        }
        doc.moveDown(1);

        // Блок плательщика
        doc.font('Roboto-Bold').text('ПЛАТЕЛЬЩИК:');
        doc.moveDown(0.3);
        doc.font('Roboto');
        doc.text(data.companyName);
        doc.text(`ИНН: ${data.companyInn}${data.companyKpp ? `, КПП: ${data.companyKpp}` : ''}`);
        if (data.companyAddress) {
            doc.text(`Адрес: ${data.companyAddress}`);
        }
        doc.text(`Контактное лицо: ${data.clientName}`);
        doc.text(`Email: ${data.clientEmail}${data.clientPhone ? `, Тел: ${data.clientPhone}` : ''}`);
        doc.moveDown(1.5);

        // Таблица услуг
        const tableTop = doc.y;
        const col1 = 40;
        const col2 = 350;
        const col3 = 420;
        const col4 = 490;

        // Заголовок таблицы
        doc.font('Roboto-Bold').fontSize(9);
        doc.rect(col1, tableTop, 475, 20).stroke();
        doc.text('Наименование услуги', col1 + 5, tableTop + 6);
        doc.text('Кол-во', col2 + 5, tableTop + 6);
        doc.text('Цена', col3 + 5, tableTop + 6);
        doc.text('Сумма', col4 + 5, tableTop + 6);

        // Строка услуги
        const row1Top = tableTop + 20;
        const projectLabel = getProjectTypeName(data.projectType);
        const serviceName = `Разработка: ${projectLabel}${data.projectDescription ? ' (' + data.projectDescription.substring(0, 50) + ')' : ''}`;

        doc.font('Roboto').fontSize(9);
        doc.rect(col1, row1Top, 475, 25).stroke();
        doc.text(serviceName, col1 + 5, row1Top + 8, { width: 300 });
        doc.text('1', col2 + 15, row1Top + 8);
        doc.text(`${formatPrice(data.amount)} ₽`, col3 + 5, row1Top + 8);
        doc.text(`${formatPrice(data.amount)} ₽`, col4 + 5, row1Top + 8);
        doc.moveDown(3);

        // Итого (с указанием ширины для правильного выравнивания)
        const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        doc.fontSize(12).font('Roboto-Bold');
        doc.text(`ИТОГО: ${formatPrice(data.amount)} руб. 00 коп.`, doc.page.margins.left, doc.y, { width: pageWidth, align: 'right' });
        doc.moveDown(0.5);
        doc.fontSize(9).font('Roboto');
        doc.text('НДС не облагается (самозанятый, п. 8 ст. 2 ФЗ от 27.11.2018 N 422-ФЗ)', doc.page.margins.left, doc.y, { width: pageWidth, align: 'right' });
        doc.moveDown(1.5);

        // Сумма прописью
        const amountWords = numberToWords(data.amount);
        doc.font('Roboto-Bold').fontSize(10);
        doc.text(`Всего к оплате: ${amountWords}`, doc.page.margins.left, doc.y, { width: pageWidth });
        doc.moveDown(1.5);

        // Примечания
        doc.fontSize(9).font('Roboto');
        doc.text('Оплата данного счёта означает согласие с условиями публичной оферты, размещённой на сайте mp-webstudio.ru/offer', doc.page.margins.left, doc.y, { width: pageWidth });
        doc.moveDown(0.5);
        doc.text('Счёт действителен в течение 5 банковских дней.', doc.page.margins.left, doc.y, { width: pageWidth });
        doc.moveDown(2);

        // Подпись
        doc.font('Roboto-Bold').text('Исполнитель:', doc.page.margins.left, doc.y);
        doc.moveDown(0.5);
        doc.font('Roboto').text('Пимашин М.И. ________________', doc.page.margins.left, doc.y);
        doc.moveDown(2);

        // Футер
        doc.fontSize(8).text('Пимашин М.И. | MP.WebStudio | ИНН 711612442203 | mp-webstudio.ru', doc.page.margins.left, doc.y, { width: pageWidth, align: 'center' });

        doc.end();
    });
}

// Функция для преобразования числа в слова (упрощённая версия)
function numberToWords(num) {
    const ones = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять', 
                  'десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать',
                  'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
    const tens = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
    const hundreds = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];
    const thousands = ['', 'одна тысяча', 'две тысячи', 'три тысячи', 'четыре тысячи', 'пять тысяч', 
                       'шесть тысяч', 'семь тысяч', 'восемь тысяч', 'девять тысяч'];

    const n = Math.floor(num);
    if (n === 0) return 'ноль рублей 00 копеек';

    let result = '';

    // Тысячи
    const th = Math.floor(n / 1000);
    if (th > 0 && th < 10) {
        result += thousands[th] + ' ';
    } else if (th >= 10 && th < 20) {
        result += ones[th] + ' тысяч ';
    } else if (th >= 20) {
        const thTens = Math.floor(th / 10);
        const thOnes = th % 10;
        result += tens[thTens] + ' ';
        if (thOnes > 0) {
            if (thOnes === 1) result += 'одна тысяча ';
            else if (thOnes >= 2 && thOnes <= 4) result += ones[thOnes].replace('два', 'две') + ' тысячи ';
            else result += ones[thOnes] + ' тысяч ';
        } else {
            result += 'тысяч ';
        }
    }

    // Сотни
    const remainder = n % 1000;
    const h = Math.floor(remainder / 100);
    if (h > 0) result += hundreds[h] + ' ';

    // Десятки и единицы
    const t = remainder % 100;
    if (t < 20) {
        result += ones[t] + ' ';
    } else {
        result += tens[Math.floor(t / 10)] + ' ';
        if (t % 10 > 0) result += ones[t % 10] + ' ';
    }

    // Склонение "рублей"
    const lastTwo = n % 100;
    const lastOne = n % 10;
    let rubles = 'рублей';
    if (lastTwo >= 11 && lastTwo <= 19) rubles = 'рублей';
    else if (lastOne === 1) rubles = 'рубль';
    else if (lastOne >= 2 && lastOne <= 4) rubles = 'рубля';

    return result.trim() + ' ' + rubles + ' 00 копеек';
}

async function sendBankInvoiceEmail(orderData, pdfBuffer) {
    const formatPrice = (price) => new Intl.NumberFormat('ru-RU').format(price);

    let invoiceType = 'Счёт на оплату (предоплата)';
    let actionText = 'После оплаты, пожалуйста, сообщите нам — мы начнём работу над вашим проектом.';

    if (orderData.isRemaining) {
        invoiceType = 'Счёт на остаток оплаты';
        actionText = 'Проект завершён. После оплаты остатка вы получите Акт выполненных работ.';
    } else if (orderData.isAddon) {
        invoiceType = 'Дополнительный счёт';
        actionText = `Услуга: ${orderData.addonDescription || 'Дополнительные работы'}`;
    }

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0891b2;">${invoiceType}</h2>
        <p>Здравствуйте, ${orderData.clientName}!</p>
        <p>Счёт на оплату для <strong>${orderData.companyName}</strong> прикреплён к этому письму.</p>

        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Счёт №:</strong> ${orderData.invoiceNumber}</p>
            <p style="margin: 5px 0;"><strong>Сумма:</strong> ${formatPrice(orderData.amount)} ₽</p>
            <p style="margin: 5px 0;"><strong>ID заказа:</strong> ${orderData.orderId}</p>
        </div>

        <p>${actionText}</p>

        <p style="margin-top: 30px; color: #6b7280;">С уважением,<br><strong>MP.WebStudio</strong><br>
        Телефон: +7 (953) 181-41-36<br>
        <a href="https://mp-webstudio.ru">mp-webstudio.ru</a></p>
    </body>
    </html>`;

    // Yandex Cloud Postbox через AWS SES-совместимый API
    const postboxAccessKey = process.env.POSTBOX_ACCESS_KEY_ID;
    const postboxSecretKey = process.env.POSTBOX_SECRET_ACCESS_KEY;
    const postboxFromEmail = process.env.POSTBOX_FROM_EMAIL;

    if (postboxAccessKey && postboxSecretKey && postboxFromEmail) {
        console.log('Sending bank invoice email via Yandex Cloud Postbox, to:', orderData.clientEmail);

        const sesClient = new SESv2Client({
            region: 'ru-central1',
            endpoint: 'https://postbox.cloud.yandex.net',
            credentials: {
                accessKeyId: postboxAccessKey,
                secretAccessKey: postboxSecretKey,
            },
        });

        const wrapBase64 = (base64) => base64.match(/.{1,76}/g).join('\r\n');

        const boundary = '----=_Part_' + Date.now().toString(36);
        const pdfBase64 = wrapBase64(pdfBuffer.toString('base64'));
        const htmlBase64 = wrapBase64(Buffer.from(emailHtml).toString('base64'));

        let subjectText = `Счёт на оплату №${orderData.invoiceNumber} - MP.WebStudio`;
        if (orderData.isRemaining) {
            subjectText = `Счёт на остаток №${orderData.invoiceNumber} - MP.WebStudio`;
        } else if (orderData.isAddon) {
            subjectText = `Дополнительный счёт №${orderData.invoiceNumber} - MP.WebStudio`;
        }
        const fileName = `Invoice_${orderData.invoiceNumber}.pdf`;

        const rawEmail = [
            `From: MP.WebStudio <${postboxFromEmail}>`,
            `To: ${orderData.clientEmail}`,
            `Subject: =?UTF-8?B?${Buffer.from(subjectText).toString('base64')}?=`,
            'MIME-Version: 1.0',
            `Content-Type: multipart/mixed; boundary="${boundary}"`,
            '',
            `--${boundary}`,
            'Content-Type: text/html; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
            '',
            htmlBase64,
            '',
            `--${boundary}`,
            `Content-Type: application/pdf; name="${fileName}"`,
            'Content-Transfer-Encoding: base64',
            `Content-Disposition: attachment; filename="${fileName}"`,
            '',
            pdfBase64,
            '',
            `--${boundary}--`,
        ].join('\r\n');

        try {
            const command = new SendEmailCommand({
                FromEmailAddress: postboxFromEmail,
                Destination: {
                    ToAddresses: [orderData.clientEmail],
                },
                Content: {
                    Raw: {
                        Data: Buffer.from(rawEmail),
                    },
                },
            });

            const response = await sesClient.send(command);
            console.log('Bank invoice email sent via Yandex Cloud Postbox, MessageId:', response.MessageId);
            return;
        } catch (error) {
            console.error('Postbox error sending bank invoice:', error.message);
            throw new Error(`Email error: ${error.message}`);
        }
    }

    // Fallback на SMTP (если Postbox не настроен)
    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (!smtpEmail || !smtpPassword) {
        console.log('No email service configured, skipping bank invoice email');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true,
        auth: { user: smtpEmail, pass: smtpPassword },
    });

    await transporter.sendMail({
        from: `"MP.WebStudio" <${smtpEmail}>`,
        to: orderData.clientEmail,
        subject: `Счёт на оплату №${orderData.invoiceNumber} - MP.WebStudio`,
        html: emailHtml,
        attachments: [{
            filename: `Invoice_${orderData.invoiceNumber}.pdf`,
            content: pdfBuffer,
        }],
    });

    console.log('Bank invoice email sent via SMTP to:', orderData.clientEmail);
}

// ============ PDF Generation ============

async function generateContractPDF(order) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        const doc = new PDFDocument({ size: 'A4', margin: 50 });

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        const path = require('path');
        doc.registerFont('Roboto', path.join(__dirname, 'Roboto-Regular.ttf'));
        doc.registerFont('Roboto-Bold', path.join(__dirname, 'Roboto-Bold.ttf'));

        const formatPrice = (price) => {
            const num = parseFloat(price) || 0;
            return new Intl.NumberFormat('ru-RU').format(num);
        };
        const amount = parseFloat(order.amount) || 0;
        const totalAmount = amount * 2;
        const prepayment = amount;
        const projectTypeLabel = getProjectTypeName(order.projectType);
        const date = new Date().toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        doc.fontSize(16).font('Roboto-Bold').text('ДОГОВОР ОКАЗАНИЯ УСЛУГ', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(10).font('Roboto').text(date, { align: 'center' });
        doc.moveDown(1.5);

        doc.fontSize(10).font('Roboto-Bold').text('ИСПОЛНИТЕЛЬ:');
        doc.font('Roboto').text('Пимашин Михаил Игоревич');
        doc.text('Самозанятый (НПД), ИНН: 711612442203');
        doc.text('Адрес: 301766, Тульская обл., г. Донской, ул. Новая, 49');
        doc.text('Телефон: +7 (953) 181-41-36, Email: mpwebstudio1@gmail.com');
        doc.moveDown(0.5);

        doc.font('Roboto-Bold').text('ЗАКАЗЧИК:');
        if (order.paymentMethod === 'invoice' && order.companyName) {
            doc.font('Roboto').text(order.companyName);
            doc.text(`ИНН: ${order.companyInn || '-'}`);
            if (order.companyKpp) doc.text(`КПП: ${order.companyKpp}`);
            if (order.companyAddress) doc.text(`Адрес: ${order.companyAddress}`);
            doc.text(`Контактное лицо: ${order.clientName || 'Не указано'}`);
        } else {
            doc.font('Roboto').text(order.clientName || 'Клиент');
        }
        if (order.clientPhone) doc.text(`Телефон: ${order.clientPhone}`);
        if (order.clientEmail) doc.text(`Email: ${order.clientEmail}`);
        doc.moveDown(1);

        doc.text('совместно именуемые "Стороны", заключили настоящий Договор:');
        doc.moveDown(1);

        doc.font('Roboto-Bold').text('1. ПРЕДМЕТ ДОГОВОРА');
        doc.font('Roboto').text(`1.1. Исполнитель обязуется оказать услуги по разработке: ${projectTypeLabel}`);
        doc.moveDown(1);

        doc.font('Roboto-Bold').text('2. СТОИМОСТЬ И ПОРЯДОК ОПЛАТЫ');
        doc.font('Roboto').text(`2.1. Стоимость услуг: ${formatPrice(totalAmount)} рублей`);
        doc.text('2.2. НДС не облагается (п. 8 ст. 2 ФЗ от 27.11.2018 N 422-ФЗ)');
        doc.text(`2.3. Предоплата 50%: ${formatPrice(prepayment)} руб. - ОПЛАЧЕНО`);
        doc.text(`2.4. Остаток 50%: ${formatPrice(prepayment)} руб. - после подписания Акта`);
        doc.moveDown(1);

        doc.font('Roboto-Bold').text('3. СРОКИ ВЫПОЛНЕНИЯ');
        doc.font('Roboto').text('3.1. Срок: от 5 до 20 рабочих дней с момента получения предоплаты и материалов');
        doc.text('3.2. Этапы: Создание первой версии -> Правки (до 3 итераций) -> Запуск');
        doc.moveDown(1);

        doc.font('Roboto-Bold').text('4. ГАРАНТИИ');
        doc.font('Roboto').text('4.1. Гарантийный срок: 14 календарных дней');
        doc.text('4.2. Бесплатное устранение технических ошибок в течение гарантийного срока');
        doc.moveDown(1);

        doc.font('Roboto-Bold').text('5. ИНТЕЛЛЕКТУАЛЬНАЯ СОБСТВЕННОСТЬ');
        doc.font('Roboto').text('5.1. Все права на сайт переходят к Заказчику после полной оплаты');
        doc.text('5.2. Исполнитель вправе использовать результат в портфолио');
        doc.moveDown(1);

        doc.font('Roboto-Bold').text('АКЦЕПТ ОФЕРТЫ');
        doc.font('Roboto').text('Оплата предоплаты является акцептом настоящего договора.');
        doc.text(`Дата акцепта: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`);
        doc.text(`ID заказа: ${order.id}`);
        doc.moveDown(2);

        doc.fontSize(9).text('Пимашин М.И. | MP.WebStudio | ИНН 711612442203 | mp-webstudio.ru', { align: 'center' });

        doc.end();
    });
}

async function generateCompletionActPDF(order, additionalInvoices = []) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        const doc = new PDFDocument({ size: 'A4', margin: 50 });

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        const path = require('path');
        doc.registerFont('Roboto', path.join(__dirname, 'Roboto-Regular.ttf'));
        doc.registerFont('Roboto-Bold', path.join(__dirname, 'Roboto-Bold.ttf'));

        const formatPrice = (price) => {
            const num = parseFloat(price) || 0;
            return new Intl.NumberFormat('ru-RU').format(num);
        };
        const amount = parseFloat(order.amount) || 0;

        // Расчет итоговой суммы: базовая + все оплаченные доп счеты
        let additionalAmount = 0;
        const paidAdditional = (additionalInvoices || []).filter(inv => inv.status === 'paid');
        paidAdditional.forEach(inv => {
            additionalAmount += parseFloat(inv.amount) || 0;
        });

        const totalAmount = amount * 2 + additionalAmount;
        const projectTypeLabel = getProjectTypeName(order.projectType);
        const date = new Date().toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        doc.fontSize(16).font('Roboto-Bold').text('АКТ ВЫПОЛНЕННЫХ РАБОТ', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(10).font('Roboto').text(date, { align: 'center' });
        doc.moveDown(1.5);

        doc.fontSize(10).font('Roboto-Bold').text('ИСПОЛНИТЕЛЬ:');
        doc.font('Roboto').text('Пимашин Михаил Игоревич');
        doc.text('Самозанятый (НПД), ИНН: 711612442203');
        doc.text('Адрес: 301766, Тульская обл., г. Донской, ул. Новая, 49');
        doc.text('Телефон: +7 (953) 181-41-36, Email: mpwebstudio1@gmail.com');
        doc.moveDown(0.5);

        doc.font('Roboto-Bold').text('ЗАКАЗЧИК:');
        if (order.paymentMethod === 'invoice' && order.companyName) {
            doc.font('Roboto').text(order.companyName);
            doc.text(`ИНН: ${order.companyInn || '-'}`);
            if (order.companyKpp) doc.text(`КПП: ${order.companyKpp}`);
            if (order.companyAddress) doc.text(`Адрес: ${order.companyAddress}`);
            doc.text(`Контактное лицо: ${order.clientName || 'Не указано'}`);
        } else {
            doc.font('Roboto').text(order.clientName || 'Клиент');
        }
        if (order.clientPhone) doc.text(`Телефон: ${order.clientPhone}`);
        if (order.clientEmail) doc.text(`Email: ${order.clientEmail}`);
        doc.moveDown(1);

        doc.font('Roboto-Bold').text('1. ВЫПОЛНЕННЫЕ РАБОТЫ');
        doc.font('Roboto').text(`Разработка: ${projectTypeLabel}`);
        if (order.projectDescription) {
            doc.text(`Описание: ${order.projectDescription}`);
        }
        doc.moveDown(1);

        doc.font('Roboto-Bold').text('2. СТОИМОСТЬ РАБОТ');
        doc.font('Roboto').text(`Базовая стоимость: ${formatPrice(amount * 2)} рублей`);
        doc.text(`Предоплата (50%): ${formatPrice(amount)} руб. - ОПЛАЧЕНО`);
        doc.text(`Остаток (50%): ${formatPrice(amount)} руб. - ОПЛАЧЕНО`);

        // Раздел дополнительных работ
        if (paidAdditional.length > 0) {
            doc.moveDown(0.5);
            doc.font('Roboto-Bold').text('Дополнительные работы:');
            paidAdditional.forEach(inv => {
                doc.font('Roboto').text(`• ${inv.description} - ${formatPrice(inv.amount)} руб. - ОПЛАЧЕНО`);
            });
        }

        doc.moveDown(0.5);
        doc.font('Roboto-Bold').text(`ИТОГО: ${formatPrice(totalAmount)} рублей`);
        doc.font('Roboto').text('НДС не облагается (п. 8 ст. 2 ФЗ от 27.11.2018 N 422-ФЗ)');
        doc.moveDown(1);

        doc.font('Roboto-Bold').text('3. ПЕРЕДАЧА ПРАВ');
        doc.font('Roboto').text('3.1. Все исключительные права на созданный сайт полностью переходят к Заказчику.');
        doc.text('3.2. Исполнитель передаёт Заказчику все материалы и доступы к сайту.');
        doc.text('3.3. Заказчик подтверждает получение всех необходимых доступов.');
        doc.moveDown(1);

        doc.font('Roboto-Bold').text('4. ГАРАНТИЙНЫЕ ОБЯЗАТЕЛЬСТВА');
        doc.font('Roboto').text('4.1. Гарантийный период: 14 календарных дней с момента подписания акта.');
        doc.text('4.2. В течение гарантийного периода Исполнитель бесплатно устраняет технические ошибки.');
        doc.text('4.3. Гарантия не распространяется на изменения, внесённые Заказчиком или третьими лицами.');
        doc.moveDown(1);

        doc.font('Roboto-Bold').text('5. ПОДТВЕРЖДЕНИЕ');
        doc.font('Roboto').text('Стороны подтверждают, что:');
        doc.text('- Работы выполнены в полном объёме и в согласованные сроки');
        doc.text('- Заказчик принимает результат работ без претензий');
        doc.text('- Оплата произведена полностью');
        doc.moveDown(1);

        doc.font('Roboto-Bold').text('ДАННЫЕ ДОСТУПА К САЙТУ');
        doc.font('Roboto').text('Данные доступа к панели управления сайтом отправлены вам');
        doc.text('отдельным защищённым сообщением на указанный email или телефон.');
        doc.moveDown(0.5);
        doc.text('Рекомендуем сменить пароли после получения доступов.', { oblique: true });
        doc.moveDown(1);

        doc.font('Roboto-Bold').text('АКЦЕПТ АКТА');
        doc.font('Roboto').text('Оплата остатка является подтверждением приёмки работ.');
        doc.text(`Дата акцепта: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`);
        doc.text(`ID заказа: ${order.id}`);
        doc.moveDown(2);

        doc.fontSize(9).text('Пимашин М.И. | MP.WebStudio | ИНН 711612442203 | mp-webstudio.ru', { align: 'center' });
        doc.text('Спасибо за сотрудничество!', { align: 'center' });

        doc.end();
    });
}

// ============ Email Sending ============

async function sendContractEmail(order, pdfBuffer) {
    const formatPrice = (price) => {
        const num = parseFloat(price) || 0;
        return new Intl.NumberFormat('ru-RU').format(num);
    };
    const amount = parseFloat(order.amount) || 0;
    const totalAmount = amount * 2;
    const prepayment = amount;

    const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0891b2;">Спасибо за заказ!</h2>
            <p>Здравствуйте, ${order.clientName || 'Уважаемый клиент'}!</p>
            <p>Ваша предоплата успешно получена. Договор подписан.</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Детали заказа:</h3>
                <p><strong>Тип проекта:</strong> ${getProjectTypeName(order.projectType)}</p>
                <p><strong>Стоимость:</strong> ${formatPrice(totalAmount)} руб.</p>
                <p><strong>Предоплата:</strong> ${formatPrice(prepayment)} руб.</p>
                <p><strong>ID заказа:</strong> ${order.id}</p>
            </div>
            <p>Договор прикреплён к письму в PDF.</p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                С уважением,<br>MP.WebStudio<br>
                <a href="https://mp-webstudio.ru">mp-webstudio.ru</a>
            </p>
        </div>
    `;

    // Yandex Cloud Postbox через AWS SES-совместимый API
    const postboxAccessKey = process.env.POSTBOX_ACCESS_KEY_ID;
    const postboxSecretKey = process.env.POSTBOX_SECRET_ACCESS_KEY;
    const postboxFromEmail = process.env.POSTBOX_FROM_EMAIL;

    if (postboxAccessKey && postboxSecretKey && postboxFromEmail) {
        console.log('Using Yandex Cloud Postbox (AWS SESv2), from:', postboxFromEmail);

        // Создаём SESv2 клиент для Yandex Cloud Postbox
        const sesClient = new SESv2Client({
            region: 'ru-central1',
            endpoint: 'https://postbox.cloud.yandex.net',
            credentials: {
                accessKeyId: postboxAccessKey,
                secretAccessKey: postboxSecretKey,
            },
        });

        // Функция для разбиения base64 на строки по 76 символов (RFC 2045)
        const wrapBase64 = (base64) => base64.match(/.{1,76}/g).join('\r\n');

        // Формируем raw email с вложением
        const boundary = '----=_Part_' + Date.now().toString(36);
        const pdfBase64 = wrapBase64(pdfBuffer.toString('base64'));
        const htmlBase64 = wrapBase64(Buffer.from(emailHtml).toString('base64'));

        const rawEmail = [
            `From: MP.WebStudio <${postboxFromEmail}>`,
            `To: ${order.clientEmail}`,
            `Subject: =?UTF-8?B?${Buffer.from(`Договор на разработку сайта - Заказ ${order.id}`).toString('base64')}?=`,
            'MIME-Version: 1.0',
            `Content-Type: multipart/mixed; boundary="${boundary}"`,
            '',
            `--${boundary}`,
            'Content-Type: text/html; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
            '',
            htmlBase64,
            '',
            `--${boundary}`,
            `Content-Type: application/pdf; name="Contract_${order.id}.pdf"`,
            'Content-Transfer-Encoding: base64',
            `Content-Disposition: attachment; filename="Contract_${order.id}.pdf"`,
            '',
            pdfBase64,
            '',
            `--${boundary}--`,
        ].join('\r\n');

        console.log('Sending email via Yandex Postbox AWS SESv2');

        try {
            const command = new SendEmailCommand({
                FromEmailAddress: postboxFromEmail,
                Destination: {
                    ToAddresses: [order.clientEmail],
                },
                Content: {
                    Raw: {
                        Data: Buffer.from(rawEmail),
                    },
                },
            });

            const response = await sesClient.send(command);
            console.log('Email sent via Yandex Cloud Postbox, MessageId:', response.MessageId);
            return;
        } catch (error) {
            console.error('Postbox error:', error.message);
            console.error('Postbox error details:', JSON.stringify(error, null, 2));
            throw new Error(`Yandex Postbox error: ${error.message}`);
        }
    }

    // Fallback на SMTP (Яндекс Почта)
    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;

    console.log('SMTP config:', { emailConfigured: !!smtpEmail, passwordConfigured: !!smtpPassword });

    if (!smtpEmail || !smtpPassword) {
        console.log('No email service configured (POSTBOX_API_KEY or SMTP), skipping email');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true,
        auth: { user: smtpEmail, pass: smtpPassword },
    });

    const mailOptions = {
        from: `"MP.WebStudio" <${smtpEmail}>`,
        to: order.clientEmail,
        subject: `Договор на разработку сайта - Заказ ${order.id}`,
        html: emailHtml,
        attachments: [{
            filename: `Договор_${order.id}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
        }],
    };

    console.log('Sending email via SMTP to:', order.clientEmail);
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully via SMTP');
}

async function sendCompletionActEmail(order, pdfBuffer) {
    const formatPrice = (price) => {
        const num = parseFloat(price) || 0;
        return new Intl.NumberFormat('ru-RU').format(num);
    };
    const amount = parseFloat(order.amount) || 0;
    const totalAmount = amount * 2;

    const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10b981;">Проект завершён!</h2>
            <p>Здравствуйте, ${order.clientName || 'Уважаемый клиент'}!</p>
            <p>Поздравляем! Ваш проект полностью оплачен и передан вам.</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Итоги проекта:</h3>
                <p><strong>Тип проекта:</strong> ${getProjectTypeName(order.projectType)}</p>
                <p><strong>Полная стоимость:</strong> ${formatPrice(totalAmount)} руб.</p>
                <p><strong>Статус:</strong> <span style="color: #10b981;">Полностью оплачен</span></p>
                <p><strong>ID заказа:</strong> ${order.id}</p>
            </div>
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <p style="margin: 0;"><strong>Данные доступа к сайту</strong> будут отправлены вам отдельным защищённым сообщением в ближайшее время.</p>
            </div>
            <p><strong>Акт выполненных работ</strong> прикреплён к письму в PDF.</p>
            <h3 style="margin-top: 30px;">Гарантия</h3>
            <p>В течение 14 дней мы бесплатно исправим любые технические ошибки.</p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                Спасибо за сотрудничество!<br>
                С уважением,<br>MP.WebStudio<br>
                <a href="https://mp-webstudio.ru">mp-webstudio.ru</a>
            </p>
        </div>
    `;

    const postboxAccessKey = process.env.POSTBOX_ACCESS_KEY_ID;
    const postboxSecretKey = process.env.POSTBOX_SECRET_ACCESS_KEY;
    const postboxFromEmail = process.env.POSTBOX_FROM_EMAIL;

    if (postboxAccessKey && postboxSecretKey && postboxFromEmail) {
        console.log('Sending completion act via Yandex Cloud Postbox');

        const sesClient = new SESv2Client({
            region: 'ru-central1',
            endpoint: 'https://postbox.cloud.yandex.net',
            credentials: {
                accessKeyId: postboxAccessKey,
                secretAccessKey: postboxSecretKey,
            },
        });

        const wrapBase64 = (base64) => base64.match(/.{1,76}/g).join('\r\n');
        const boundary = '----=_Part_' + Date.now().toString(36);
        const pdfBase64 = wrapBase64(pdfBuffer.toString('base64'));
        const htmlBase64 = wrapBase64(Buffer.from(emailHtml).toString('base64'));

        const rawEmail = [
            `From: MP.WebStudio <${postboxFromEmail}>`,
            `To: ${order.clientEmail}`,
            `Subject: =?UTF-8?B?${Buffer.from(`Акт выполненных работ - Заказ ${order.id}`).toString('base64')}?=`,
            'MIME-Version: 1.0',
            `Content-Type: multipart/mixed; boundary="${boundary}"`,
            '',
            `--${boundary}`,
            'Content-Type: text/html; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
            '',
            htmlBase64,
            '',
            `--${boundary}`,
            `Content-Type: application/pdf; name="CompletionAct_${order.id}.pdf"`,
            'Content-Transfer-Encoding: base64',
            `Content-Disposition: attachment; filename="CompletionAct_${order.id}.pdf"`,
            '',
            pdfBase64,
            '',
            `--${boundary}--`,
        ].join('\r\n');

        try {
            const command = new SendEmailCommand({
                FromEmailAddress: postboxFromEmail,
                Destination: { ToAddresses: [order.clientEmail] },
                Content: { Raw: { Data: Buffer.from(rawEmail) } },
            });

            const response = await sesClient.send(command);
            console.log('Completion act sent via Postbox, MessageId:', response.MessageId);
            return;
        } catch (error) {
            console.error('Postbox error:', error.message);
            throw new Error(`Yandex Postbox error: ${error.message}`);
        }
    }

    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (!smtpEmail || !smtpPassword) {
        console.log('No email service configured, skipping completion act email');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true,
        auth: { user: smtpEmail, pass: smtpPassword },
    });

    const mailOptions = {
        from: `"MP.WebStudio" <${smtpEmail}>`,
        to: order.clientEmail,
        subject: `Акт выполненных работ - Заказ ${order.id}`,
        html: emailHtml,
        attachments: [{
            filename: `Акт_${order.id}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
        }],
    };

    console.log('Sending completion act via SMTP to:', order.clientEmail);
    await transporter.sendMail(mailOptions);
    console.log('Completion act sent via SMTP');
}

async function sendAdditionalInvoiceEmail(order, amount, invoiceId) {
    const formatPrice = (price) => {
        const num = parseFloat(price) || 0;
        return new Intl.NumberFormat('ru-RU').format(num);
    };

    // Извлекаем описание из invoiceId если возможно (addinv_orderId_timestamp_desc)
    const parts = invoiceId.split('_');
    const description = parts.length >= 4 ? `Счёт #${parts[1]}` : 'Дополнительная услуга';

    const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">Платёж получен!</h2>
            <p>Здравствуйте, ${order.clientName || 'Уважаемый клиент'}!</p>
            <p>Спасибо! Ваш платёж за дополнительную услугу успешно получен.</p>

            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
                <h3 style="margin-top: 0; color: #1e40af;">Детали платежа</h3>
                <p><strong>Сумма:</strong> <span style="font-size: 18px; color: #10b981;">${formatPrice(amount)} ₽</span></p>
                <p><strong>Статус:</strong> <span style="color: #10b981;">Оплачено</span></p>
                <p><strong>ID заказа:</strong> ${order.id}</p>
            </div>

            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <p style="margin: 0;">Полный акт выполненных работ с учётом всех дополнительных услуг будет отправлен после оплаты остатка основного заказа.</p>
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                С уважением,<br>MP.WebStudio<br>
                <a href="https://mp-webstudio.ru" style="color: #3b82f6;">mp-webstudio.ru</a>
            </p>
        </div>
    `;

    const postboxAccessKey = process.env.POSTBOX_ACCESS_KEY_ID;
    const postboxSecretKey = process.env.POSTBOX_SECRET_ACCESS_KEY;
    const postboxFromEmail = process.env.POSTBOX_FROM_EMAIL;

    if (postboxAccessKey && postboxSecretKey && postboxFromEmail) {
        console.log('Sending additional invoice email via Yandex Cloud Postbox');

        const sesClient = new SESv2Client({
            region: 'ru-central1',
            endpoint: 'https://postbox.cloud.yandex.net',
            credentials: {
                accessKeyId: postboxAccessKey,
                secretAccessKey: postboxSecretKey,
            },
        });

        try {
            const command = new SendEmailCommand({
                FromEmailAddress: postboxFromEmail,
                Destination: { ToAddresses: [order.clientEmail] },
                Content: {
                    Simple: {
                        Subject: { Data: `Платёж получен - Дополнительная услуга`, Charset: 'UTF-8' },
                        Body: { Html: { Data: emailHtml, Charset: 'UTF-8' } },
                    },
                },
            });

            const response = await sesClient.send(command);
            console.log('Additional invoice email sent via Postbox, MessageId:', response.MessageId);
            return;
        } catch (error) {
            console.error('Postbox error:', error.message);
            throw new Error(`Yandex Postbox error: ${error.message}`);
        }
    }

    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (!smtpEmail || !smtpPassword) {
        console.log('No email service configured, skipping additional invoice email');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true,
        auth: { user: smtpEmail, pass: smtpPassword },
    });

    const mailOptions = {
        from: `"MP.WebStudio" <${smtpEmail}>`,
        to: order.clientEmail,
        subject: `Платёж получен - Дополнительная услуга`,
        html: emailHtml,
    };

    console.log('Sending additional invoice email via SMTP to:', order.clientEmail);
    await transporter.sendMail(mailOptions);
    console.log('Additional invoice email sent via SMTP');
}

// ============ Helpers ============

function getProjectTypeName(type) {
    const types = {
        landing: 'Лендинг',
        corporate: 'Корпоративный сайт',
        shop: 'Интернет-магазин',
    };
    return types[type] || type || 'Веб-разработка';
}

function formatContactMessage(data) {
    const projectTypes = {
        landing: 'Лендинг',
        corporate: 'Корпоративный сайт',
        shop: 'Интернет-магазин',
        webapp: 'Веб-приложение',
        redesign: 'Редизайн сайта',
        support: 'Техподдержка',
        other: 'Другое',
    };
    const projectTypeName = data.projectType ? (projectTypes[data.projectType] || data.projectType) : 'Не указан';
    return `📩 Новая заявка с сайта!\n\n👤 Имя: ${data.name}\n📞 Телефон: ${data.phone || 'Не указан'}\n📧 Email: ${data.email}\n📋 Тип проекта: ${projectTypeName}\n💰 Бюджет: ${data.budget || 'Не указан'}\n\n💬 Сообщение:\n${data.message}`;
}

function formatOrderMessage(order) {
    return `Новый заказ!\n\nID: ${order.id}\nКлиент: ${order.clientName}\nEmail: ${order.clientEmail}\nТелефон: ${order.clientPhone}\nТип: ${getProjectTypeName(order.projectType)}\nСумма: ${order.amount} руб.`;
}

async function sendTelegramNotification(message) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

    if (!botToken || !chatId) {
        console.log('[TELEGRAM-NOTIFY] Telegram not configured');
        return;
    }

    try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message }),
        });
        console.log('Telegram notification sent');
    } catch (error) {
        console.error('Telegram error:', error.message);
    }
}

// ============ Chat Limits Handler (Rate Limiting by IP) ============

async function checkAndUpdateChatLimit(ipAddress) {
    const MAX_MESSAGES_PER_DAY = 5;
    console.log(`[CHAT-LIMITS] 🔍 Checking limit for IP ${ipAddress}, MAX=${MAX_MESSAGES_PER_DAY}`);
    const RESET_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 часа
    
    try {
        const driver = await getYdbDriver();
        let isLimitExceeded = false;
        let currentCount = 0;
        let tableExists = false;
        
        await driver.tableClient.withSession(async (session) => {
            const now = Date.now();
            
            try {
                // Получаем текущие данные
                const selectQuery = `
                    DECLARE $ip AS Utf8;
                    
                    SELECT message_count, last_reset_timestamp FROM chat_limits WHERE ip_address = $ip;
                `;
                
                console.log(`[CHAT-LIMITS] 🔎 Executing SELECT for IP: ${ipAddress}`);
                const result = await session.executeQuery(selectQuery, {
                    '$ip': TypedValues.utf8(ipAddress)
                });
                
                tableExists = true;
                const rows = result.resultSets[0]?.rows || [];
                console.log(`[CHAT-LIMITS] 📊 SELECT returned ${rows.length} rows`);
                let messageCount = 0;
                let lastResetTimestamp = now;
                
                if (rows.length > 0) {
                    const row = rows[0];
                    console.log(`[CHAT-LIMITS] 🔎 Full Row Object: ${JSON.stringify(row)}`);
                    
                    let countVal, timeVal;
                    
                    if (row.items && Array.isArray(row.items)) {
                        const countItem = row.items[0];
                        const timeItem = row.items[1];
                        
                        countVal = countItem ? (countItem.int32Value !== undefined ? countItem.int32Value : countItem.value) : undefined;
                        timeVal = timeItem ? (timeItem.int64Value !== undefined ? timeItem.int64Value : timeItem.value) : undefined;
                    } else {
                        countVal = row.message_count;
                        timeVal = row.last_reset_timestamp;
                    }

                    const extract = (v) => {
                        if (v === null || v === undefined) return null;
                        if (typeof v === 'object' && v !== null && 'value' in v) {
                            const val = v.value;
                            if (val === null || val === undefined) return null;
                            return Number(val);
                        }
                        if (typeof v === 'string') return Number(v);
                        return Number(v);
                    };

                    const c = extract(countVal);
                    const t = extract(timeVal);

                    if (c !== null) messageCount = c;
                    // Исправление: если время из базы равно 0, используем текущее время
                    if (t !== null && t > 0) {
                        lastResetTimestamp = t;
                    } else {
                        lastResetTimestamp = now;
                        console.log(`[CHAT-LIMITS] ⚠️ DB timestamp was 0 or null, using current time: ${now}`);
                    }
                    
                    console.log(`[CHAT-LIMITS] 📖 Final parsed: count=${messageCount}, reset=${lastResetTimestamp}`);
                } else {
                    lastResetTimestamp = now;
                    console.log(`[CHAT-LIMITS] 🆕 No existing record found for IP ${ipAddress}, creating new one`);
                }
                
                // Проверяем нужно ли обнулить счётчик (прошло 24 часа)
                if (now - lastResetTimestamp > RESET_INTERVAL_MS) {
                    messageCount = 0;
                    lastResetTimestamp = now;
                    console.log(`[CHAT-LIMITS] Reset counter for IP ${ipAddress} (24h passed)`);
                }
                
                // Проверяем превышение лимита
                if (messageCount >= MAX_MESSAGES_PER_DAY) {
                    isLimitExceeded = true;
                    console.log(`[CHAT-LIMITS] ❌ Limit exceeded for IP ${ipAddress}: ${messageCount}/${MAX_MESSAGES_PER_DAY}`);
                } else {
                    // Увеличиваем счётчик
                    messageCount += 1;
                    currentCount = messageCount;
                    console.log(`[CHAT-LIMITS] 📝 Incrementing count: ${messageCount - 1} → ${messageCount}`);
                    
                    // Сохраняем обновленные данные
                    const upsertQuery = `
                        DECLARE $ip AS Utf8;
                        DECLARE $count AS Int32;
                        DECLARE $timestamp AS Int64;
                        
                        UPSERT INTO chat_limits (ip_address, message_count, last_reset_timestamp)
                        VALUES ($ip, $count, $timestamp);
                    `;
                    
                    console.log(`[CHAT-LIMITS] 💾 Executing UPSERT: ip=${ipAddress}, count=${messageCount}, timestamp=${lastResetTimestamp}`);
                    await session.executeQuery(upsertQuery, {
                        '$ip': TypedValues.utf8(ipAddress),
                        '$count': TypedValues.int32(messageCount),
                        '$timestamp': TypedValues.int64(BigInt(lastResetTimestamp)) // YDB Int64 ожидает BigInt в JS
                    });
                    
                    console.log(`[CHAT-LIMITS] ✅ Updated IP ${ipAddress}: ${messageCount}/${MAX_MESSAGES_PER_DAY} messages`);
                }
            } catch (queryError) {
                // Таблица не существует?
                if (queryError.message?.includes('Cannot find table') || queryError.message?.includes('does not exist')) {
                    console.error(`[CHAT-LIMITS] 🚨 TABLE NOT FOUND! You must create 'chat_limits' table in YDB first!`);
                    console.error(`[CHAT-LIMITS] SQL to create table:\nCREATE TABLE chat_limits (\n    ip_address Utf8 NOT NULL,\n    message_count Int32,\n    last_reset_timestamp Int64,\n    PRIMARY KEY (ip_address)\n);`);
                } else {
                    console.error(`[CHAT-LIMITS] Query error: ${queryError.message}`);
                }
                throw queryError;
            }
        });
        
        return {
            allowed: !isLimitExceeded,
            currentCount: currentCount,
            maxCount: MAX_MESSAGES_PER_DAY,
            tableExists: tableExists
        };
    } catch (error) {
        console.error('[CHAT-LIMITS] ⚠️ Error checking limit (allowing message to pass):', error.message);
        // Если БД не работает, разрешаем сообщение (не блокируем из-за ошибки)
        return {
            allowed: true,
            currentCount: 0,
            maxCount: MAX_MESSAGES_PER_DAY,
            tableExists: false
        };
    }
}

// ============ Yandex Chat Handler ============

async function handleYandexChat(body, headers, event) {
    const handlerId = crypto.randomUUID().substring(0, 8);

    try {
        // Получаем IP адрес клиента из заголовков
        const ipAddress = (event?.headers?.['x-forwarded-for'] || 
                          event?.headers?.['x-real-ip'] || 
                          event?.requestContext?.identity?.sourceIp ||
                          'unknown').split(',')[0].trim();
        
        console.log(`[YANDEX-CHAT-${handlerId}] Client IP: ${ipAddress}`);

        let { message, userName, isFirstMessage, history } = body;
        console.log(`[YANDEX-CHAT-${handlerId}] Received message (${message?.length || 0} chars)`);
        if (userName) console.log(`[YANDEX-CHAT-${handlerId}] User: ${userName}`);

        // Обработка первого сообщения - приветствие (без проверки лимита)
        if (isFirstMessage && userName) {
            console.log(`[YANDEX-CHAT-${handlerId}] First message - sending greeting`);
            const greeting = `Привет, ${userName}! 👋 Я AI-ассистент веб-студии MP.WebStudio. 

Мы создаём современные и функциональные веб-решения для бизнеса. Специализируемся на сайтах-визитках, лендингах, корпоративных сайтах и интернет-магазинах.

Я помогу вам разобраться с нашими услугами, ценами, сроками и процессом разработки. Что вас интересует?`;

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    response: greeting,
                }),
            };
        }

        // Валидация сообщения
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            console.warn(`[YANDEX-CHAT-${handlerId}] Empty message received`);
            return {
                statusCode: 200, // Return 200 to prevent widget from showing raw error
                headers,
                body: JSON.stringify({
                    success: false,
                    response: 'Сообщение не может быть пусто',
                }),
            };
        }

        if (message.length > 15000) {
            console.warn(`[YANDEX-CHAT-${handlerId}] Message too long: ${message.length}`);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: false,
                    response: 'Сообщение слишком длинное (макс 15000 символов)',
                }),
            };
        }

        // ⏱️ ПРОВЕРКА ЛИМИТА ПО IP (10 сообщений в 24 часа)
        const limitCheck = await checkAndUpdateChatLimit(ipAddress);
        
        if (!limitCheck.allowed) {
            console.warn(`[YANDEX-CHAT-${handlerId}] Rate limit exceeded for IP ${ipAddress}`);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: false,
                    response: `⏸️ Похоже, на сегодня лимит вопросов исчерпан. Мы подготовили для вас другие способы связи:\n\n📩 Напишите нам: mpwebstudio1@gmail.com\n📞 Позвоните: +7 (953) 181-41-36\n👥 Наше сообщество: https://vk.com/mp.webstudio\n\nС уважением MP.WebStudio.`,
                }),
            };
        }
        
        console.log(`[YANDEX-CHAT-${handlerId}] Rate limit check OK - IP ${ipAddress}: ${limitCheck.currentCount}/${limitCheck.maxCount} messages`);

        // Проверяем переменные окружения
        const folderId = process.env.YC_FOLDER_ID;

        if (!folderId) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    response: 'Yandex AI не настроен на сервере',
                }),
            };
        }

        // Получаем ограниченную историю (последние 10 сообщений)
        const limitedHistory = (history || []).slice(-10).map(msg => ({
            role: msg.role,
            text: msg.content || msg.text
        }));

        console.log(`[YANDEX-CHAT-${handlerId}] Sending to Yandex AI with ${limitedHistory.length} history messages`);

        const companyContext = (process.env.COMPANY_CONTEXT || '').trim();
        const systemPrompt = `Ты — профессиональный AI-ассистент компании MP.WebStudio. Ты хорошо знаешь все услуги, цены, процесс разработки и технологии студии.

${companyContext || 'MP.WebStudio — веб-студия полного цикла. Мы создаём современные и функциональные веб-решения для бизнеса.'}

ВАЖНЫЕ ПРАВИЛА:
- Отвечай вежливо и профессионально
- Если клиент спрашивает про цену — сразу скажи точную стоимость
- Если нужна консультация или уточнение деталей — предложи связаться по телефону или email
- Если спрашивают про сроки — скажи что сроки обговариваются при обсуждении проекта
- Поддержка после запуска — 1 месяц включен в цену
- Используй информацию о портфолио когда уместно
- Отвечай кратко и по существу`;

        const allMessages = [
            { role: 'system', text: systemPrompt },
            ...limitedHistory,
            { role: 'user', text: message }
        ];

        const modelUri = `gpt://${folderId}/yandexgpt-lite/latest`;
        const completionOptions = {
            stream: false,
            temperature: 0.6,
            maxTokens: '2000'
        };

        console.log(`[YANDEX-CHAT-${handlerId}] Request details:`, JSON.stringify({
            modelUri,
            completionOptions,
            messageCount: allMessages.length,
            folderId: folderId // Added for debugging 403
        }));

        // Sending request to Yandex AI
        const startTime = Date.now();
        let response;
        try {
            response = await httpsRequest('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getYandexAuthHeader()
                },
                body: JSON.stringify({
                    modelUri: modelUri,
                    completionOptions: completionOptions,
                    messages: allMessages
                })
            });
        } catch (e) {
            console.error(`[YANDEX-CHAT-${handlerId}] Request failed: ${e.message}`);
            throw e;
        }

        const elapsed = Math.round((Date.now() - startTime) / 1000);

        if (response.statusCode !== 200) {
            console.error(`[YANDEX-CHAT-${handlerId}] API Error: ${response.statusCode}`, response.data);
            return {
                statusCode: 200, // Still return 200 to show friendly error in widget
                headers,
                body: JSON.stringify({
                    success: false,
                    response: `Ошибка API Yandex (${response.statusCode}). Проверьте права доступа (role: ai.languageModels.user) для сервисного аккаунта в каталоге.`,
                    details: response.data
                }),
            };
        }

        const responseData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
        const assistantMessageRaw = responseData.result?.alternatives?.[0]?.message?.text || 'Нет ответа';
        const assistantMessage = await processAiCommands(assistantMessageRaw, handlerId);

        console.log(`[YANDEX-CHAT-${handlerId}] Success! Response: ${assistantMessage.length} chars, ${elapsed}s`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                response: assistantMessage,
            }),
        };

    } catch (error) {
        console.error(`[YANDEX-CHAT-${handlerId}] Error: ${error.message}`);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                response: `Ошибка: ${error.message}`,
            }),
        };
    }
}

// AWS Signature V4 signing helper
function signAwsRequest(method, host, path, accessKey, secretKey, payload = '') {
    const crypto = require('crypto');
    const algorithm = 'AWS4-HMAC-SHA256';
    const service = 's3';
    const region = 'ru-central1';
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.slice(0, 8);

    // Canonical request
    const canonicalHeaders = `host:${host}\nx-amz-content-sha256:UNSIGNED-PAYLOAD\nx-amz-date:${amzDate}\n`;
    const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';
    const payloadHash = crypto.createHash('sha256').update(payload).digest('hex');

    const canonicalRequest = [
        method,
        path,
        '',
        canonicalHeaders,
        signedHeaders,
        payloadHash
    ].join('\n');

    // String to sign
    const canonicalRequestHash = crypto.createHash('sha256').update(canonicalRequest).digest('hex');
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const stringToSign = [
        algorithm,
        amzDate,
        credentialScope,
        canonicalRequestHash
    ].join('\n');

    // Calculate signature
    const kDate = crypto.createHmac('sha256', `AWS4${secretKey}`).update(dateStamp).digest();
    const kRegion = crypto.createHmac('sha256', kDate).update(region).digest();
    const kService = crypto.createHmac('sha256', kRegion).update(service).digest();
    const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
    const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

    const authorizationHeader = `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    return {
        'Authorization': authorizationHeader,
        'X-Amz-Date': amzDate,
        'X-Amz-Content-Sha256': 'UNSIGNED-PAYLOAD'
    };
}