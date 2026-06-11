# NexGadget Frontend

This is a Vite + React frontend scaffold for the NexGadget project. It includes basic pages, a cart context, and API service stubs ready to call a Core PHP REST backend.

Quick start:

```bash
cd frontend
npm install
npm run dev
```

API base URL is controlled by `VITE_API_URL`. For local backend set it in a `.env` file at the `frontend` folder:

```
VITE_API_URL=http://localhost/nexgadget_api
```

What this scaffold includes:
- Routing (`react-router-dom`) with pages: Home, Shop, Product, Cart, Checkout
- `src/services/api.js` — ready API functions with fallback mock data for development
- `src/context/CartContext.jsx` — cart state and functions: add, update, remove, clear, getTotal

Next steps (suggested):
- Integrate Tailwind or Material UI (project spec mentions Tailwind + MUI)
- Implement product search, filters, and auth flows
- Wire actual backend endpoints
