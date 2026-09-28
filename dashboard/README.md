# RetailPulse: E-Commerce Sales & Profitability Intelligence
## Interactive Portfolio Dashboard

[![Dataset](https://img.shields.io/badge/Dataset-5%2C000%20Verified%20Orders-blue.svg)](file:///d:/Gravity%20Projects/data/sales_analysis_cleaned.csv)
[![Revenue](https://img.shields.io/badge/FY25%20Revenue-%E2%82%B9136.94M-emerald.svg)](file:///d:/Gravity%20Projects/dashboard/index.html)
[![Profit](https://img.shields.io/badge/FY25%20Net%20Profit-%E2%82%B917.78M-purple.svg)](file:///d:/Gravity%20Projects/dashboard/index.html)
[![Architecture](https://img.shields.io/badge/Architecture-Zero--Backend%20Static%20SPA-orange.svg)](file:///d:/Gravity%20Projects/dashboard/index.html)

---

## 1. Executive Summary

**RetailPulse** is an enterprise-grade, client-side interactive web dashboard designed to demonstrate the complete Data Analyst technical toolkit—bridging data cleaning, relational SQL modeling, exploratory Python statistics, and modern web analytics.

Built to analyze the **5,000 verified transactions** of the 2025 retail dataset (`data/sales_analysis_cleaned.csv`), this application allows stakeholders, recruiters, and hiring managers to interactively explore sales trajectories, customer segments, regional distributions, product margins, and promotional discount sensitivity in real time.

---

## 2. Key Pages & Features

### Page 1 — Executive Overview
- **Dynamic KPI Scorecard**: Total Sales (`₹136.94M`), Total Net Profit (`₹17.78M`), Overall Margin (`12.98%`), Order Count (`5,000`), Units Sold (`15,647`), and Average Order Value (`₹27,388.87`). All dynamically reactive to active filters.
- **Monthly Revenue & Profit Trajectory**: Dual-axis line and area chart mapping sales against profit margin realization across all 12 months of 2025.
- **Category Sales Share**: Doughnut chart showing contribution % across Technology, Furniture, and Office Supplies.
- **Regional Sales Distribution**: Bar visualization ranking revenue across West, South, North, and East regions.
- **Global Sticky Slicers**: Multi-criteria cross-filtering by Period (Quarterly / Monthly), Region, and Product Category with one-click filter reset.

### Page 2 — Product & Customer Analysis
- **Top Products by Sales**: Horizontal ranking of top grossing catalog items (Laptops, Printers, Office Chairs, Desks).
- **Product Profit Margin Efficiency**: Color-coded margin distribution highlighting high-margin (&ge;20%), moderate (13–20%), and compressed (&lt;13%) SKUs.
- **Top 10 VIP Customers**: Dual-bar comparison of sales contribution vs. net profit generated for high-value client accounts (led by Riya Rathod, Meera Mehta, and Sneha Singh).
- **Product Catalog Performance Matrix**: Complete tabular breakdown of orders, physical quantity, revenue, profit, and realized margin.

### Page 3 — Regional & Monthly Analysis
- **Regional Sales vs. Net Profit**: Head-to-head comparison evaluating top-line turnover against bottom-line margin realization per territory.
- **Month-over-Month Sales Growth (%)**: Visualizing monthly acceleration and contraction rates across FY 2025.
- **Regional KPI Comparison Matrix**: Summary table with order volumes, sales share %, total profit, and average ticket size.

### Page 4 — Interactive Data Explorer
- **Live Search**: Instant multi-field substring matching across `Order_ID`, `Customer`, `Product`, `City`, `Region`, and `Category`.
- **Column Sorting**: Click any header to sort ascending or descending.
- **Client-Side Pagination**: Configurable page sizes (15, 25, 50, 100 rows) with responsive page-stepper navigation.
- **Export to CSV**: Instant client-side download of the active, filtered dataset as a valid CSV file.

### Page 5 — Strategic Business Insights
- **Observation vs. Interpretation Framework**: Strict separation between empirical statistical findings and business recommendations.
- **Core Findings Documented**:
  1. *Technology Dominance*: 65.4% revenue share and 72.8% profit contribution (14.47% margin).
  2. *Discount Margin Erosion*: Margin drops from 13.78% (at 0–5% discount) to 12.06% (at 20–30% discount).
  3. *Q4 Holiday Surge*: Peak monthly revenue in October (₹12.59M) and December (₹12.44M).
  4. *Regional Uniformity*: Consistent 12.7%–13.1% profit margins across all four geographic zones.

### Page 6 — What-If Promotional Discount Simulator
- **Interactive Policy Slider**: Simulate capping maximum discounts from 30% down to 5% (default 15%).
- **Live Sensitivity Metrics**: Displays impacted order volume, original baseline profit, estimated post-policy profit, recovered revenue gain, and realized margin lift (bps).
- **Discount Tier Visualization**: Composite bar-and-line chart showing average profit and margin % across discount tiers.
- **Methodological Disclaimer**: Transparent non-causal disclaimer noting the *ceteris paribus* (fixed demand) assumption.

### Page 7 — SQL Analysis & Verification Showcase
- **Benchmark SQL Queries**: Embedded SQL queries from `sql/03_advanced_analysis.sql` with syntax highlighting, business questions, and "Copy Query" buttons.
- Demonstrates advanced SQL techniques: Common Table Expressions (CTEs), Window Functions (`LAG`), `CASE` expressions, and correlated subqueries.

---

## 3. Technology Stack & Architecture

```
dashboard/
├── index.html                  # Semantic HTML5 layout, sidebar, tabs, scorecards, canvas containers
├── css/
│   └── style.css               # Modern CSS with dark/light tokens, glassmorphism, responsive grid
├── js/
│   ├── data-store.js           # PapaParse CSV ingestion, in-memory filtering, KPI & what-if engine
│   ├── charts.js               # Chart.js instance lifecycle manager, dual-axis tooltips, theme palettes
│   └── app.js                  # UI event orchestrator, routing, live search, sorting, pagination, toasts
└── data/
    └── sales_analysis_cleaned.csv  # 5,000 row verified clean dataset (~440 KB)
```

| Layer | Technology | Rationale |
|---|---|---|
| **Structure** | Semantic HTML5 | Clean accessibility, SEO-friendly layout, zero external framework overhead |
| **Styling** | Modern CSS3 | CSS Custom Properties (Variables), Dark/Light mode tokens, Flexbox & CSS Grid, Glassmorphic elevation |
| **Data Ingestion** | [PapaParse 5.4.1](https://www.papaparse.com/) | High-performance CSV parser. Ingests and parses all 5,000 records in <30ms |
| **Data Visualization** | [Chart.js 4.4.1](https://www.chartjs.org/) | Responsive canvas charts, dual y-axes, dynamic color palettes, tooltips |
| **Architecture** | Static Single Page App (SPA) | 100% client-side execution; requires zero backend or database servers to preview |

---

## 4. How to Run Locally

Because the dashboard uses the standard `fetch()` API to stream `sales_analysis_cleaned.csv`, browsers require it to be served over an HTTP protocol rather than raw `file://` to satisfy CORS/origin security policies.

### Option 1: Python (Recommended - Built-in)
Run the built-in HTTP server from the project directory:

```bash
# Navigate to the dashboard directory
cd dashboard

# Start server on port 8000
python -m http.server 8000
```
Open your browser and navigate to:
```
http://localhost:8000
```

### Option 2: Node.js / npx
```bash
cd dashboard
npx serve .
```

### Option 3: VS Code / IDE Live Server
Right-click `dashboard/index.html` inside VS Code and select **"Open with Live Server"**.

---

## 5. Deployment Options

### GitHub Pages (Zero-Configuration Host)
1. Push the repository to GitHub.
2. In your GitHub repository settings, go to **Settings > Pages**.
3. Under **Branch**, select `main` and set the folder to `/root` or `/docs` (or link `dashboard/` from your portfolio index).
4. Save and access the live URL instantly.

---

## 6. Analytical Integrity & Simulation Caveats

> [!IMPORTANT]
> **Observation vs. Interpretation:** All figures reported in the Executive Overview and Business Insights sections originate directly from the verified SQLite database (`sql/sales_analysis.db`) and Pandas analysis (`python/03_python_analysis.py`).

> [!WARNING]
> **What-If Simulation Disclaimer:** The promotional discount simulator models a static accounting estimation (assuming fixed transaction volumes). In real-world retail environments, reducing discounts may impact conversion velocity depending on price elasticity of demand. The tool is designed for scenario boundary exploration rather than deterministic causal prediction.

---

## 7. Portfolio Author

- **Data Analyst:** Hridhaan
- **Project:** E-Commerce Sales & Profit Analysis (FY 2025)
- **Tools:** Python (Pandas, Matplotlib, Seaborn), SQLite, Power BI, HTML5/CSS3/JavaScript
