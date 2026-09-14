import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import https from 'node:https'

const readBody = (req) => new Promise((resolve, reject) => {
  let body = ''
  req.on('data', (chunk) => {
    body += chunk
  })
  req.on('end', () => resolve(body))
  req.on('error', reject)
})

const postJson = ({ hostname, path, headers, body }) => new Promise((resolve, reject) => {
  const requestBody = JSON.stringify(body)
  const request = https.request({
    hostname,
    path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody),
      ...headers,
    },
  }, (response) => {
    let responseBody = ''
    response.on('data', (chunk) => {
      responseBody += chunk
    })
    response.on('end', () => {
      resolve({
        statusCode: response.statusCode || 500,
        body: responseBody,
      })
    })
  })

  request.on('error', reject)
  request.write(requestBody)
  request.end()
})

const extractGeminiText = (data) => data.candidates?.flatMap((candidate) => candidate.content?.parts || [])
  .map((part) => part.text || '')
  .join('\n')
  .trim()

const extractGroqText = (data) => data.choices?.[0]?.message?.content?.trim()

const normalizeProviderResponse = (provider, responseBody) => {
  const data = JSON.parse(responseBody)
  if (provider === 'gemini') return { output_text: extractGeminiText(data), raw: data }
  if (provider === 'groq') return { output_text: extractGroqText(data), raw: data }
  return {
    output_text: data.output_text || data.output?.flatMap((item) => item.content || [])
      .map((content) => content.text || '')
      .join('\n')
      .trim(),
    raw: data,
  }
}

const aiProxyPlugin = () => ({
  name: 'creatorflow-ai-proxy',
  configureServer(server) {
    server.middlewares.use('/api/ai', async (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Method not allowed' }))
        return
      }

      try {
        const payload = JSON.parse(await readBody(req))
        const apiKey = String(payload.apiKey || '').trim()
        const provider = String(payload.provider || 'openai').toLowerCase()

        if (!apiKey) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'AI provider API key is missing' }))
          return
        }

        let upstream
        if (provider === 'gemini') {
          const model = payload.model || 'gemini-2.5-flash'
          upstream = await postJson({
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
            body: {
              contents: [{ role: 'user', parts: [{ text: payload.input || '' }] }],
            },
          })
        } else if (provider === 'groq') {
          upstream = await postJson({
            hostname: 'api.groq.com',
            path: '/openai/v1/chat/completions',
            headers: { Authorization: `Bearer ${apiKey}` },
            body: {
              model: payload.model || 'llama-3.1-8b-instant',
              messages: [{ role: 'user', content: payload.input || '' }],
            },
          })
        } else {
          upstream = await postJson({
            hostname: 'api.openai.com',
            path: '/v1/responses',
            headers: { Authorization: `Bearer ${apiKey}` },
            body: {
              model: payload.model || 'gpt-5',
              store: false,
              input: payload.input || '',
            },
          })
        }

        res.statusCode = upstream.statusCode
        res.setHeader('Content-Type', 'application/json')
        if (upstream.statusCode >= 200 && upstream.statusCode < 300) {
          res.end(JSON.stringify(normalizeProviderResponse(provider, upstream.body)))
        } else {
          res.end(upstream.body)
        }
      } catch (error) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: error.message }))
      }
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), aiProxyPlugin()],
  server: {
    proxy: {
      '/py-api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/py-api/, '/api'),
      },
    },
  },
})
