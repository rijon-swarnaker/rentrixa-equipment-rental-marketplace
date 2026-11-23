# Rentrixa --- Equipment Rental Marketplace

**Rentrixa** is a modern equipment rental marketplace where users can
discover equipment, save their favorite listings, make rental bookings,
and manage their rental activities. The platform supports different
equipment categories, making it easier for individuals and businesses to
find the equipment they need without purchasing it.

> **Rent Smarter. Work Better.**

## 🌐 Project Links

-   **Live Website:**
    https://rentrixa-equipment-rental-marketpla.vercel.app/
-   **Frontend Repository:**
    https://github.com/rijon-swarnaker/rentrixa-equipment-rental-marketplace
-   **Backend Repository:**
    https://github.com/rijon-swarnaker/rentrixa-server

## ✨ Features

### 👤 Customer Features

-   **User Authentication:** Secure account registration and login.
-   **Browse Equipment:** Explore available equipment from different
    categories.
-   **Search & Discover:** Find equipment based on your needs.
-   **Equipment Details:** View equipment information, rental pricing,
    and relevant details.
-   **Rental Booking:** Book equipment through the marketplace.
-   **Favorites:** Add equipment to a favorites list and access it
    later.
-   **Booking Management:** View and manage your rental bookings.
-   **Secure Online Payment:** Process rental payments using Stripe.
-   **Responsive Design:** Enjoy a consistent experience across desktop,
    tablet, and mobile devices.

### 🛡️ Admin Features

-   **Admin Dashboard:** Access administrative marketplace features.
-   **Equipment Management:** Add, update, and manage equipment
    listings.
-   **Rental Management:** View and manage customer bookings.
-   **User Management:** View and manage registered users.
-   **Role-Based Access Control:** Restrict administrative functionality
    to authorized users.
-   **JWT-Based API Security:** Verify JSON Web Tokens in protected
    backend routes.

## 🧰 Equipment Categories

Rentrixa supports equipment discovery across categories such as:

-   Construction Equipment
-   Photography Equipment
-   Vehicles & Transportation
-   Agriculture Equipment
-   Electronics
-   Event Equipment

## 🛠️ Technology Stack

  Category              Technologies
  --------------------- ----------------------------
  Frontend             - Next.js, React, TypeScript
  Styling              - Tailwind CSS
  UI Components        - shadcn/ui
  Icons                - Lucide React
  Backend              - Node.js, Express.js
  Database             - MongoDB
  Authentication       - Better Auth
  API Security         - JWT (JSON Web Token)
  Payment Events       - Stripe Webhooks
  Payment Gateway      - Stripe
  Notifications        - Sonner
  Frontend Deployment  - Vercel

## 📁 Project Repositories

Rentrixa is organized into two separate repositories:

  --------------------------------------------------------------------------------------------------------------------------
  Repository                                                                             Description
  -------------------------------------------------------------------------------------- -----------------------------------
  [Frontend](https://github.com/rijon-swarnaker/rentrixa-equipment-rental-marketplace)   Next.js application and user
                                                                                         interface

  [Backend](https://github.com/rijon-swarnaker/rentrixa-server)                          Express.js server and API
  --------------------------------------------------------------------------------------------------------------------------

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

-   Node.js (LTS recommended)
-   npm
-   MongoDB database
-   Stripe account and API credentials

### 1. Clone the repositories

Clone the frontend:

``` bash
git clone https://github.com/rijon-swarnaker/rentrixa-equipment-rental-marketplace.git
```

Clone the backend:

``` bash
git clone https://github.com/rijon-swarnaker/rentrixa-server.git
```

### 2. Install dependencies

In the frontend directory:

``` bash
npm install
```

In the backend directory:

``` bash
npm install
```

### 3. Configure environment variables

Create the required environment files in both projects. Add the variable
names used by your actual application configuration.

**Frontend `.env.local` example:**

``` env
NEXT_PUBLIC_API_BASE_URL=
```

**Backend `.env` example:**

``` env
PORT=
MONGODB_URI=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
CLIENT_URL=
```

Add any other authentication, Better Auth, or service-specific
environment variables required by your implementation.

> Never commit real API keys, database credentials, or secret values to
> GitHub.

### 4. Run the application

Start the backend server from the backend project directory:

``` bash
npm run dev
```

Start the frontend in a separate terminal from the frontend project
directory:

``` bash
npm run dev
```

Open <http://localhost:3000> to access the application.

> Use the scripts defined in each repository's `package.json` if the
> commands differ.

## 💳 Payment Integration

Rentrixa uses **Stripe** to process online rental payments and **Stripe
Webhooks** to handle payment events securely on the backend.

-   **Stripe Checkout:** Provides a secure payment flow for rental
    bookings.
-   **Webhook Verification:** Verifies incoming Stripe webhook events
    using the webhook signing secret.
-   **Payment Status Updates:** Processes verified payment events and
    updates payment status on the backend.
-   **Booking Synchronization:** Keeps booking records synchronized with
    confirmed payment events.

Keep Stripe secret keys and webhook signing secrets on the server.
Configure the webhook endpoint and signing secret in the backend
environment. Never trust client-side payment status alone; use verified
server-side webhook events.

## 🔐 Security

-   Store private credentials in environment variables.
-   Never expose secret keys in frontend code.
-   Use JWT verification middleware to protect private API endpoints.
-   Validate tokens on the backend before allowing access to protected
    resources.
-   Apply role-based authorization to administrative routes.
-   Verify Stripe webhook signatures before processing payment events.
-   Update payment and booking status using verified server-side events.
-   Validate booking and payment information on the backend.
-   Configure CORS to allow requests only from trusted frontend origins.

## 🚀 Deployment

The frontend is deployed on Vercel:

**Live Website:**
https://rentrixa-equipment-rental-marketpla.vercel.app/

The backend source code is maintained separately:

**Backend Repository:**
https://github.com/rijon-swarnaker/rentrixa-server

For production deployment, make sure the frontend API URL, backend
environment variables, MongoDB access, authentication trusted origins,
CORS settings, and Stripe webhook configuration are correct.

## 🎯 Project Objective

The goal of Rentrixa is to make equipment rental simple and accessible.
Instead of purchasing expensive equipment for occasional use, users can
explore available listings, save items, book the equipment they need,
and manage their rentals through one convenient marketplace.

## 👨‍💻 Developer

**Rijon Chandra Swarnaker**

-   **GitHub:** https://github.com/rijon-swarnaker
-   **Portfolio:** https://rijon-swarnaker.vercel.app/

------------------------------------------------------------------------

```{=html}
<p align="center">
```
Built with ❤️ for a smarter equipment rental experience.
```{=html}
</p>
```
