# AtoM Egypt - Luxury E-Commerce Portal

A highly polished, premium luxury e-commerce portal built using **React**, **Vite**, and **Tailwind CSS v4**, integrated with a serverless/client-side architecture utilizing **Supabase** for database/authentication, **Cloudinary** for direct optimized media uploads/deletion, **Resend** for transactional email receipts/alerts, and **Paymob** for secure electronic checkout.

---

## 🌟 Key Features

- **Premium Design Philosophy**: Designed with high contrast, generous whitespace, stunning micro-interactions, and visual harmony.
- **Dynamic Localization**: Full multi-language support (Arabic & English) with seamless RTL/LTR layouts.
- **Cart & Wishlist Engine**: Efficient local state synchronization with persistence across browser sessions.
- **Custom Coupons**: Percentage or fixed discount coupons with minimum order threshold requirements.
- **Admin Control Room**: Real-time management of products (add, edit, delete with automatic Cloudinary file cleanups), order fulfillment statuses, coupon codes, and global portal configurations.
- **Secure Payments Integration**: Live card payment gateway integration via Paymob with automatic billing detail forwarding and routing.
- **Automated Alerts**: Email notifications powered by Resend for customer confirmations and immediate administrator order alerts.

---

## 🛠️ Tech Stack & Services

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Motion (Framer Motion).
- **Backend & DB**: Supabase (Database, Auth, and Storage).
- **Media Optimization**: Cloudinary (Direct secure asset signing, uploading, and active image destruction).
- **Transactional Emails**: Resend API.
- **Payment Gateway**: Paymob Egypt.

---

## 📦 Local Installation & Setup

Follow these simple steps to run this portal locally on your environment:

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) and **npm** installed on your system.

### 2. Extract and Install
Extract the exported ZIP archive, open your preferred terminal inside the project root, and execute:
```bash
# Install all dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root of the directory (based on `.env.example`) and fill in your keys:
```env
# Gemini API Key (If using advanced AI features)
GEMINI_API_KEY="your-gemini-api-key"

# Supabase Credentials
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"

# Cloudinary Credentials (For product images upload & delete)
VITE_CLOUDINARY_CLOUD_NAME="your-cloud-name"
VITE_CLOUDINARY_API_KEY="your-api-key"
VITE_CLOUDINARY_API_SECRET="your-api-secret"

# Resend API Key (For automated order emails)
VITE_RESEND_API_KEY="your-resend-api-key"

# Paymob Configurations (For electronic gateway checkout)
VITE_PAYMOB_API_KEY="your-paymob-api-key"
VITE_PAYMOB_INTEGRATION_ID="your-integration-id"
```

### 4. Running the Development Server
Fire up the local development server to test the portal in your browser:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the port specified in your console) to view the application.

### 5. Production Build
To bundle the application into a highly optimized, static, production-ready build:
```bash
npm run build
```
This command compiles TypeScript, bundles files using Vite, and outputs the production asset bundle into the `/dist` directory.

---

## 📝 Directory Structure

```text
├── assets/             # Static vectors and icons
├── src/
│   ├── components/     # High-fidelity visual views (AdminPanel, CheckoutPage, etc.)
│   ├── services/       # Live API wrappers (Supabase, Cloudinary, Resend, Paymob)
│   ├── store/          # React context client engine
│   ├── constants.ts    # Application static metadata and translation mappings
│   ├── types.ts        # Fully structured TypeScript interface declarations
│   ├── index.css       # Tailwind CSS v4 directives & font family imports
│   ├── main.tsx        # Application bootloader
│   └── App.tsx         # Primary visual router & layout manager
├── index.html          # Web entrypoint
├── tsconfig.json       # TypeScript compiler settings
├── vite.config.ts      # Vite bundler options
└── package.json        # Dependencies and execution script configurations
```

---

## 🚀 Deploying Directly to GitHub & Hosting for Free

This project comes pre-configured for instant **GitHub Pages** deployment using a built-in GitHub Actions workflow (`.github/workflows/deploy.yml`) with a relative asset path base. Follow these steps to put it on GitHub and publish your custom URL:

### Step 1: Create a Repository on GitHub
1. Go to your GitHub account and create a new **public** repository (e.g., `atom-egypt`). Do NOT initialize it with a README, `.gitignore`, or license.

### Step 2: Push the Code to GitHub
Open your terminal in the extracted directory and run the following command sequence:
```bash
# Initialize git repository
git init

# Add all files to stage
git add .

# Create initial commit
git commit -m "Initial commit of AtoM Egypt luxury portal"

# Rename default branch to main
git branch -M main

# Link your local repo to GitHub (replace with your actual GitHub username and repository name)
git remote add origin https://github.com/your-username/atom-egypt.git

# Push the code to GitHub
git push -u origin main
```

### Step 3: Configure GitHub Pages Permissions
Once your files are pushed, follow these steps to enable the automatic publisher:
1. Go to your repository on GitHub.
2. Click on **Settings** (top bar) -> **Pages** (left sidebar).
3. Under **Build and deployment** -> **Source**, select **GitHub Actions** (instead of *Deploy from a branch*).

### Step 4: Automatic Building & Launching
Your push will automatically trigger a GitHub Action to build and deploy your React app.
1. Click the **Actions** tab on your repository to watch the progress.
2. Once complete, GitHub will display your clean, custom website link (e.g., `https://your-username.github.io/atom-egypt/`).

You can now map any custom domain name (e.g., `www.your-custom-brand.com`) to this hosted site directly inside the GitHub Pages settings so that nobody can tell it was created here!

---

## 🔐 Database & Services Setup Guide

1. **Supabase Tables**: Make sure you have tables configured for `products`, `categories`, `orders`, `coupons`, `settings`, and `reviews` if syncing data to the cloud.
2. **Cloudinary Upload Preset**: Create an unsigned or signed upload preset in your Cloudinary Dashboard and name it appropriately, or update the service settings to allow direct image management.
3. **Resend Domain**: Verify your sending domain inside your Resend control panel to allow the portal to dispatch transactional notifications successfully.

Enjoy building with AtoM E-Commerce!
