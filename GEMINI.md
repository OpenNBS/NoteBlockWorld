# Gemini Workspace Instructions

This document provides instructions for the Gemini AI assistant to effectively interact with the NoteBlockWorld project.

## Package Manager

This project uses **Bun** as the package manager and runtime. Do not use `npm`, `yarn`, or `pnpm`.

- **Installation:** `bun install`
- **Running scripts:** `bun run <script_name>`
- **Adding dependencies:** `bun add <package_name>`
- **Running tests:** `bun test`

## Project Structure

This is a TypeScript monorepo managed with Bun workspaces.

- **`apps/`**: Contains the main applications.
    - **`apps/backend`**: A NestJS application for the server-side logic.
    - **`apps/frontend`**: A Next.js application for the user interface.
- **`packages/`**: Contains shared libraries and modules used across the monorepo.
    - **`packages/api-client`**: Client for communicating with the backend API.
    - **`packages/configs`**: Shared configurations (e.g., ESLint, Prettier).
    - **`packages/database`**: Database schemas, queries, and connection logic.
    - **`packages/song`**: Core logic for handling and manipulating song data.
    - **`packages/sounds`**: Logic related to fetching and managing sounds.
    - **`packages/thumbnail`**: A library for generating song thumbnails.
- **`tests/`**: Contains end-to-end tests, likely using Cypress.
- **`tsconfig.base.json`**: The base TypeScript configuration for the entire monorepo.
