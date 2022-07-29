# GFF_BACKEND

API is written in [TypeScript](https://www.typescriptlang.org/).


**Table of Contents**

- [GFF backend - Code Test](#gff_backend)
  - [Requirements](#requirements)
  - [Setup](#setup)
    - [Clone repository](#clone-repository)
    - [Build instructions](#build-instructions)
    - [Start development](#build-instructions)
    - [Start](#start)
  - [Deploy to AWS](#deploy-to-aws)

## Requirements

- Node.js >=16.0.0
- Npm >=7.0.0
- Yarn >= 1.22.17

## Setup

### Clone Repository
```bash
git clone git@bitbucket.org:ikovac/gff_backend.git
```

### Install Dependencies
```bash
yarn install
```

### Build Instructions
```bash
yarn build
```

### Start Development
```bash
yarn dev
```

### Start
```bash
yarn start
```

## Deploy to AWS
  1. Connect to EC2 instance using .pem file
  2. Go to gff project folder `cd gff_backend`
  3. Stop running pm2 process `pm2 stop gff`
  4. Delete previous pm2 process `pm2 delete gff`
  5. Delete build `rm -rf build/`
  6. Delete node_modules `rm -rf node_modules`
  7. Pull latest changes `git pull`
  8. Install dependencies `yarn install`
  9. Build application `yarn build`
  10. Start pm2 process `pm2 start ecosystem.config.js`
  11. TEMP HACK - copy YOTI .pem file from /src/keys/xxx.pem to build/src/keys/xxx.pem
