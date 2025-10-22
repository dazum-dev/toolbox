Welcome to Dazum Toolbox! We're excited to have you contribute to our project.
This guide will help you get started.

## 🧩 Project Overview

This is a monorepo managed by Nx
containing multiple packages for building a modern web framework.
It includes both frontend and backend projects written in **TypeScript**, with shared utilities and build tooling powered by **Rollup**, **SWC**, **ESLint**, and **Prettier**.

## ⚙️ Prerequisites

Before you start, make sure you have:

- [Node.js](https://nodejs.org) (v20/v22 or above)
- [PNPM](https://pnpm.io) (recommended) or Yarn/NPM
- Nx CLI installed globally

```bash
pnpm add -g nx
```

## 🚀 Getting Started

Clone and set up the repo:

```bash
git clone https://github.com/your-org/your-repo.git
cd your-repo
pnpm install
```

Check available Nx projects:

```bash
nx list
```

Run a local project (example):

```bash
nx serve web
```

Build a package:

```bash
nx build core
```

Run tests:

```bash
nx test utils
```

Run lint and format:

```bash
nx lint
pnpm prettier --check .
```

## 🧪 Testing and Validation

Before pushing your branch, make sure all checks pass:

```bash
pnpm test
pnpm lint
pnpm build
```

You can run a full validation workflow with Nx:

```bash
nx run-many --target=build,test,lint --all
```

## 🤝 Code of Conduct

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before participating.
We aim to keep our community inclusive and respectful.
