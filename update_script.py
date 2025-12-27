import sys

file_path = 'yandex-cloud-function/index.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Исправляем структуру chatRequest (выносим temperature и max_tokens из options)
old_request = """            const chatRequest = {
                model: 'GigaChat',
                messages: [
                    {
                        role: 'system',
                        content: 'Ты — вежливый AI-ассистент компании MP.WebStudio. Отвечай кратко и по делу, основываясь на информации о наших услугах.'
                    },
                    ...limitedHistory,
                    {
                        role: 'user',
                        content: message,
                    }
                ],
                temperature: 0.7,
                max_tokens: 800
            };"""

# Убедимся что мы ищем правильный кусок. В предыдущем шаге я уже пытался это сделать.
# Проверим что сейчас в файле.

new_request = """            const chatRequest = {
                model: 'GigaChat',
                messages: [
                    {
                        role: 'system',
                        content: 'Ты — вежливый AI-ассистент компании MP.WebStudio. Отвечай кратко и по делу, основываясь на информации о наших услугах.'
                    },
                    ...limitedHistory,
                    {
                        role: 'user',
                        content: message,
                    }
                ],
                temperature: 0.7,
                max_tokens: 800,
                profanity_check: true
            };"""

if old_request in content:
    content = content.replace(old_request, new_request)
else:
    # Попробуем найти по частям если не совпало в точности
    content = content.replace("options: {", "").replace("temperature: 0.7,", "temperature: 0.7,").replace("max_tokens: 1000,", "max_tokens: 800,")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
