# ResuAI - AI-Powered Resume Analysis Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)

**Transform your resume with AI-powered analysis and track your growth journey**

[Live Demo](https://resu-ailens.vercel.app/) ·

</div>

---

## 🚀 Overview

ResumeAI is a cutting-edge web application that leverages **AI-driven resume analysis** to provide tailored, actionable feedback. Whether you're a student, job seeker, or professional, ResumeAI helps you refine your resume, track version history, and optimize for ATS compliance.

### ✨ Key Features

- **🤖 AI-Powered Analysis** – Instant deep feedback on resume structure, skills, and job relevance.
- **📊 Smart Version Comparison** – Compare multiple resume versions side by side.
- **🎯 ATS Optimization** – Receive practical recommendations to pass Applicant Tracking Systems.
- **📈 Progress Tracking** – Visualize resume improvements with analytics dashboards.
- **🎨 Modern Dark UI** – Clean, sleek, ChatGPT-inspired design.
- **📱 Fully Responsive** – Optimized for desktops, tablets, and mobile devices.
- **🔒 Secure Authentication** – Login with Google, protected sessions via NextAuth.

---

## 🛠 Tech Stack

**Frontend**

- ⚛️ **Next.js 15** – App Router & full-stack capabilities
- 🟦 **TypeScript** – Strongly-typed development
- 🎨 **Tailwind CSS** – Modern utility-first styling
- 🖼 **React Icons** – Consistent, professional icons

**Backend**

- 🔗 **Next.js API Routes** – Serverless endpoints
- 🔒 **NextAuth.js** – Authentication & sessions
- 🗄 **Prisma** – Type-safe ORM
- 🐘 **PostgreSQL** – Reliable relational database
- 🧠 **Grok AI** – AI-driven resume analysis

**Infrastructure**

- ▲ **Vercel** – Seamless deployment
- 💾 **Vercel Blob Storage** – Resume storage
- 🔑 **Environment Variables** – Secure configuration

---

## 🚀 Quick Start

### Prerequisites

- Node.js **18+**
- PostgreSQL database
- DeepSeek API account

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/resumeai.git
cd resumeai

# Install dependencies
npm install

# Copy env file
cp .env.example .env.local
```

Fill in `.env.local` with:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/resumeai"
AUTH_SECRET="your-secret-key"
AUTH_GOOGLE_ID="your-google-oauth-id"
AUTH_GOOGLE_SECRET="your-google-oauth-secret"
GROK_API_KEY="your-deepseek-api-key"
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

Run database setup:

```bash
npx prisma generate
npx prisma db push
```

Start dev server:

```bash
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
resumeai/
├── src/
│   ├── app/                # App Router
│   │   ├── api/            # API routes
│   │   │   ├── upload/     # Resume upload
│   │   │   ├── analyze/    # Resume analysis
│   │   │   └── compare/    # Resume comparison
│   │   ├── dashboard/      # Main dashboard
│   │   └── layout.tsx      # Root layout
│   ├── components/         # UI components
│   ├── lib/                # Utility libraries
│   └── types/              # TS types
├── prisma/                 # Database schema
├── public/                 # Static assets
└── package.json
```

---

## 🔧 Configuration

### Database

1. Create a PostgreSQL database
2. Update `DATABASE_URL` in `.env.local`
3. Run:

   ```bash
   npx prisma migrate dev --name init
   ```

### Authentication

1. Set up **Google OAuth** in [Google Cloud Console](https://console.cloud.google.com)
2. Add credentials to `.env.local`

---

## 🎯 Usage

1. **Upload Resume** – Drag & drop PDF
2. **AI Analysis** – Get instant breakdowns
3. **Review Suggestions** – Strengths, improvements, ATS tips
4. **Track Versions** – Compare across iterations

---

### Resume Pipeline

```mermaid
flowchart LR
A[Upload Resume] --> B[Vercel Blob Storage]
B --> C[PDF Extraction]
C --> D[Grok AI Analysis]
D --> E[Database Storage]
```

### Deploy on Vercel

```bash
npm run build
npx vercel --prod
```

Set environment variables in Vercel Dashboard:

```env
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-production-secret"
```

---

## 🤝 Contributing

1. Fork repo
2. Create feature branch (`git checkout -b feature/xyz`)
3. Commit (`git commit -m 'Add xyz'`)
4. Push (`git push origin feature/xyz`)
5. Open PR

### Guidelines

- Use TypeScript
- Follow code style
- Write meaningful commits
- Add tests if relevant

---

## 📄 License

MIT License – see [LICENSE](LICENSE).

---

<div align="center">

### ⭐ If you like this project, star the repo!

**Built with ❤️ using Next.js, Prisma, Tailwind, and AI**

</div>
