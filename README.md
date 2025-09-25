# Email Service Node (Express + Vercel Compatible)

This is a minimal email sending service built with Node.js, Express, and Nodemailer.  
It works locally with Express and can also be deployed directly to Vercel.

## 🚀 Run locally

```bash
npm install
npm run dev
```

Visit: `http://localhost:3000/api/email/send`

Send test email (example using curl):

```bash
curl -X POST http://localhost:3000/api/email/send \\
  -H "Content-Type: application/json" \\
  -d '{
    "recipient": "test@example.com",
    "subject": "Hello",
    "messageBody": "<h1>Hello World</h1>",
    "apiKey": "supersecretapikey"
  }'
```

## 🌐 Deploy to Vercel

Just push this project to GitHub/GitLab and import into Vercel.  
Vercel will run `api/email/send.js` as a serverless function.

Set the following environment variables in Vercel Dashboard:
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `API_KEY`
