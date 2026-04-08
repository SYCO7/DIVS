# DIVS

> Digital Identity Verification System for secure, guided user onboarding.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

DIVS is built with React, TypeScript, Vite, and Supabase. It provides a guided verification flow with personal information capture, document upload with OCR, face capture, review, and completion screens.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Demo / Preview](#demo--preview)
- [Deployment](#deployment)
- [Security Notes](#security-notes)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Features

- ✅ Multi-step identity verification flow
- 📄 Document upload and OCR extraction
- 🧑 Face capture and liveness checks
- 📊 Verification review and status tracking
- 🔐 Admin dashboard route protection
- 🗄️ Supabase-backed authentication and data persistence

## Tech Stack

| Category | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Vite |
| UI and Animation | Framer Motion |
| State Management | Zustand |
| Backend Services | Supabase |

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm 9 or newer

### Installation

```bash
npm.cmd install
```

### Configure Environment

Create a `.env` file in the project root and add your Supabase values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Run Locally

```bash
npm.cmd run dev -- --port 5173 --strictPort
```

### Build and Preview

```bash
npm.cmd run build
npm.cmd run preview
```

## Environment Variables

Required keys in `.env`:

# DIVS

## Digital Identity Verification System

Enterprise-ready, AI-powered identity verification focused on trust, security, and reliable onboarding workflows.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Security Considerations](#security-considerations)
- [Screenshots / UI Preview](#screenshots--ui-preview)
- [Future Improvements / Roadmap](#future-improvements--roadmap)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Overview

DIVS is an AI-powered identity verification platform built for high-confidence onboarding. It combines OCR-based document validation, face recognition, liveness detection, and secure verification workflows to reduce fraud risk while maintaining a smooth user experience. The system is designed for technical reviewers, cybersecurity professionals, and developers who need transparent verification stages and controlled access patterns.

## Live Demo

- Production URL: https://divs-app-syco7.vercel.app
- Backup deployment: https://divs-app-syco7-5v36bg1s8-syco7s-projects.vercel.app

## Features

- :white_check_mark: Multi-step identity verification workflow
- :page_facing_up: OCR-powered document upload and extraction
- :bust_in_silhouette: Face capture and recognition flow
- :eyes: Liveness checks for anti-spoofing validation
- :clipboard: Verification review and status tracking
- :lock: Admin route protection for restricted operations
- :floppy_disk: Supabase-backed authentication and persistence
- :ledger: Secure audit-ready verification trail and records

## How It Works

1. User enters personal information in the verification flow.
2. User uploads identity documents for OCR extraction and validation.
3. User captures a live face sample for recognition and liveness checks.
4. System presents a review step to confirm extracted and captured data.
5. Verification is finalized and stored with status tracking for operational review.

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite

### Backend

- Supabase (authentication and data persistence)

### State

- Zustand

### Animation

- Framer Motion

## Project Structure

```text
.
|-- public/
|   `-- models/                        # Face and detection model assets
|-- src/
|   |-- components/
|   |   |-- layout/
|   |   |   `-- AppLayout.tsx          # Shared application layout
|   |   |-- verification/              # Verification workflow step components
|   |   `-- ProtectedAdminRoute.tsx    # Admin access guard
|   |-- lib/
|   |   |-- emailService.ts            # Email helpers/integrations
|   |   |-- supabase.ts                # Supabase client setup
|   |   `-- validators.ts              # Validation utilities
|   |-- pages/                         # Landing, Login, Verify, Admin, AccessDenied, API test
|   |-- store/
|   |   `-- appStore.ts                # Global app state
|   |-- App.tsx
|   `-- main.tsx
|-- index.html
`-- package.json
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm 9 or newer

### 1. Install Dependencies

```bash
npm.cmd install
```

### 2. Run Development Server

```bash
npm.cmd run dev -- --port 5173 --strictPort
```

### 3. Build and Preview Production

```bash
npm.cmd run build
npm.cmd run preview
```

## Available Scripts

- `npm.cmd run dev`: Start local development server
- `npm.cmd run build`: Run TypeScript and Vite production build
- `npm.cmd run preview`: Preview production build locally
- `npm.cmd run lint`: Run lint checks

## Security Considerations

- Never commit `.env` or any secret keys to source control.
- Keep Supabase service-role credentials private and server-side only.
- Enforce strict Row Level Security (RLS) policies in production.
- Validate OCR outputs and face-matching thresholds before approval decisions.
- Restrict admin surfaces with role-based access and protected routes.
- Maintain verification logs for auditability and incident response workflows.

## Screenshots / UI Preview

- Application screenshots: _Coming soon_
- Verification flow GIF: _Coming soon_

## Future Improvements / Roadmap

- Add stronger anti-spoofing heuristics for liveness verification.
- Introduce risk scoring and anomaly detection across verification attempts.
- Expand audit log exports for compliance and forensic review.
- Add automated test coverage for full verification workflows.
- Provide optional webhooks for enterprise integrations.

## Deployment

This Vite application can be deployed on Vercel, Netlify, or GitHub Pages.

## Troubleshooting

- If npm commands fail in PowerShell, use `npm.cmd` instead of `npm`.
- If port `5173` is unavailable, stop the existing process or use another port.

## License

This project is for educational and internal use unless a separate license is added.