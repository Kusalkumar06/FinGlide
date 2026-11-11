# FinGlide – Comprehensive Codebase & Architecture Audit

**Project**: FinGlide (MERN Stack Personal Finance Platform)  
**Date**: November 11, 2026  
**Auditor Roles**: Senior Full-Stack Engineer, Software Architect, Security Auditor, QA Engineer  
**Status**: Completed (Read-Only Audit — Zero Code Altered)

---

## 1. Executive Summary

| Domain | Rating | Status Summary |
|---|---|---|
| **Overall Project Health** | **POOR / HIGH RISK** | Core skeleton works for basic happy-path CRUD, but critical concurrency, security, transactional integrity, and UI crash bugs make it unready for production. |
| **Frontend Health** | **MODERATE** | Built on modern React 19 + Vite 7 + Tailwind CSS v4, but suffers from state desynchronization, unhandled modal errors, redundant network requests on route changes, duplicate Redux store keys, and unhandled null lookups causing client crashes. |
| **Backend Health** | **CRITICAL** | Lacks ACID transactions across multiple collections, has broken updates on transactions (omits recalculation in state responses), wrong HTTP status codes, vulnerable custom middleware (`apiOnly`), and no request payload schema validation. |
| **Database & Schema Health** | **HIGH RISK** | Schemas miss compound indexes on `(userId, date)` and `(userId, name)`. Typos exist in Mongoose schemas (`{ timeStamps: true }` instead of `{ timestamps: true }` and default `'monthly,'` trailing comma). Cascading deletions rely on middleware not triggered by many delete mechanisms. |
| **Security Health** | **CRITICAL** | JWT expiration vs cookie maxAge mismatch, JWT secret fallback crashes, no rate limiting, NoSQL injection vulnerability via unsanitized body parameters, custom `apiOnly` middleware bypassable via `Accept: application/json` or spoofed headers, CORS wildcard/inconsistent configs, and lack of CSRF tokens for cookie-based auth. |
| **Testing Health** | **FAILING** | 0% automated test coverage. `npm test` on backend fails with `"no test specified"`. Frontend has no unit or integration tests (no Jest/Vitest/Cypress). |
| **Financial Integrity** | **CRITICAL** | Net worth is calculated naively by summing balances ignoring loans/liabilities. Account balances in Mongo diverge upon failed transaction operations. Date-filtering neglects user timezones and end-of-day UTC offsets (e.g. `$lte: new Date('YYYY-12-31')` misses the entire last day). Editing transactions does not return updated transaction lists to Redux. |

---

## 2. Project Architecture & Data Flow

### 2.1 Architectural Diagram

```
+---------------------------------------------------------------------------------------+
|                                  CLIENT (React 19 + Vite)                             |
|                                                                                       |
|  [Pages: Dashboard, Accounts, Categories, Transactions, Budgets, Reports]             |
|       |                                                                               |
|       +--> Redux Store (coreSlice) <----+                                             |
|       |         ^                       |                                             |
|       v         |                       |                                             |
|  [Local Forms: useReducer]       [Async Thunks (coreThunks.js)]                       |
+-----------------------------------------|---------------------------------------------+
                                          | Axios (withCredentials: true, baseURL)
                                          v
+---------------------------------------------------------------------------------------+
|                                 BACKEND (Node.js + Express 5)                         |
|                                                                                       |
|  [cors, express.json, cookieParser]                                                   |
|       |                                                                               |
|  [apiOnly Middleware] ---> Verifies Accept header includes "application/json"         |
|       |                                                                               |
|  [authMiddleware]    ---> Parses 'authToken' cookie -> jwt.verify -> DB user check     |
|       |                                                                               |
|  [Routes & Controllers]                                                               |
|    ├── /api/auth/        (register, login, logout, check, deleteuser)                 |
|    ├── /api/account/     (createAccount, getAccounts, update, delete)                 |
|    ├── /api/category/    (createCategory, getCategories, update, delete, getPieData)   |
|    ├── /api/transaction/ (createTransaction, getTransactions, update, delete, summaries)|
|    └── /api/budget/      (createBudget, getBudgets, update, delete, spendVsBudget)     |
+-----------------------------------------|---------------------------------------------+
                                          v
+---------------------------------------------------------------------------------------+
|                               DATABASE (MongoDB + Mongoose 8)                         |
|                                                                                       |
|  Collections: users, accounts, categories, transactions, budgets                     |
+---------------------------------------------------------------------------------------+
```

### 2.2 Data Flow Walkthrough & Gaps
1. **Authentication**:
   - `loginUser` thunk submits credentials to `/api/auth/login`. Server sets an HTTP-only cookie `authToken` valid for 7 days (`maxAge: 7*24*60*60*1000`), but the JWT token inside expires in `1d` (`expiresIn: "1d"`).
   - Once expired, any subsequent request returns `401 Invalid Token`.
   - On page refreshes, `App.jsx` dispatches `restoreSession()` calling `/api/auth/check`.
   - **Gap**: Concurrently, `ProtectedRoute.jsx` runs its *own* separate `api.get("/auth/check")` inside a local `useEffect`, triggering redundant roundtrips.
2. **Initial App Data Hydration**:
   - `Layout.jsx` embeds `<FetchAppData />` which watches `isUserLoggedIn`.
   - When true, it fires `fetchCoreData()` (triggering 4 parallel GETs) and `fetchReportsData()` (triggering 3 parallel GETs) — totaling 7 HTTP calls immediately on login.
3. **Financial State Updates**:
   - Creating/Deleting transactions triggers controller mutations on both `Transaction` and `Account` documents.
   - **Critical Gap**: Controllers execute un-transactioned separate MongoDB updates (`newTransaction.save()`, `AccountModel.findOneAndUpdate()`). If the server crashes or fails between these calls, money is permanently created or destroyed with no rollback mechanism.

---

## 3. Frontend Findings

### 3.1 React & JavaScript Runtime Errors
- **FE-001 | Unhandled Null Exception on Icon Lookup in DashBoard Recent Transactions**  
  *File*: `frontend/src/pages/DashBoard.jsx` (Lines 145–147)  
  *Issue*:
  ```javascript
  if (each.transactionType === "Income" || each.transactionType === "Expense")
     IconComponent = categoryIcons.find((eachIcon) => eachIcon.id === each.categoryId.icon)
  ```
  If `each.categoryId` was deleted or is null/unpopulated, accessing `each.categoryId.icon` throws `TypeError: Cannot read properties of null (reading 'icon')`, causing a white screen crash for the entire Dashboard. Furthermore, if `categoryIcons.find(...)` returns undefined, Line 149 accesses `IconComponent.color` and crashes.
- **FE-002 | Unhandled Null Exception on Account Overview in DashBoard**  
  *File*: `frontend/src/pages/DashBoard.jsx` (Lines 108–114)  
  *Issue*: `accountIcons.find(...)` can return `undefined` if `acc.icon` is unrecognized, throwing a fatal crash on `IconComponent.color` and `<IconComponent.icon />`.
- **FE-003 | Division by Zero in Reports Analytics Cards**  
  *File*: `frontend/src/pages/ReportsPage.jsx` (Line 80)  
  *Issue*: `(((income - expenses) / income) * 100).toFixed(2)`: If `income === 0`, `income - expenses / 0` evaluates to `-Infinity` or `NaN`, displaying `NaN% savings rate` or `-Infinity% savings rate`.
- **FE-004 | Double Redux Store Key Alias**  
  *File*: `frontend/src/redux/store.js` (Lines 6–9) and `ReportsPage.jsx` (Line 23)  
  *Issue*:
  ```javascript
  reducer : {
      core: coreReducer,
      sliceState: coreReducer, 
  }
  ```
  Two duplicate slices (`core` and `sliceState`) reference the same reducer function, duplicating state in memory. Components randomly read from either `state.core` or `state.sliceState`.
- **FE-005 | Race Condition in `ProtectedRoute.jsx` & Redundant Network Calls**  
  *File*: `frontend/src/components/ProtectedRoute.jsx` (Lines 10–33)  
  *Issue*: `ProtectedRoute` maintains local state (`const [checkingAuth, setCheckingAuth] = useState(true)`) and invokes `/api/auth/check` on every single route mount, while `App.jsx` already runs `restoreSession()` via Redux. This causes a screen flicker with `<Loader />` and duplicate network calls on every navigation between pages.
- **FE-006 | Unsanitized Contact Form Submission**  
  *File*: `frontend/src/pages/Contact.jsx` (Line 26)  
  *Issue*: Submits directly to dummy URL `https://formspree.io/f/YOUR_FORM_ID`. Submitting the contact form will always fail in production with a network error.

---

## 4. Backend Findings

### 4.1 Routing & Controllers
- **BE-001 | Non-Transactional Multi-Document Updates (Data Inconsistency Risk)**  
  *File*: `backend/src/controllers/transactionControllers.js` (Lines 8–21, 58–83, 102–117)  
  *Issue*: `createTransaction`, `updateTransaction`, and `deleteTransaction` perform sequential updates across `TransactionModel` and `AccountModel` without a MongoDB session/transaction (`session.startTransaction()`). If any operation fails, the database remains in an inconsistent state where account balance is changed but the transaction record is missing (or vice-versa).
- **BE-002 | `updateTransaction` Returns Incomplete Payload and Breaches Redux State**  
  *File*: `backend/src/controllers/transactionControllers.js` (Lines 85–88)  
  *Issue*:
  ```javascript
  res.status(200).json({
    message: "transaction updated",
    updatedTransaction: updateTrans,
  })
  ```
  `createTransaction` and `deleteTransaction` return `{ transactions, accounts }`, whereas `updateTransaction` only returns `{ updatedTransaction }` (which is not populated). There is no corresponding `updateTransactionThunk` in `coreThunks.js`, making editing a transaction completely unsupported in Redux.
- **BE-003 | Typo in Route Export and Variable Names**  
  *File*: `backend/src/server.js` (Line 6, 55) & `backend/src/routes/transactionRoutes.js` (Line 5)  
  *Issue*: Typo `trasactionRouter` is used instead of `transactionRouter`.
- **BE-004 | Wrong HTTP Status Codes**  
  *File*: `backend/src/controllers/transactionControllers.js` (Line 43), `budgetControllers.js` (Line 98, Line 114, 135)  
  *Issue*: `getTransactions` and `getBudgets` return `201 Created` for GET requests. `updateBudget` returns `401 Unauthorized` when a budget is not found instead of `404 Not Found`.

---

## 5. Database & Schema Findings

- **DB-001 | Misconfigured Timestamps Option in Mongoose Schemas**  
  *Files*:  
  - `backend/src/models/accountModel.js` (Line 38): `{ timeStamps: true }`  
  - `backend/src/models/categoryModel.js` (Line 28): `{ timeStamps: true }`  
  - `backend/src/models/transactionModel.js` (Line 45): `{ timeStamps: true }`  
  *Issue*: Mongoose requires lowercase `{ timestamps: true }`. With camelCase `timeStamps`, Mongoose ignores the option, and `updatedAt` / `createdAt` fields are never automatically created or updated.
- **DB-002 | Corrupted Default Period Enum in Budget Model**  
  *File*: `backend/src/models/budgetModel.js` (Lines 20–22)  
  *Issue*:
  ```javascript
  period: {
    type: String,
    enum: ["monthly","yearly","weekly"],
    default: "monthly,"
  }
  ```
  The default value has a trailing comma `"monthly,"`. If a budget is created without an explicit period, MongoDB validation fails because `"monthly,"` is not in `["monthly", "yearly", "weekly"]`.
- **DB-003 | Missing Indexes for Multi-Tenant Query Filtering**  
  *Files*: `backend/src/models/transactionModel.js`, `accountModel.js`, `budgetModel.js`, `categoryModel.js`  
  *Issue*: Queries heavily filter by `{ userId, date }` and `{ userId, name }`. None of the schemas have indexed fields on `userId` or compound indexes on `(userId, date)` or `(userId, transactionType)`. Every query triggers a full collection scan ($COLLSCAN).
- **DB-004 | Static `Date.now()` Default in `AccountModel`**  
  *File*: `backend/src/models/accountModel.js` (Line 36)  
  *Issue*:
  ```javascript
  createdAt: {
    type: Date,
    default: Date.now(),
  }
  ```
  `Date.now()` is executed at server initialization time once, causing every subsequent account created to share the exact server boot timestamp. (Should be `Date.now` without parentheses).

---

## 6. Security Audit Findings

- **SEC-001 | JWT Expiration vs. Cookie MaxAge Mismatch**  
  *File*: `backend/src/controllers/authControllers.js` (Lines 72–78)  
  *Issue*: Cookie `maxAge` is set to 7 days (`7 * 24 * 60 * 60 * 1000`), but the JWT inside is signed with `expiresIn: "1d"`. After 24 hours, the client continues to send the cookie, but `jwt.verify` rejects it as expired, causing authentication failure while the browser still retains the cookie.
- **SEC-002 | Fragile and Bypassable `apiOnly` Middleware**  
  *File*: `backend/src/middleware/apiOnly.js` (Lines 1–11)  
  *Issue*:
  ```javascript
  if (!accept.includes("application/json")) {
    return res.status(403).json({ message: "Direct browser access is not allowed" })
  }
  ```
  This is security-by-obscurity. Any script, scraper, or curl request can pass `-H "Accept: application/json"` to bypass it. Conversely, if an HTTP client sends `*/*`, valid requests get blocked.
- **SEC-003 | Missing CSRF Protection on Sensitive Cookie-Based Mutating Requests**  
  *File*: `backend/src/server.js`  
  *Issue*: All mutating actions (POST/PUT/DELETE) use credentials via cookies with `sameSite: "none"` and `secure: true`. Without CSRF tokens (e.g. `csurf` or double-submit cookies), any third-party malicious website visited by an authenticated user can trigger cross-site requests if the browser environment allows it.
- **SEC-004 | No Rate Limiting on Authentication Endpoints (Brute-Force Risk)**  
  *File*: `backend/src/routes/authRoutes.js`  
  *Issue*: Neither `/api/auth/login` nor `/api/auth/register` have rate limiters (e.g. `express-rate-limit`). An attacker can brute-force passwords indefinitely without being throttled or blocked.
- **SEC-005 | Missing Input Sanitization against NoSQL Query Injection**  
  *File*: `backend/src/controllers/authControllers.js` (Line 54)  
  *Issue*:
  ```javascript
  const { username, password } = req.body;
  const exsisting_user = await UserModel.findOne({ username });
  ```
  If `username` is passed as an object `{"$ne": null}`, Mongoose will evaluate it as a selector, allowing attackers to query users without specifying exact strings.

---

## 7. Financial Logic Findings

- **FIN-001 | Net Worth Ignores Liabilities (Credit Cards / Loans)**  
  *File*: `frontend/src/pages/Accounts.jsx` (Lines 22–24) & `backend/src/controllers/accountControllers.js`  
  *Issue*:
  ```javascript
  const reducer = (a, b) => a + b.balance;
  const totalAmount = accountList.reduce(reducer, 0);
  ```
  Accounts include types: `["wallet", "bank", "card", "investment", "crypto", "loan", "creditCard"]`. A loan or credit card balance is a debt (liability), not an asset. Summing positive balance values for loans inflates the user's net worth rather than deducting it.
- **FIN-002 | Date Filtering Truncates End of Range & Suffers Timezone Skew**  
  *Files*: `backend/src/controllers/transactionControllers.js` (Lines 153–155), `budgetControllers.js` (Lines 160–162)  
  *Issue*:
  ```javascript
  date: {
    $gte: new Date(`${fullYear}-01-01`),
    $lte: new Date(`${fullYear}-12-31`)
  }
  ```
  `new Date('YYYY-12-31')` defaults to `YYYY-12-31T00:00:00.000Z`. Any transaction that took place on December 31st after midnight UTC is excluded from the entire year's summary.
- **FIN-003 | Dashboard Discrepancy: Monthly Balance vs. Net Balance**  
  *File*: `frontend/src/pages/DashBoard.jsx` (Lines 28–34, 55, 84)  
  *Issue*: The card "Total Balance" computes `₹{income - expenses}`, where `income` and `expenses` are calculated *only for the current calendar month*. Total balance in financial software means cumulative balance across all time, not just this month's net cash flow. This creates confusion with "Net Income" which displays the exact same formula.
- **FIN-004 | Budget Progress Calculation on Budgets Page Breaks with Division by Zero**  
  *File*: `frontend/src/pages/Budgets.jsx` (Lines 28, 29)  
  *Issue*:
  ```javascript
  const spentPercent = ((totalSpent / totalBudget) * 100).toFixed(2);
  const overBudgets = budgetList.filter((each) => each.percentage > 100).length;
  ```
  1. If `totalBudget === 0`, `spentPercent` becomes `NaN`.
  2. In `each.percentage > 100`: the property returned by the backend is `each.progress`, not `each.percentage`. Hence, `overBudgets` is always `0` regardless of over-budget spending.
- **FIN-005 | Floating Point Precision Inaccuracies in Currency Calculations**  
  *Files*: `transactionControllers.js`, `Accounts.jsx`, `Budgets.jsx`  
  *Issue*: Calculations perform standard floating point arithmetic (`+`, `-`) on JavaScript numbers (e.g., `0.1 + 0.2 = 0.30000000000000004`). Balances and totals in MongoDB become fractional floating point numbers over time.

---

## 8. Integration & Workflow Audit

| Workflow | Frontend Component | Redux Thunk / API | Backend Route | Status | Problem Identified |
|---|---|---|---|---|---|
| **Register** | `Signup.jsx` | `registerUser` | `POST /api/auth/register` | ⚠️ Incomplete | Successful registration returns user info, but doesn't log user in (no cookie set); forces manual redirect to Login. |
| **Login** | `Signin.jsx` | `loginUser` | `POST /api/auth/login` | ⚠️ Incomplete | Sets cookie, but does not fetch user data; relies on separate `Layout` mount to fetch core data. |
| **Edit Account** | `EditAccountModal.jsx` | `updateAccountThunk` | `PUT /api/account/update/:id` | ⚠️ Incomplete | Updates account metadata and balance in DB, but doesn't update associated transaction references. |
| **Delete Account** | `Accounts.jsx` | `deleteAccountThunk` | `DELETE /api/account/delete/:id` | ❌ Broken Integrity | Deletes account, but leaves orphan transactions referencing the deleted `accountId`. Subsequent transactions render with missing account details. |
| **Create Transaction**| `AddTransactionModal.jsx` | `createTransactionThunk` | `POST /api/transaction/createTransaction` | ⚠️ Risky | Non-transactional DB write. If Account increment fails, Transaction is still inserted. |
| **Edit Transaction** | `None` (UI button missing) | `None` (Thunk missing) | `PUT /api/transaction/update/:id` | ❌ Broken Workflow | Frontend has no edit transaction modal, no action in `TransactionPage.jsx`, and no `updateTransactionThunk` in Redux, yet backend endpoint exists. |
| **Delete Category** | `Categories.jsx` | `deleteCategoryThunk` | `DELETE /api/category/delete/:id` | ❌ Broken Integrity | Deletes category, but orphaned transactions and budgets still hold `categoryId`, causing crashes in frontend chart grouping and category lookups. |
| **Spend vs Budget Report**| `BarChartSpVsBud.jsx`| `fetchSpendVsBudgetThunk`| `GET /api/budget/spendVsBudget` | ⚠️ Partial | Month is zero-indexed in JS frontend (`month - 1` vs `month`). Inconsistent date parsing leads to empty chart bars. |

---

## 9. Performance & Code Quality Findings

- **PERF-001 | Bulky Bundle Size Warning in Vite**  
  *Evidence*: Running `npm run build` generated:
  ```text
  dist/assets/index-CGo_jy40.js   885.62 kB │ gzip: 268.48 kB
  (!) Some chunks are larger than 500 kB after minification.
  ```
  *Reason*: React 19, Recharts 3, Lucide-react, React-icons, and D3 modules are bundled into a single monolithic chunk. Missing dynamic code-splitting (`React.lazy()` / `Suspense`).
- **PERF-002 | Multiple Redundant Render Cycles on Navigation**  
  *Evidence*: `ProtectedRoute` re-verifies auth via HTTP GET `/api/auth/check` on every single internal navigation step. Combined with `FetchAppData` triggering on state changes, this causes 8 HTTP requests when switching pages.
- **PERF-003 | Redundant Duplicate Components**  
  *Evidence*:
  - `frontend/src/components/BarChartInVsEx.jsx` is almost identical to `frontend/src/components/reports/charts/BarChartInVsEx.jsx`.
  - `frontend/src/components/PieChartCategory.jsx` is duplicated in `frontend/src/components/reports/charts/PieChartCategory.jsx`.

---

## 10. Dependencies & Build Configuration Findings

- **DEP-001 | Outdated and Incompatible Package Combinations**  
  *Backend*: Uses `express: ^5.1.0` (Express v5) alongside older middleware patterns.  
  *Frontend*: Uses `react: ^19.1.1` alongside libraries that still target React 18 peer dependencies (such as `react-select: ^5.10.2` and older helper libraries).
- **DEP-002 | ESLint Exhaustive-Deps Warning**  
  *Evidence*: Running `npm run lint` returned:
  ```text
  PieChartCategory.jsx: Line 58: React Hook useEffect has missing dependencies: 'dispatch', 'month', and 'year'.
  ```
- **DEP-003 | Missing Automated Test Infrastructure**  
  *Backend `package.json`*: `"test": "echo \"Error: no test specified\" && exit 1"`  
  *Frontend `package.json`*: Has no test runner configured whatsoever (no Vitest, Jest, or RTL).

---

## 11. Testing Execution Results

| Command | Working Dir | Result | Observations / Limitations |
|---|---|---|---|
| `cmd.exe /c "cd frontend && npm run build"` | Workspace | **SUCCESS (Code 0)** | Generated 885kB chunk; triggered Vite warning for bundle size > 500kB. |
| `cmd.exe /c "cd frontend && npm run lint"` | Workspace | **WARNING (Code 0)** | 0 errors, 1 warning in `PieChartCategory.jsx` (`exhaustive-deps`). |
| `cmd.exe /c "cd backend && npm test"` | Workspace | **FAILED (Code 1)** | Output: `"Error: no test specified"`. No tests exist. |
| `cmd.exe /c "cd frontend && npm audit"` | Workspace | **OFFLINE BLOCKED** | Sandbox environment does not permit external network access to `registry.npmjs.org`. |

---

## 12. Prioritized Issue Register

| ID | Category | Issue | File Path | Line | Severity | Impact | Recommended Fix |
|---|---|---|---|---|---|---|---|
| **SEC-001** | Security | JWT 1d vs Cookie 7d expiration mismatch | `backend/src/controllers/authControllers.js` | 72, 78 | **CRITICAL** | Users become unauthorized after 1 day despite retaining 7-day cookie | Align cookie `maxAge` and JWT `expiresIn` |
| **SEC-002** | Security | Lack of CSRF protection on mutating cookie routes | `backend/src/server.js` | 17–23 | **CRITICAL** | Vulnerable to cross-site request forgery attacks | Implement anti-CSRF tokens or verify strict Origin/Referer headers |
| **BE-001** | Backend | Non-transactional multi-document balance updates | `backend/src/controllers/transactionControllers.js` | 14–22 | **CRITICAL** | Corrupts account balances if server interrupts between writes | Wrap transaction & balance updates in `mongoose.startSession()` |
| **FE-001** | Frontend | Unhandled null dereference in recent transactions | `frontend/src/pages/DashBoard.jsx` | 146–149 | **CRITICAL** | Entire dashboard crashes with white screen if category is null | Add null checks `each.categoryId?.icon` and fallback icons |
| **FE-002** | Frontend | Unhandled null dereference in account overview | `frontend/src/pages/DashBoard.jsx` | 108–114 | **CRITICAL** | Entire dashboard crashes if account icon is missing/unknown | Add fallback icon object when `find` returns undefined |
| **DB-002** | Database | Malformed default value `"monthly,"` in Budget schema | `backend/src/models/budgetModel.js` | 21 | **CRITICAL** | New budgets created without period fail Mongoose validation | Change `"monthly,"` to `"monthly"` |
| **DB-001** | Database | `timeStamps: true` typo causes missing timestamps | `backend/src/models/transactionModel.js`, `accountModel.js` | 38, 45 | **HIGH** | `createdAt` & `updatedAt` are not managed by Mongoose | Change `{ timeStamps: true }` to `{ timestamps: true }` |
| **FIN-001** | Finance | Net Worth formula incorrectly sums liabilities | `frontend/src/pages/Accounts.jsx` | 22–24 | **HIGH** | User net worth drastically overstated for loans/credit cards | Subtract balances where `accountType` in `["loan", "creditCard"]` |
| **FIN-002** | Finance | Year date filtering cuts off Dec 31 transactions | `backend/src/controllers/transactionControllers.js` | 154 | **HIGH** | Transactions on Dec 31st missed from annual reports | Set upper boundary to `new Date(year, 11, 31, 23, 59, 59, 999)` |
| **BE-002** | Backend | `updateTransaction` response breaks Redux sync | `backend/src/controllers/transactionControllers.js` | 85–88 | **HIGH** | Client state out of sync after transaction edit | Return refreshed `{ transactions, accounts }` list |
| **INT-001** | Integration | Deleting Account leaves orphan Transactions | `backend/src/controllers/accountControllers.js` | 72 | **HIGH** | Transactions page crashes or shows blank account names | Cascade delete or reassign associated transactions |
| **INT-002** | Integration | Deleting Category leaves orphan Transactions & Budgets | `backend/src/controllers/categoryControllers.js` | 72 | **HIGH** | Charts and Budgets page crash on unpopulated category | Cascade cleanup or restrict deletion of in-use categories |
| **FE-003** | Frontend | Division by zero produces `NaN%` savings rate | `frontend/src/pages/ReportsPage.jsx` | 80 | **MEDIUM** | UI visual glitch showing `NaN%` | Check `income > 0` before calculating percentage |
| **FE-004** | Frontend | Redundant duplicate Redux state key `sliceState` | `frontend/src/redux/store.js` | 7–8 | **MEDIUM** | Inconsistent state access and doubled memory consumption | Standardize on single `core` reducer key |
| **FE-005** | Frontend | `ProtectedRoute` runs duplicate verification requests | `frontend/src/components/ProtectedRoute.jsx` | 16–23 | **MEDIUM** | Flash of loading spinner and unnecessary server load | Consume `isUserLoggedIn` from Redux selector |
| **FIN-004** | Finance | Budgets page checks `percentage` instead of `progress` | `frontend/src/pages/Budgets.jsx` | 29 | **MEDIUM** | Over-budget badge always shows 0 | Change `each.percentage > 100` to `each.progress > 100` |
| **SEC-004** | Security | No rate limiting on auth endpoints | `backend/src/routes/authRoutes.js` | 8–10 | **MEDIUM** | Vulnerable to password brute force and denial of service | Attach `express-rate-limit` middleware to `/login` |
| **DB-003** | Database | Missing database indexes on foreign keys and dates | `backend/src/models/transactionModel.js` | 4–12 | **MEDIUM** | Slow queries on high transaction volumes | Add index `{ userId: 1, date: -1 }` |
| **PERF-001** | Performance | Heavy 885KB initial bundle size | `frontend/vite.config.js` | — | **MEDIUM** | Slow initial mobile load times | Implement dynamic imports (`React.lazy`) for pages |
| **FE-006** | Frontend | Contact form hardcoded to placeholder URL | `frontend/src/pages/Contact.jsx` | 26 | **LOW** | Form submission always fails | Replace with dedicated backend endpoint or configured service |

---

## 13. Recommended Fixing Order

```
[Phase 1: Security & Session Alignment]
       │
       ▼
[Phase 2: Database Schema & Transaction Integrity (ACID)]
       │
       ▼
[Phase 3: Backend Controller Normalization & Cascade Safety]
       │
       ▼
[Phase 4: Frontend Crash Prevention (Null safety & Zero division)]
       │
       ▼
[Phase 5: Financial Calculation Precision & Timezone Corrections]
       │
       ▼
[Phase 6: Routing, Redux State Alignment & Integration]
       │
       ▼
[Phase 7: Performance, Bundle Code-Splitting & Unit Testing]
```

### Dependencies Between Fixes
- **Phase 1 before Phase 3**: Cookie and JWT synchronization must be solid so that integration tests and API verification can run without unexpected session drops.
- **Phase 2 before Phase 3**: Schemas (such as the Budget enum typo and missing indexes) must be fixed before adding ACID transactions in controllers.
- **Phase 3 before Phase 4 & 6**: Standardizing backend controller response formats (`{ transactions, accounts }`) allows frontend Redux thunks and reducers to be cleanly wired without temporary hacks.
- **Phase 4 before Phase 5**: Preventing null crashes on `DashBoard.jsx` ensures that financial calculation corrections can be viewed and verified immediately.

---

## 14. Testing Checklist for Verification

- [ ] **Auth Session Persistence**: Sign in, wait 25 hours (or test with short JWT expiry), ensure cookie and token expire harmoniously without 401 crash loops.
- [ ] **Transaction Atomicity**: Simulate database failure during transaction creation; verify that account balance does NOT update if the transaction record fails to write.
- [ ] **Dashboard Null Safety**: Create a transaction, delete its category or account directly from DB, load Dashboard; verify page renders gracefully without crashing.
- [ ] **Year-End Transactions**: Add transactions on `2026-12-31 23:30:00 UTC`; verify they appear in the 2026 annual reports.
- [ ] **Net Worth Calculation**: Add a credit card account with a positive balance of 5,000; verify net worth reduces rather than increases.
- [ ] **Budget Progress**: Create a budget with 0 limit and one with 100 limit; ensure zero division is handled and exceeding categories correctly reflect in the Over Budget counter.
- [ ] **Navigation Speed**: Navigate between Dashboard, Accounts, Categories, and Transactions; ensure no duplicate network roundtrips to `/api/auth/check`.

---

## 15. Final Assessment

### Is FinGlide stable enough for production?
**No.** While the visual UI is clean and responsive, FinGlide currently has critical flaws in data integrity, session management, and runtime error handling.

### What are the biggest risks?
1. **Financial Discrepancy & Data Corruption**: Without MongoDB transactions, failed requests cause account balances and transactions to permanently drift apart.
2. **Client Crashing (White Screen of Death)**: Missing null checks in `DashBoard.jsx` cause the entire app to crash if any category or account icon is unresolved.
3. **Session Invalidation**: Users are logged out unexpectedly after 24 hours while their cookie remains valid for 7 days.

### What needs to be improved before deployment?
1. Fix the JWT/Cookie duration mismatch.
2. Implement MongoDB multi-document ACID transactions for all balance updates.
3. Add defensive null/undefined checks across all icon lookups and chart calculations.
4. Correct financial formulas (net worth with liabilities, division by zero, timezone boundary date queries).
5. Add unit and integration tests for critical finance paths.

