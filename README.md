frontend/
├─ package.json
├─ vite.config.js
├─ tailwind.config.cjs
├─ postcss.config.cjs
├─ netlify.toml
├─ src/
│  ├─ main.jsx
│  ├─ index.css
│  ├─ lib/
│  │  └─ supabaseClient.js
│  ├─ App.jsx
│  ├─ pages/
│  │  ├─ AuthPage.jsx
│  │  └─ Dashboard.jsx
│  └─ components/
│     ├─ Spinner.jsx
│     └─ FormCreator.jsx
└─ public/
   └─ _redirects
backend/
├─ package.json
├─ index.js
├─ routes/
│  ├─ forms.js
│  └─ uploads.js
├─ utils/
│  └─ supabaseAdmin.js
├─ .env.example
└─ .gitignore
