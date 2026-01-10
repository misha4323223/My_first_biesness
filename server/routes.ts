import type { Express } from "express";
import { createServer, type Server } from "http";
import https from "https";
import { storage } from "./storage";
import { insertContactRequestSchema, insertOrderSchema, insertAdditionalInvoiceSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";
import crypto from "crypto";

const ROBOKASSA_MERCHANT_LOGIN = process.env.ROBOKASSA_MERCHANT_LOGIN?.trim() || "";
const ROBOKASSA_PASSWORD1 = process.env.ROBOKASSA_PASSWORD1?.trim() || "";
const ROBOKASSA_PASSWORD2 = process.env.ROBOKASSA_PASSWORD2?.trim() || "";
const IS_TEST_MODE = true;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID?.trim() || "";
const SITE_URL = process.env.SITE_URL?.trim() || "https://mp-webstudio.ru";

const GIGACHAT_KEY = process.env.GIGACHAT_KEY || "";
const GIGACHAT_ID = process.env.GIGACHAT_ID || "";
const GIGACHAT_SCOPE = process.env.GIGACHAT_SCOPE || "GIGACHAT_API_PERS";

async function httpsRequest(
  urlString: string,
  options: { method: string; headers: Record<string, string>; body?: string }
): Promise<{ statusCode: number; data: string }> {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const startTime = Date.now();
    const requestId = crypto.randomUUID().substring(0, 8);
    
    console.log(`\n   [HTTPS-${requestId}] ========== STARTING REQUEST ==========`);
    console.log(`   [HTTPS-${requestId}] URL: ${urlString}`);
    console.log(`   [HTTPS-${requestId}] Method: ${options.method}`);
    console.log(`   [HTTPS-${requestId}] Hostname: ${url.hostname}`);
    console.log(`   [HTTPS-${requestId}] Port: ${url.port || 443}`);
    console.log(`   [HTTPS-${requestId}] Path: ${url.pathname}`);
    
    const bodySize = options.body ? Buffer.byteLength(options.body) : 0;
    console.log(`   [HTTPS-${requestId}] Request body size: ${bodySize} bytes`);
    
    console.log(`   [HTTPS-${requestId}] Headers:`);
    Object.entries(options.headers).forEach(([key, value]) => {
      const displayValue = key.toLowerCase().includes('auth') ? '[REDACTED]' : value.substring(0, 50) + (value.length > 50 ? '...' : '');
      console.log(`   [HTTPS-${requestId}]   ${key}: ${displayValue}`);
    });
    
    const TIMEOUT_MS = 90000;  // Увеличен до 90 сек для GigaChat
    const SOCKET_TIMEOUT_MS = 95000;
    
    let socketTimeoutId: NodeJS.Timeout | null = null;
    let requestTimeoutId: NodeJS.Timeout | null = null;
    let hasResponded = false;
    let receivedFirstByte = false;
    let totalBytesReceived = 0;
    
    const cleanup = () => {
      if (requestTimeoutId) clearTimeout(requestTimeoutId);
      if (socketTimeoutId) clearTimeout(socketTimeoutId);
    };
    
    const elapsed = () => Math.round((Date.now() - startTime) / 1000);
    const elapsedMs = () => Math.round((Date.now() - startTime));
    
    requestTimeoutId = setTimeout(() => {
      cleanup();
      console.error(`   [HTTPS-${requestId}] ❌ MAIN TIMEOUT: No response after ${elapsed()}s (${elapsedMs()}ms)`);
      console.error(`   [HTTPS-${requestId}] hasResponded: ${hasResponded}, receivedFirstByte: ${receivedFirstByte}, totalBytes: ${totalBytesReceived}`);
      req.destroy();
      reject(new Error(`Request timeout after ${elapsed()}s`));
    }, TIMEOUT_MS);
    
    const reqOptions = {
      method: options.method,
      headers: options.headers,
      rejectUnauthorized: false,
      timeout: SOCKET_TIMEOUT_MS,
    };
    
    console.log(`   [HTTPS-${requestId}] Creating HTTPS request with timeout: ${SOCKET_TIMEOUT_MS}ms`);
    const req = https.request(url, reqOptions, (res) => {
      hasResponded = true;
      console.log(`   [HTTPS-${requestId}] ✅ Response received after ${elapsed()}s (${elapsedMs()}ms)`);
      console.log(`   [HTTPS-${requestId}] Status Code: ${res.statusCode}`);
      console.log(`   [HTTPS-${requestId}] Response Headers:`);
      Object.entries(res.headers).forEach(([key, value]) => {
        console.log(`   [HTTPS-${requestId}]   ${key}: ${String(value).substring(0, 100)}`);
      });
      
      socketTimeoutId = setTimeout(() => {
        cleanup();
        console.error(`   [HTTPS-${requestId}] ❌ RESPONSE TIMEOUT: No data after ${elapsed()}s, received ${totalBytesReceived} bytes so far`);
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
        console.log(`   [HTTPS-${requestId}] 📥 Chunk: ${chunk.length} bytes (total: ${totalBytesReceived})`);
        
        if (socketTimeoutId) clearTimeout(socketTimeoutId);
        socketTimeoutId = setTimeout(() => {
          cleanup();
          console.error(`   [HTTPS-${requestId}] ❌ DATA TIMEOUT: No data chunks after ${elapsed()}s, received ${totalBytesReceived} bytes total`);
          req.destroy();
          reject(new Error('Data timeout'));
        }, SOCKET_TIMEOUT_MS);
        
        data += chunk;
      });
      
      res.on('end', () => {
        cleanup();
        console.log(`   [HTTPS-${requestId}] ✅ Response completed after ${elapsed()}s (${elapsedMs()}ms)`);
        console.log(`   [HTTPS-${requestId}] Total data length: ${data.length} bytes`);
        console.log(`   [HTTPS-${requestId}] ========== REQUEST SUCCESS ==========\n`);
        resolve({ statusCode: res.statusCode || 500, data });
      });
    });
    
    req.on('socket', (socket) => {
      console.log(`   [HTTPS-${requestId}] 🔌 Socket created, fd: ${socket.fd}`);
      
      socket.on('connect', () => {
        console.log(`   [HTTPS-${requestId}] 🔗 Socket connected to ${url.hostname} after ${elapsedMs()}ms`);
      });
      
      socket.on('secureConnect', () => {
        console.log(`   [HTTPS-${requestId}] 🔒 TLS handshake complete after ${elapsedMs()}ms`);
      });
      
      socket.on('close', (hadError) => {
        console.log(`   [HTTPS-${requestId}] ❌ Socket closed (hadError: ${hadError}) after ${elapsed()}s`);
      });
      
      socket.on('error', (err) => {
        console.error(`   [HTTPS-${requestId}] ❌ Socket error: ${err.message}`);
      });
      
      socket.on('timeout', () => {
        console.log(`   [HTTPS-${requestId}] ⏱️ Socket timeout event after ${elapsed()}s`);
      });
    });
    
    req.on('error', (err) => {
      cleanup();
      const errorMessage = (err as Error).message;
      const errorCode = (err as any).code;
      const errorErrno = (err as any).errno;
      
      console.error(`   [HTTPS-${requestId}] ❌ REQUEST ERROR after ${elapsed()}s (${elapsedMs()}ms)`);
      console.error(`   [HTTPS-${requestId}] Error message: ${errorMessage}`);
      console.error(`   [HTTPS-${requestId}] Error code: ${errorCode}`);
      console.error(`   [HTTPS-${requestId}] Error errno: ${errorErrno}`);
      console.error(`   [HTTPS-${requestId}] Stack: ${(err as Error).stack}`);
      console.error(`   [HTTPS-${requestId}] State: hasResponded=${hasResponded}, receivedFirstByte=${receivedFirstByte}, totalBytes=${totalBytesReceived}`);
      console.error(`   [HTTPS-${requestId}] ========== REQUEST FAILED ==========\n`);
      
      reject(err);
    });
    
    req.on('timeout', () => {
      cleanup();
      console.error(`   [HTTPS-${requestId}] ⏱️ REQUEST TIMEOUT EVENT after ${elapsed()}s (${elapsedMs()}ms)`);
      console.error(`   [HTTPS-${requestId}] State: hasResponded=${hasResponded}, receivedFirstByte=${receivedFirstByte}, totalBytes=${totalBytesReceived}`);
      req.destroy();
      reject(new Error('Socket timeout'));
    });
    
    if (options.body) {
      const bodyStr = options.body.substring(0, 200) + (options.body.length > 200 ? '...' : '');
      console.log(`   [HTTPS-${requestId}] 📝 Request body: ${bodyStr}`);
      req.write(options.body);
      console.log(`   [HTTPS-${requestId}] Body written, ${bodySize} bytes`);
    }
    
    console.log(`   [HTTPS-${requestId}] Ending request (calling req.end())`);
    req.end();
    console.log(`   [HTTPS-${requestId}] Request ended, waiting for response...`);
  });
}

async function sendTelegramMessage(message: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log("Telegram not configured, skipping notification");
    return;
  }
  
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
  }
}

let orderCounter = 1;

function getNextInvId(): number {
  return orderCounter++;
}

function generateRobokassaSignature(merchantLogin: string, sum: string, invId: number, password: string, shpOrderId: string, receipt?: string): string {
  const signatureString = receipt 
    ? `${merchantLogin}:${sum}:${invId}:${receipt}:${password}:shp_orderId=${shpOrderId}`
    : `${merchantLogin}:${sum}:${invId}:${password}:shp_orderId=${shpOrderId}`;
  return crypto.createHash("md5").update(signatureString).digest("hex");
}

function verifyRobokassaSignature(sum: string, invId: string, signatureValue: string, shpOrderId: string): boolean {
  const signatureString = `${sum}:${invId}:${ROBOKASSA_PASSWORD2}:shp_orderId=${shpOrderId}`;
  const calculatedSignature = crypto.createHash("md5").update(signatureString).digest("hex");
  return calculatedSignature.toLowerCase() === signatureValue.toLowerCase();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactRequestSchema.parse(req.body);
      const contactRequest = await storage.createContactRequest(validatedData);
      
      console.log("New contact request received:", {
        name: contactRequest.name,
        email: contactRequest.email,
        message: contactRequest.message.substring(0, 50) + "...",
      });

      await sendTelegramMessage(
        `📩 <b>Новая заявка с сайта!</b>\n\n` +
        `👤 Имя: ${contactRequest.name}\n` +
        `📞 Телефон: ${contactRequest.phone}\n` +
        `📧 Email: ${contactRequest.email}\n` +
        `📋 Тип проекта: ${contactRequest.projectType || 'Не указан'}\n` +
        `💰 Бюджет: ${contactRequest.budget || 'Не указан'}\n` +
        `💬 Сообщение:\n${contactRequest.message}`
      );

      res.status(201).json({
        success: true,
        message: "Заявка успешно отправлена",
        id: contactRequest.id,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Ошибка валидации",
          errors: error.errors,
        });
      } else {
        console.error("Error creating contact request:", error);
        res.status(500).json({
          success: false,
          message: "Внутренняя ошибка сервера",
        });
      }
    }
  });

  app.get("/api/contact", async (req, res) => {
    try {
      const requests = await storage.getContactRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching contact requests:", error);
      res.status(500).json({
        success: false,
        message: "Внутренняя ошибка сервера",
      });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      
      console.log("New order created:", {
        id: order.id,
        clientName: order.clientName,
        projectType: order.projectType,
        amount: order.amount,
      });

      const invId = getNextInvId();
      const sum = parseFloat(order.amount).toFixed(2);
      const description = `Заказ #${order.id}`;
      
      // Формируем чековую информацию (номенклатуру) для Робочеков
      const receipt = {
        items: [
          {
            name: `Разработка сайта: ${order.projectType}`,
            quantity: 1,
            sum: sum,
            payment_method: "full_prepayment",
            payment_object: "service",
            tax: "none"
          }
        ]
      };
      
      const receiptBase64 = Buffer.from(JSON.stringify(receipt)).toString('base64');

      const signatureValue = generateRobokassaSignature(
        ROBOKASSA_MERCHANT_LOGIN,
        sum,
        invId,
        ROBOKASSA_PASSWORD1,
        order.id,
        receiptBase64
      );

      const baseUrl = "https://auth.robokassa.ru/Merchant/Index.aspx";
      
      const paymentUrl = `${baseUrl}?MerchantLogin=${ROBOKASSA_MERCHANT_LOGIN}&OutSum=${sum}&InvId=${invId}&Description=${encodeURIComponent(description)}&SignatureValue=${signatureValue}&Receipt=${encodeURIComponent(receiptBase64)}&IsTest=${IS_TEST_MODE ? 1 : 0}&shp_orderId=${order.id}`;

      res.status(201).json({
        success: true,
        message: "Заказ создан",
        orderId: order.id,
        paymentUrl,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Ошибка валидации",
          errors: error.errors,
        });
      } else {
        console.error("Error creating order:", error);
        res.status(500).json({
          success: false,
          message: "Внутренняя ошибка сервера",
        });
      }
    }
  });

  app.get("/api/orders", async (req, res) => {
    try {
      const showAll = req.query.all === "true";
      const orders = showAll ? await storage.getOrders() : await storage.getActiveOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({
        success: false,
        message: "Внутренняя ошибка сервера",
      });
    }
  });

  app.patch("/api/orders/:id/note", async (req, res) => {
    try {
      const { id } = req.params;
      const { note } = req.body;
      
      if (typeof note !== "string") {
        return res.status(400).json({
          success: false,
          message: "Заметка должна быть текстом",
        });
      }
      
      const order = await storage.updateOrderNote(id, note);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Заказ не найден",
        });
      }
      
      res.json({ success: true, order });
    } catch (error) {
      console.error("Error updating order note:", error);
      res.status(500).json({
        success: false,
        message: "Внутренняя ошибка сервера",
      });
    }
  });

  app.delete("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const order = await storage.softDeleteOrder(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Заказ не найден",
        });
      }
      
      res.json({ success: true, message: "Заказ удалён" });
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({
        success: false,
        message: "Внутренняя ошибка сервера",
      });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Заказ не найден",
        });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({
        success: false,
        message: "Внутренняя ошибка сервера",
      });
    }
  });

  app.post("/api/robokassa/result", async (req, res) => {
    try {
      const OutSum = req.body.OutSum || req.query.OutSum;
      const InvId = req.body.InvId || req.query.InvId;
      const SignatureValue = req.body.SignatureValue || req.query.SignatureValue;
      const shp_orderId = req.body.shp_orderId || req.query.shp_orderId;
      
      console.log("Robokassa result callback:", { OutSum, InvId, shp_orderId });
      
      if (!verifyRobokassaSignature(OutSum, InvId, SignatureValue, shp_orderId)) {
        console.error("Invalid Robokassa signature");
        return res.status(400).send("bad sign");
      }

      const order = await storage.getOrder(shp_orderId);
      if (!order) {
        console.error("Order not found:", shp_orderId);
        return res.status(404).send("order not found");
      }

      const projectTypeLabel = order.projectType === "landing" ? "Лендинг" : 
                              order.projectType === "corporate" ? "Корпоративный сайт" : "Интернет-магазин";
      
      if (order.status === "paid") {
        await storage.updateOrderStatus(shp_orderId, "completed", new Date());
        console.log("Order fully paid (remaining):", shp_orderId);
        
        // Получаем все дополнительные счета для этого заказа
        const additionalInvoices = await storage.getAdditionalInvoicesByOrderId(shp_orderId);
        const paidAdditionalInvoices = additionalInvoices.filter(inv => inv.status === "paid");
        
        let invoicesList = "";
        if (paidAdditionalInvoices.length > 0) {
          invoicesList = "\n\n📋 <b>Дополнительные работы (оплачены):</b>\n";
          paidAdditionalInvoices.forEach((inv, index) => {
            invoicesList += `${index + 1}. ${inv.description} - ${inv.amount} ₽\n`;
          });
        }
        
        await sendTelegramMessage(
          `✅ <b>Заказ полностью оплачен!</b>\n\n` +
          `👤 Клиент: ${order.clientName}\n` +
          `📧 Email: ${order.clientEmail}\n` +
          `📱 Телефон: ${order.clientPhone}\n` +
          `🌐 Тип: ${projectTypeLabel}\n` +
          `💰 Сумма: ${OutSum} ₽ (остаток)\n` +
          `📋 Заказ: ${shp_orderId.substring(0, 8).toUpperCase()}` +
          invoicesList
        );
      } else {
        await storage.updateOrderStatus(shp_orderId, "paid", new Date());
        console.log("Order prepaid successfully:", shp_orderId);
        
        const payRemainingLink = `${SITE_URL}/pay-remaining?orderId=${shp_orderId}`;
        
        await sendTelegramMessage(
          `💳 <b>Получена предоплата!</b>\n\n` +
          `👤 Клиент: ${order.clientName}\n` +
          `📧 Email: ${order.clientEmail}\n` +
          `📱 Телефон: ${order.clientPhone}\n` +
          `🌐 Тип: ${projectTypeLabel}\n` +
          `💰 Сумма: ${OutSum} ₽ (50%)\n` +
          `📋 Заказ: ${shp_orderId.substring(0, 8).toUpperCase()}\n\n` +
          `🔗 Ссылка для оплаты остатка:\n${payRemainingLink}`
        );
      }
      
      res.send(`OK${InvId}`);
    } catch (error) {
      console.error("Error processing Robokassa result:", error);
      res.status(500).send("error");
    }
  });

  app.get("/api/robokassa/success", async (req, res) => {
    const { shp_orderId } = req.query;
    res.redirect(`/payment-success?orderId=${shp_orderId}`);
  });

  app.get("/api/robokassa/fail", async (req, res) => {
    const { shp_orderId } = req.query;
    res.redirect(`/payment-fail?orderId=${shp_orderId}`);
  });

  app.post("/api/orders/pay-remaining", async (req, res) => {
    try {
      const { orderId } = req.body;
      
      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: "Не указан номер заказа",
        });
      }

      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Заказ не найден",
        });
      }

      if (order.status === "completed") {
        return res.status(400).json({
          success: false,
          message: "Заказ уже полностью оплачен",
        });
      }

      if (order.status !== "paid") {
        return res.status(400).json({
          success: false,
          message: "Предоплата по заказу не подтверждена",
        });
      }

      const invId = getNextInvId();
      const remainingAmount = (parseFloat(order.totalAmount || order.amount) - parseFloat(order.amount)).toFixed(2);
      const description = `Остаток #${order.id}`;
      
      // Формируем чековую информацию (номенклатуру) для Робочеков
      const receipt = {
        items: [
          {
            name: `Доплата за разработку: ${order.projectType}`,
            quantity: 1,
            sum: remainingAmount,
            payment_method: "full_payment",
            payment_object: "service",
            tax: "none"
          }
        ]
      };
      
      const receiptBase64 = Buffer.from(JSON.stringify(receipt)).toString('base64');

      const signatureValue = generateRobokassaSignature(
        ROBOKASSA_MERCHANT_LOGIN,
        remainingAmount,
        invId,
        ROBOKASSA_PASSWORD1,
        order.id,
        receiptBase64
      );

      const baseUrl = "https://auth.robokassa.ru/Merchant/Index.aspx";
      
      const paymentUrl = `${baseUrl}?MerchantLogin=${ROBOKASSA_MERCHANT_LOGIN}&OutSum=${remainingAmount}&InvId=${invId}&Description=${encodeURIComponent(description)}&SignatureValue=${signatureValue}&Receipt=${encodeURIComponent(receiptBase64)}&IsTest=${IS_TEST_MODE ? 1 : 0}&shp_orderId=${order.id}`;

      res.json({
        success: true,
        message: "Ссылка на оплату сформирована",
        orderId: order.id,
        amount: remainingAmount,
        paymentUrl,
      });
    } catch (error) {
      console.error("Error creating remaining payment:", error);
      res.status(500).json({
        success: false,
        message: "Внутренняя ошибка сервера",
      });
    }
  });

  app.post("/api/additional-invoices", async (req, res) => {
    try {
      console.log("Creating additional invoice with data:", req.body);
      
      const validatedData = insertAdditionalInvoiceSchema.parse(req.body);
      console.log("Validated data:", validatedData);
      
      // Проверяем, существует ли заказ
      const order = await storage.getOrder(validatedData.orderId);
      console.log("Order lookup result:", order);
      
      if (!order) {
        console.log("Order not found for ID:", validatedData.orderId);
        return res.status(404).json({
          success: false,
          message: "Заказ не найден. Проверьте ID заказа",
        });
      }
      
      console.log("Creating invoice in database...");
      const invoice = await storage.createAdditionalInvoice(validatedData);
      console.log("Invoice created:", invoice);
      
      const invId = getNextInvId();
      const sum = parseFloat(invoice.amount).toFixed(2);
      const description = `Счёт #${invoice.id}`;
      
      // Формируем чековую информацию (номенклатуру) для Робочеков
      const receipt = {
        items: [
          {
            name: `Доп. услуга: ${invoice.description}`,
            quantity: 1,
            sum: sum,
            payment_method: "full_payment",
            payment_object: "service",
            tax: "none"
          }
        ]
      };
      
      const receiptBase64 = Buffer.from(JSON.stringify(receipt)).toString('base64');

      const signatureValue = generateRobokassaSignature(
        ROBOKASSA_MERCHANT_LOGIN,
        sum,
        invId,
        ROBOKASSA_PASSWORD1,
        invoice.id,
        receiptBase64
      );

      const baseUrl = "https://auth.robokassa.ru/Merchant/Index.aspx";
      const paymentUrl = `${baseUrl}?MerchantLogin=${ROBOKASSA_MERCHANT_LOGIN}&OutSum=${sum}&InvId=${invId}&Description=${encodeURIComponent(description)}&SignatureValue=${signatureValue}&Receipt=${encodeURIComponent(receiptBase64)}&IsTest=${IS_TEST_MODE ? 1 : 0}&shp_orderId=${invoice.id}`;

      console.log("Updating invoice status...");
      await storage.updateAdditionalInvoiceStatus(invoice.id, "pending", String(invId));
      console.log("Invoice status updated. Payment URL:", paymentUrl);

      res.status(201).json({
        success: true,
        message: "Счёт создан",
        invoiceId: invoice.id,
        paymentUrl,
      });
    } catch (error) {
      console.error("Error creating additional invoice:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        res.status(400).json({
          success: false,
          message: "Ошибка валидации",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Внутренняя ошибка сервера",
        });
      }
    }
  });

  app.get("/api/additional-invoices/order/:orderId", async (req, res) => {
    try {
      const invoices = await storage.getAdditionalInvoicesByOrderId(req.params.orderId);
      res.json(invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({
        success: false,
        message: "Внутренняя ошибка сервера",
      });
    }
  });

  app.post("/api/robokassa/additional-invoice", async (req, res) => {
    try {
      const OutSum = req.body.OutSum || req.query.OutSum;
      const InvId = req.body.InvId || req.query.InvId;
      const SignatureValue = req.body.SignatureValue || req.query.SignatureValue;
      const shp_orderId = req.body.shp_orderId || req.query.shp_orderId;
      
      console.log("Robokassa additional invoice callback:", { OutSum, InvId, shp_orderId });
      
      if (!verifyRobokassaSignature(OutSum, InvId, SignatureValue, shp_orderId)) {
        console.error("Invalid Robokassa signature for additional invoice");
        return res.status(400).send("bad sign");
      }

      const invoice = await storage.getAdditionalInvoice(shp_orderId);
      if (!invoice) {
        console.error("Invoice not found:", shp_orderId);
        return res.status(404).send("invoice not found");
      }

      const order = await storage.getOrder(invoice.orderId);
      if (!order) {
        console.error("Order not found:", invoice.orderId);
        return res.status(404).send("order not found");
      }

      await storage.updateAdditionalInvoiceStatus(invoice.id, "paid", String(InvId), new Date());

      // Отправляем email уведомление о принятии платежа за доп счет
      try {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #3b82f6;">Платеж принят</h2>
            <p>Здравствуйте, ${order.clientName}!</p>
            <p>Спасибо! Ваш платеж успешно получен и обработан.</p>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <h3 style="margin-top: 0; color: #1e40af;">Дополнительная работа</h3>
              <p><strong>Описание:</strong> ${invoice.description}</p>
              <p><strong>Сумма:</strong> <span style="font-size: 18px; color: #10b981;">${OutSum} ₽</span></p>
              <p><strong>Статус:</strong> <span style="color: #10b981;">✓ Оплачено</span></p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Полный акт выполненных работ с учётом всех дополнительных услуг будет отправлен после оплаты остатка основного заказа.<br><br>
              С уважением,<br>MP.WebStudio<br>
              <a href="https://mp-webstudio.ru" style="color: #3b82f6;">mp-webstudio.ru</a>
            </p>
          </div>
        `;

        // Используем встроенный SMTP если доступен
        const nodemailer = require("nodemailer");
        const transporter = nodemailer.createTransport({
          host: "smtp.yandex.ru",
          port: 465,
          secure: true,
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: `"MP.WebStudio" <${process.env.SMTP_EMAIL || "noreply@mp-webstudio.ru"}>`,
          to: order.clientEmail,
          subject: `Платеж принят: ${invoice.description}`,
          html: emailHtml,
        });

        console.log("Additional invoice payment email sent to:", order.clientEmail);
      } catch (emailError) {
        console.error("Failed to send additional invoice email:", emailError instanceof Error ? emailError.message : emailError);
        // Не прерываем процесс если email не отправился
      }

      await sendTelegramMessage(
        `💳 <b>Дополнительный счёт оплачен!</b>\n\n` +
        `👤 Клиент: ${order.clientName}\n` +
        `📋 Счёт: ${invoice.description}\n` +
        `💰 Сумма: ${OutSum} ₽\n` +
        `📧 Email: ${order.clientEmail}`
      );
      
      res.send(`OK${InvId}`);
    } catch (error) {
      console.error("Error processing additional invoice payment:", error);
      res.status(500).send("error");
    }
  });

  // Admin Authentication
  const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'mp-webstudio-admin-secret-2024';
  const TOKEN_EXPIRY_HOURS = 24;

  function generateAdminToken(): string {
    const now = Date.now();
    const expiry = now + (TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);
    const payload = JSON.stringify({ exp: expiry, iat: now, role: 'admin' });
    const payloadBase64 = Buffer.from(payload).toString('base64url');
    const signature = crypto.createHmac('sha256', ADMIN_TOKEN_SECRET)
      .update(payloadBase64)
      .digest('base64url');
    return `${payloadBase64}.${signature}`;
  }

  function verifyAdminToken(token: string): boolean {
    if (!token || typeof token !== 'string') return false;
    
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    
    const [payloadBase64, signature] = parts;
    
    const expectedSignature = crypto.createHmac('sha256', ADMIN_TOKEN_SECRET)
      .update(payloadBase64)
      .digest('base64url');
    
    if (signature !== expectedSignature) return false;
    
    try {
      const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString());
      if (payload.exp < Date.now()) return false;
      return true;
    } catch {
      return false;
    }
  }

  app.post("/api/admin-login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
      
      if (!adminEmail || !adminPassword) {
        return res.status(500).json({ success: false, message: 'Admin not configured' });
      }
      
      const safeCompare = (a: string | undefined, b: string | undefined): boolean => {
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
        return res.json({ success: true, token });
      }
      
      console.log('Admin login failed - invalid credentials');
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  app.post("/api/verify-admin", async (req, res) => {
    const { token } = req.body;
    const valid = verifyAdminToken(token);
    res.json({ valid });
  });

  app.post("/api/send-calculator-order", async (req, res) => {
    try {
      const { name, phone, email, projectType, selectedFeatures, basePrice, totalPrice, description } = req.body;

      console.log("Calculator order request received:", { name, email, projectType, basePrice, totalPrice });

      if (!name || !phone || !email || !projectType || !description) {
        return res.status(400).json({
          success: false,
          message: "Заполните все обязательные поля",
        });
      }

      if (!basePrice || !totalPrice) {
        console.error("Missing price information:", { basePrice, totalPrice });
        return res.status(400).json({
          success: false,
          message: "Ошибка расчёта стоимости. Попробуйте снова",
        });
      }

      console.log("Calculator order validated:", { name, email, projectType });

      const projectTypeLabel = projectType === "bizcard" ? "Сайт-визитка" :
                              projectType === "landing" ? "Лендинг" :
                              projectType === "corporate" ? "Корпоративный сайт" : "Интернет-магазин";

      let featuresList = "";
      if (selectedFeatures && selectedFeatures.length > 0) {
        featuresList = "\n📋 <b>Выбранные опции:</b>\n";
        selectedFeatures.forEach((feature: string, index: number) => {
          featuresList += `${index + 1}. ${feature}\n`;
        });
      }

      await sendTelegramMessage(
        `🎯 <b>НОВЫЙ ЗАКАЗ ИЗ КАЛЬКУЛЯТОРА</b>\n\n` +
        `📋 <b>Проект:</b>\n` +
        `• База: ${projectTypeLabel}\n` +
        `• Стоимость базы: ${basePrice.toLocaleString('ru-RU')} ₽` +
        featuresList +
        `\n💰 <b>Итого: ${totalPrice.toLocaleString('ru-RU')} ₽</b>\n\n` +
        `👤 <b>Контакты:</b>\n` +
        `• Имя: ${name}\n` +
        `• Телефон: ${phone}\n` +
        `• Email: ${email}\n\n` +
        `📝 <b>Описание:</b>\n${description}`
      );

      console.log("Calculator order sent successfully");
      res.status(201).json({
        success: true,
        message: "Заказ успешно отправлен",
      });
    } catch (error) {
      console.error("Error sending calculator order:", error instanceof Error ? error.message : error);
      res.status(500).json({
        success: false,
        message: "Внутренняя ошибка сервера",
      });
    }
  });

  // Giga Chat API endpoint
  app.post("/api/giga-chat", async (req, res) => {
    console.log("\n\n=== GIGACHAT REQUEST START ===");
    try {
      const { message, userName, isFirstMessage } = req.body;
      console.log("1️⃣ Received message:", message.substring(0, 50) + "...");
      if (userName) console.log("   User name:", userName);
      if (isFirstMessage) console.log("   First message:", isFirstMessage);
      
      // Валидация сообщения
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        console.log("❌ Message validation failed");
        return res.status(400).json({
          success: false,
          response: 'Сообщение не может быть пусто',
        });
      }

      if (message.length > 2000) {
        console.log("❌ Message too long");
        return res.status(400).json({
          success: false,
          response: 'Сообщение слишком длинное (макс 2000 символов)',
        });
      }

      const gigachatKey = process.env.GIGACHAT_KEY;
      const gigachatScope = process.env.GIGACHAT_SCOPE || 'GIGACHAT_API_PERS';
      
      console.log("2️⃣ GIGACHAT_KEY exists:", !!gigachatKey);
      console.log("   Key length:", gigachatKey?.length);
      
      if (!gigachatKey) {
        console.error('❌ GIGACHAT_KEY not configured');
        return res.status(500).json({
          success: false,
          response: 'GigaChat не настроен на сервере',
        });
      }

      const authBody = `scope=${encodeURIComponent(gigachatScope)}`;
      
      console.log("3️⃣ Requesting OAuth token from Sberbank...");
      
      let authResponse;
      try {
        authResponse = await httpsRequest('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Authorization': `Basic ${gigachatKey}`,
            'RqUID': crypto.randomUUID(),
          },
          body: authBody,
        });
      } catch (fetchErr) {
        const errMsg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
        console.error('❌ HTTPS error during OAuth:', errMsg);
        throw new Error(`OAuth network error: ${errMsg}`);
      }

      console.log("4️⃣ Auth response status:", authResponse.statusCode);

      if (authResponse.statusCode !== 200) {
        console.error('❌ Auth failed. Status:', authResponse.statusCode);
        console.error('Response:', authResponse.data.substring(0, 500));
        throw new Error(`Auth error: ${authResponse.statusCode} - ${authResponse.data.substring(0, 100)}`);
      }

      let authData;
      try {
        authData = JSON.parse(authResponse.data);
      } catch (parseErr) {
        console.error('❌ Failed to parse auth response');
        throw new Error('Invalid auth response format');
      }

      const accessToken = authData.access_token;
      console.log("5️⃣ Got access token. Length:", accessToken?.length);

      if (!accessToken) {
        console.error('❌ No access token in auth response');
        throw new Error('No access token in response');
      }

      console.log("6️⃣ Sending chat request to GigaChat...");
      
      const chatBody = JSON.stringify({
        model: 'GigaChat',
        messages: [
          ...limitedHistory,
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 800,
      });
      
      console.log("   URL:", chatUrl);
      console.log("   Access Token length:", accessToken.length);
      console.log("   Headers: Content-Type=application/json, Authorization=Bearer [token]");
      console.log("   [INFO] Chat request timeout: 45 seconds (optimized for Yandex Cloud)");
      
      let chatResponse;
      try {
        console.log("   ⏳ Waiting for chat response...");
        chatResponse = await httpsRequest(chatUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: chatBody,
        });
        console.log("   ✅ HTTPS request succeeded, status:", chatResponse.statusCode);
      } catch (fetchErr) {
        const errMsg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
        console.error('❌ HTTPS error during chat request:', errMsg);
        console.error('   Error type:', fetchErr instanceof Error ? fetchErr.constructor.name : typeof fetchErr);
        if (fetchErr instanceof Error && 'code' in fetchErr) {
          console.error('   Error code:', (fetchErr as any).code);
        }
        throw new Error(`Chat network error: ${errMsg}`);
      }

      console.log("7️⃣ Chat response status:", chatResponse.statusCode);

      if (chatResponse.statusCode !== 200) {
        console.error('❌ Chat API error. Status:', chatResponse.statusCode);
        console.error('Response:', chatResponse.data.substring(0, 500));
        throw new Error(`Chat error: ${chatResponse.statusCode} - ${chatResponse.data.substring(0, 100)}`);
      }

      let chatData;
      try {
        chatData = JSON.parse(chatResponse.data);
      } catch (parseErr) {
        console.error('❌ Failed to parse chat response');
        throw new Error('Invalid chat response format');
      }

      const assistantMessage = chatData.choices?.[0]?.message?.content || 'Нет ответа';

      console.log("8️⃣ Success! Response length:", assistantMessage.length);
      console.log("=== GIGACHAT REQUEST END (SUCCESS) ===\n");
      
      return res.json({
        success: true,
        response: assistantMessage,
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("❌ ERROR:", errorMsg);
      console.error("=== GIGACHAT REQUEST FAILED ===\n");
      
      return res.status(500).json({
        success: false,
        response: `Ошибка: ${errorMsg}`,
      });
    }
  });

  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send("User-agent: *\nAllow: /\nSitemap: https://mp-webstudio.ru/sitemap.xml");
  });

  app.get("/sitemap.xml", (req, res) => {
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
    (page) => `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>2026-01-09</lastmod>
    <changefreq>${page.freq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    res.type("application/xml");
    res.send(sitemap);
  });

  return httpServer;
}
