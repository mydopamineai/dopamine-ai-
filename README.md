# Dopamine AI

A mobile-friendly Hindi / English / Hinglish AI companion web app.

## Important
- `index.html` is the chat interface.
- `server.js` calls the OpenAI Responses API from the server.
- Keep `OPENAI_API_KEY` private. Never paste it into `index.html` or share it in chat.
- Real AI replies require an API account, API key, and a server host. API usage may cost money.

## Run locally
1. Install Node.js 20+.
2. In this folder run: `npm install`
3. Set your API key as an environment variable:
   - macOS/Linux: `export OPENAI_API_KEY="your_key"`
   - Windows PowerShell: `$env:OPENAI_API_KEY="your_key"`
4. Run: `npm start`
5. Open `http://localhost:3000`

## Deploy
Deploy this folder to a Node.js host that supports environment variables. Set `OPENAI_API_KEY` in the host's secret/environment-variable settings. Do not commit `.env` or your API key to GitHub.

The app is a starter template, not a full ChatGPT clone. It does not include accounts, database-backed chat history, or end-to-end encryption.
