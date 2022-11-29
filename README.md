# Node.JS API for the [fmk-dosis-til-tekst-ts](https://github.com/trifork/fmk-dosis-til-tekst-ts) component

This project exposes an API that calls the [fmk-dosis-til-tekst-ts](https://github.com/trifork/fmk-dosis-til-tekst-ts)
library.

## Prerequisites

- Node.js latest version

## Setup

### Development mode:

1. set environment variable `NODE_ENV=development`. This is the default value if the variable is not set
2. run `npm install` in the terminal
3. run `npm run dev` in the terminal, which should result in:

> Server is running on port 8000.

### Production mode:

1. set environment variable `NODE_ENV=production`
2. run `npm install --omit=dev` in the terminal
3. run `npm run start` in the terminal, which should result in:

> Server is running on port 8000.

### If successful:

- The API should now be accessible at `http://localhost:8000/<endpoint>`.

- Health check available at http://localhost:8000/health.

- Swagger docs available at http://localhost:8000/docs.

## Create Swagger docs

1. run `npm run swagger` in the terminal

The file `swagger.json` is created or updated at src/swagger.json.

## Run ESLint
1. run `npm run eslint` in the terminal

The linter reports any errors.
