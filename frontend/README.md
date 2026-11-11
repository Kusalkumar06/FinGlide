# FinGlide - Frontend

FinGlide is a modern, responsive personal finance and expense tracking web application. The frontend is built using **React 19**, **Vite**, **Tailwind CSS v4**, and **Redux Toolkit** to deliver an intuitive and fluid personal finance management experience.

---

## 🚀 Features

- **📊 Comprehensive Financial Dashboard**:
  - Live summary of total balance, income, expenses, and savings rate.
  - Quick insights with monthly breakdown visual charts.
  - Recent transactions overview and category-wise spending splits.
- **💳 Accounts Management**:
  - Add, edit, and track multiple financial accounts (Bank, Cash, Credit Card, Investment).
  - Real-time balance calculations across accounts.
- **🏷️ Categories Management**:
  - Custom income and expense categories with color coding and icons.
  - Dynamic categorization for clear spending patterns.
- **💸 Transactions Tracking**:
  - Log income, expenses, and account transfers.
  - Filter transactions by date, category, account, and type.
  - Instant transaction updates with modal forms.
- **🎯 Budget Planner**:
  - Create category budgets with custom spend limits and timelines.
  - Progress indicators highlighting on-track and over-budget thresholds.
- **📈 Analytical Reports**:
  - Interactive visualizations powered by **Recharts** and **D3**:
    - Income vs. Expense bar and line charts.
    - Spending vs. Budget comparisons.
    - Category-wise distribution pie charts.
  - Multi-tab report views (**Overview**, **Trends**, **Categories**).
- **🔐 Secure Authentication**:
  - JWT session restoration and authentication flow (Sign In / Sign Up).
  - Protected routes safeguarding private financial data.
- **✨ Polished UI/UX**:
  - Clean, responsive dashboard layout with collapsible navigation sidebar.
  - Toast notifications powered by `react-toastify`.
  - Iconography with `lucide-react` and `react-icons`.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler / Build Tool**: [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & React-Redux
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Data Visualization**: [Recharts](https://recharts.org/) & [D3 Scale](https://d3js.org/d3-scale)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons & UI Utilities**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/), [React Select](https://react-select.com/)
- **Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/)

---

## 📁 Project Structure

```text
frontend/
├── public/                # Static public assets
├── src/
│   ├── api/               # Axios instance and API interceptors
│   │   └── axios.js
│   ├── components/        # Reusable UI components
│   │   ├── modals/        # Modal popups for Add/Edit actions
│   │   │   ├── add/       # AddAccount, AddBudget, AddCategory, AddTransaction
│   │   │   └── edit/      # EditAccount, EditCategory
│   │   ├── reports/       # Report-specific tabs and Recharts components
│   │   │   ├── charts/    # Bar, Pie, and Line charts
│   │   │   └── tabs/      # Overview, Categories, Trends tabs
│   │   ├── utils/         # Helper functions, toast utilities, custom styles
│   │   ├── Layout.jsx     # Main shell layout with sidebar and header
│   │   ├── MainSideBar.jsx# Primary navigation sidebar
│   │   └── ProtectedRoute.jsx # Route authentication guards
│   ├── pages/             # Page components
│   │   ├── DashBoard.jsx  # Primary overview dashboard
│   │   ├── Accounts.jsx   # Accounts management page
│   │   ├── Budgets.jsx    # Budget tracking page
│   │   ├── Categories.jsx # Category customization page
│   │   ├── TransactionPage.jsx # Transaction history and filters
│   │   ├── ReportsPage.jsx# Analytical charts and reporting
│   │   ├── About.jsx      # About page
│   │   └── Contact.jsx    # Contact support page
│   ├── reducers/          # Custom form state reducers (useReducer)
│   ├── redux/             # Redux store, slices, and asynchronous thunks
│   │   ├── coreSlice.js   # Main application slice
│   │   ├── coreThunks.js  # Async API actions (auth, accounts, transactions, etc.)
│   │   ├── selectors.js   # Memoized selectors
│   │   └── store.js       # Redux store configuration
│   ├── App.jsx            # Application root routing and session initialization
│   ├── index.css          # Global Tailwind styles
│   └── main.jsx           # App entry point
├── .env                   # Environment configuration
├── package.json           # Dependencies and build scripts
├── vercel.json            # Vercel deployment configuration
└── vite.config.js         # Vite configuration
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version `18.x` or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### 1. Installation

Clone the repository and navigate to the frontend folder:

```bash
cd frontend
npm install
```

### 2. Environment Variables

Create or verify the `.env` file in the `frontend` root:

```env
# Point to your local backend server during development
VITE_API_BASE_URL=http://localhost:5000/api

# Or point to production backend
# VITE_API_BASE_URL=https://finglide.onrender.com/api
```

### 3. Development Server

Start the local Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Open your browser at [http://localhost:5173](http://localhost:5173).

---

## 📜 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Starts the Vite dev server with HMR |
| **Build** | `npm run build` | Compiles and bundles production-ready assets into `dist/` |
| **Preview** | `npm run preview` | Locally previews the production build |
| **Lint** | `npm run lint` | Runs ESLint to check for code style and syntax issues |

---

## 🚀 Deployment

The project is preconfigured for deployment on platforms like **Vercel** (`vercel.json` included for SPA routing):

```bash
npm run build
```

Ensure your `VITE_API_BASE_URL` is set in your hosting platform's environment variables dashboard.
