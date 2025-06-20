# PhotoStock Frontend

[Frontend Repository on GitHub](https://github.com/m-saad-siddique/photostock-frontend)

PhotoStock is a modern photo-sharing web application built with **Next.js** and **Apollo Client** for a seamless GraphQL experience. This frontend connects to a GraphQL backend (see below) and supports authentication, file uploads, a user dashboard, and more.

## Features
- Next.js 13+ frontend with App Router
- Apollo Client for GraphQL queries, mutations, and subscriptions
- Authentication (login, register, protected routes)
- File upload (photos)
- User dashboard and profile
- Responsive, modern UI/UX

---

## Prerequisites
- Node.js (v16+ recommended)
- npm, yarn, pnpm, or bun
- The [PhotoStock GraphQL Backend](https://github.com/m-saad-siddique/graphql-backend)

---

## Getting Started

### 1. Clone and Start the Backend

```
git clone https://github.com/m-saad-siddique/graphql-backend.git
cd graphql-backend
bundle install # if using Ruby/Rails backend
rails db:setup # or the backend's setup instructions
rails server # or the backend's start command
```

The backend will run on [http://localhost:3000](http://localhost:3000) by default.

### 2. Start the Frontend

In a new terminal:

```
git clone <this-repo-url>
cd photostock-frontend
npm install # or yarn, pnpm, bun
npm run dev
```

The frontend will run on [http://localhost:3001](http://localhost:3001) (or [http://localhost:3000](http://localhost:3000) if not changed).

---

## Usage
- Visit the frontend URL in your browser.
- Register or log in.
- Upload photos, view the dashboard, and explore features.

---

## Backend Repository
- [PhotoStock GraphQL Backend](https://github.com/m-saad-siddique/graphql-backend)
- [PhotoStock Frontend](https://github.com/m-saad-siddique/photostock-frontend)
  - See their READMEs for setup, environment variables, and API details.

---

## Learn More
- [Next.js Documentation](https://nextjs.org/docs)
- [Apollo Client Docs](https://www.apollographql.com/docs/react/)
- [GraphQL.org](https://graphql.org/)

---

## Deploy
You can deploy the frontend on Vercel, Netlify, or any platform that supports Next.js. See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).
