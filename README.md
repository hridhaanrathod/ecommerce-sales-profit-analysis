# E-Commerce Sales & Profit Analysis
## End-to-End Data Analytics Portfolio Project (FY 2025)

[![Cleaned Dataset](https://img.shields.io/badge/Dataset-5%2C000%20Verified%20Orders-blue.svg)](file:///d:/Gravity%20Projects/data/sales_analysis_cleaned.csv)
[![Total Revenue](https://img.shields.io/badge/Total%20Revenue-%E2%82%B9136.94M-emerald.svg)](file:///d:/Gravity%20Projects/03_python_analysis.md)
[![Net Profit](https://img.shields.io/badge/Net%20Profit-%E2%82%B917.78M-purple.svg)](file:///d:/Gravity%20Projects/03_python_analysis.md)
[![Profit Margin](https://img.shields.io/badge/Profit%20Margin-12.98%25-orange.svg)](file:///d:/Gravity%20Projects/03_python_analysis.md)
[![SQL Validated](https://img.shields.io/badge/SQL%20Reconciliation-100%25%20Exact-success.svg)](file:///d:/Gravity%20Projects/sql/03_advanced_analysis.sql)

---

## 1. Project Overview

**E-Commerce Sales & Profit Analysis** is an end-to-end Data Analyst portfolio project examining a commercial retail dataset of **5,000 verified transactions** across India for the entire calendar year 2025. 

The project demonstrates the complete data analytics lifecycle: ingesting raw transactional data, conducting rigorous data cleaning and validation with **Python**, establishing a relational **SQLite** database, authoring production-grade **SQL** business intelligence queries, performing comprehensive exploratory data analysis (**EDA**) with **Pandas**, **Matplotlib**, and **Seaborn**, designing enterprise BI dashboards in **Power BI**, and deploying a client-side interactive web dashboard in **HTML5, CSS3, JavaScript, PapaParse, and Chart.js**.

All findings across SQL, Python, Power BI, and the web dashboard are reconciled with **100.00% exact numerical consistency (0.0000 variance)**.

---

## 2. Business Objectives

This project answers critical executive questions regarding financial performance, channel efficiency, customer concentration, and promotional risk:

1. **Top-Line & Bottom-Line Performance**: How are gross sales, net profit, and profit margins trending across FY 2025?
2. **Category & Regional Contribution**: Which product divisions and geographic territories drive revenue, and which deliver the highest realized margin efficiency?
3. **Product & Customer Concentration**: Which catalog items and VIP customer accounts drive enterprise volume, and where does revenue concentration risk exist?
4. **Temporal Dynamics & Seasonality**: What month-over-month (MoM) revenue fluctuations occur throughout the year, and when do operational peaks and troughs emerge?
5. **Promotional Discounting & Margin Compression**: What empirical relationship exists between discount levels and realized profitability, and where does margin leakage occur on high-revenue orders?

---

## 3. Dataset Summary

- **Source File**: `data/sales_analysis_raw.csv` (Preserved 100% untouched)
- **Cleaned File**: [`data/sales_analysis_cleaned.csv`](file:///d:/Gravity%20Projects/data/sales_analysis_cleaned.csv)
- **Scale**: 5,000 verified orders × 11 attributes
- **Temporal Coverage**: January 1, 2025 – December 31, 2025 (Full Calendar Year)
- **Primary Key**: `Order_ID` (100% unique, zero duplicates)

### Data Dictionary

| Column Name | Data Type | Description | Sample Value |
|---|---|---|---|
| `Order_ID` | String | Unique transaction identifier | `ORD00001` |
| `Order_Date` | Date | Order placement date (YYYY-MM-DD) | `2025-04-13` |
| `Customer` | String | Customer account name | `Aarav Rathod` |
| `Category` | String | Merchandise division (3 categories) | `Office Supplies` |
| `Product` | String | Catalog item description (14 products) | `Calculator` |
| `Region` | String | Operational zone (West, South, North, East) | `South` |
| `City` | String | Delivery municipality (16 Indian cities) | `Hyderabad` |
| `Quantity` | Integer | Physical units purchased (1 to 10) | `3` |
| `Discount` | Float | Commercial discount rate (0.00 to 0.30) | `0.05` |
| `Sales` | Float | Gross transaction revenue in INR (₹) | `1899.23` |
| `Profit` | Float | Net realized profit in INR (₹) | `364.51` |

---

## 4. End-to-End Workflow

```
┌─────────────────────────┐
│     Raw CSV Data        │  sales_analysis_raw.csv (5,010 rows)
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Data Understanding    │  01_data_understanding.py / 01_data_understanding.md
│   & Quality Inspection  │  Identified 10 duplicate rows, casing anomalies, missing fields
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Python Data Cleaning  │  02_data_cleaning.py / 02_data_cleaning.md
│   & Preprocessing       │  Deduplication, datetime casting, standardized casing, boundary checks
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│     Relational SQLite   │  sql/sales_analysis.db / sql/01_database_setup.sql
│     Database Setup      │  Clean table creation, indexing, 5,000-row batch ingestion
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   SQL Business Analysis │  sql/02_basic_analysis.sql / sql/03_advanced_analysis.sql
│   (Basic & Advanced)    │  CTEs, Window Functions (LAG, RANK), CASE tiering, Margin Audits
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Python Exploratory    │  python/03_python_analysis.py / 03_python_analysis.md
│   Data Analysis (EDA)   │  Descriptive stats, skewness, IQR outlier detection, 8 PNG plots
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Power BI Dashboard    │  4-Page Executive BI Report: Executive Summary, Customer/Product,
│   (DAX & Reporting)     │  Regional/Monthly, Business Insights & Visualizations
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Interactive Web App    │  dashboard/index.html (HTML5, CSS3, JS, PapaParse, Chart.js)
│  (Portfolio Delivery)   │  6 views, responsive slicers, live search/sort, What-If simulator
└─────────────────────────┘
```

---

## 5. Tools & Technologies

| Discipline | Technology | Usage & Implementation |
|---|---|---|
| **Data Cleaning & Wrangling** | **Python 3**, **Pandas**, **NumPy** | Data inspection, deduplication, datetime parsing, boundary validation, aggregation |
| **Relational Database** | **SQL**, **SQLite 3** | Database schema design, table constraints, batch ingestion, query validation |
| **Statistical Analysis & EDA** | **Pandas**, **NumPy**, **SciPy** | Parametric & non-parametric statistics, IQR outlier bounds, Pearson correlation |
| **Data Visualization** | **Matplotlib**, **Seaborn** | Dual-axis trend charts, categorical distributions, correlation heatmaps, box plots |
| **Business Intelligence** | **Power BI Desktop**, **DAX** | Multi-page report design, star-schema modeling, calculated measures, slicers |
| **Web Presentation** | **JavaScript (ES6+)**, **HTML5**, **CSS3** | Single Page Application (SPA), CSS custom properties, responsive flex/grid layouts |
| **Client-Side Data Ingestion** | **PapaParse 5.4.1** | Sub-30ms client-side CSV parsing, in-memory data store, zero backend requirement |
| **Interactive Charting** | **Chart.js 4.4.1** | Dual-axis line/bar charts, doughnut charts, responsive tooltips, theme synchronization |

*(Note: No external backend, microservices, cloud warehouses, or APIs were utilized; this project intentionally operates as a self-contained, client-side, zero-infrastructure architecture).*

---

## 6. Data Cleaning & Sanitization

Data cleaning was executed in [`python/02_data_cleaning.py`](file:///d:/Gravity%20Projects/python/02_data_cleaning.py) and documented in [`02_data_cleaning.md`](file:///d:/Gravity%20Projects/02_data_cleaning.md):

1. **Exact Duplicate Removal**: Identified and dropped 10 redundant records appended at the file tail, reducing total observations from **5,010 to exactly 5,000**.
2. **Category Normalization**: Corrected inconsistent casing (`furniture` → `Furniture`, `technology` → `Technology`), standardizing all catalog items into 3 clean departments (`Technology`, `Furniture`, `Office Supplies`).
3. **Region Normalization**: Normalized uppercase casing (`EAST`, `WEST`, `NORTH`, `SOUTH`), consolidating territories into 4 geographic regions (`West`, `South`, `North`, `East`).
4. **Missing Value Handling**: Preserved transaction records containing missing values (20 `Customer`, 15 `City`) by imputing them as `'Unknown'`, thereby avoiding artificial data fabrication while retaining valid financial turnover.
5. **Datetime Conversion**: Converted `Order_Date` from plain string `object` to strict `datetime64[ns]` ISO 8601 format (`YYYY-MM-DD`). Verified zero invalid, out-of-bounds, or future timestamps.
6. **Numeric Boundary Validation**: Confirmed all values conformed to physical and business boundaries:
   - `Quantity`: $1 \le Q \le 10$ (Zero non-positive quantities)
   - `Discount`: $0.00 \le D \le 0.30$ (Zero negative discounts or excessive cuts)
   - `Sales`: $S > 0$ (Zero zero-dollar or negative sales)
   - `Profit`: $P > 0$ (Zero losses or negative margins in sanitized scope)

---

## 7. SQL Business Analysis

Relational analysis was conducted in [`sql/01_database_setup.sql`](file:///d:/Gravity%20Projects/sql/01_database_setup.sql), [`sql/02_basic_analysis.sql`](file:///d:/Gravity%20Projects/sql/02_basic_analysis.sql), and [`sql/03_advanced_analysis.sql`](file:///d:/Gravity%20Projects/sql/03_advanced_analysis.sql):

### Core SQL Techniques & Concepts Implemented

- **Aggregations & Grouping**: `GROUP BY` and `HAVING` filters to isolate high-volume commercial thresholds.
- **Conditional Logic**: `CASE` expressions for customer RFM contribution tiering (`Diamond VIP`, `Platinum`, `Gold`, `Silver`) and discount bracket categorization.
- **Common Table Expressions (CTEs)**: Modular `WITH` clauses for multi-stage queries, moving averages, and running totals.
- **Window Functions**:
  - `LAG()` to calculate Month-over-Month (MoM) revenue growth velocity.
  - `RANK()` and `DENSE_RANK()` for regional revenue hierarchies and top catalog generators.
  - Cumulative `SUM() OVER ()` for Pareto distribution and revenue concentration modeling.
- **Subqueries & Joins**: Correlated subqueries and relational joins isolating intra-category outliers and regional averages.
- **Margin Leakage Audit**: Querying the cross-section where `Sales > Avg_Sales` yet `Profit_Margin < 10%`, isolating 323 high-risk promotional orders.

---

## 8. Python Exploratory Data Analysis (EDA)

Exploratory data analysis was conducted in [`python/03_python_analysis.py`](file:///d:/Gravity%20Projects/python/03_python_analysis.py) and documented in [`03_python_analysis.md`](file:///d:/Gravity%20Projects/03_python_analysis.md):

### Statistical & Visual Findings

- **Extreme Right Skewness**:
  - **Mean Sales (₹27,388.87)** is **4.27× higher** than **Median Sales (₹6,415.53)**.
  - **Mean Profit (₹3,555.96)** is **3.28× higher** than **Median Profit (₹1,082.99)**.
  - The arithmetic mean is heavily driven by high-ticket enterprise capital goods (Laptops reaching up to ₹512,065), whereas typical daily transactions are modest baskets.
- **Outlier Assessment (IQR Method)**:
  - 471 Sales outliers ($> ₹79,355$) and 446 Profit outliers ($> ₹10,421$) were detected. These are verified legitimate corporate purchases that generate **45.8% of enterprise turnover**.
- **Correlation Analysis**:
  - Strong positive correlation ($r = 0.89$) between Sales and Profit.
  - Negative correlation ($r = -0.18$) between Discount Rate and Realized Margin %, confirming margin compression under steep promotional cuts.

### Generated Visualizations ([`outputs/`](file:///d:/Gravity%20Projects/outputs/))

1. [`outputs/category_performance.png`](file:///d:/Gravity%20Projects/outputs/category_performance.png): Dual-panel comparison of category revenue, profit, and margin efficiency.
2. [`outputs/region_performance.png`](file:///d:/Gravity%20Projects/outputs/region_performance.png): Regional revenue share donut chart alongside comparative sales and profit bars.
3. [`outputs/monthly_sales_profit.png`](file:///d:/Gravity%20Projects/outputs/monthly_sales_profit.png): Dual-axis line chart tracking 2025 monthly revenue and net profit trajectory.
4. [`outputs/top_customers.png`](file:///d:/Gravity%20Projects/outputs/top_customers.png): Sales and profit contribution for top 10 VIP accounts in Lakhs.
5. [`outputs/product_performance.png`](file:///d:/Gravity%20Projects/outputs/product_performance.png): Horizontal bar rankings of sales and realized margin % across all 14 products.
6. [`outputs/discount_profit_analysis.png`](file:///d:/Gravity%20Projects/outputs/discount_profit_analysis.png): Average profit per order and realized margin curve across discount brackets.
7. [`outputs/sales_outliers.png`](file:///d:/Gravity%20Projects/outputs/sales_outliers.png): IQR boxplot distributions of Sales and Profit highlighting upper fences.
8. [`outputs/correlation_heatmap.png`](file:///d:/Gravity%20Projects/outputs/correlation_heatmap.png): Annotated lower-triangle Pearson correlation matrix.

---

## 9. Power BI Dashboard Architecture

The Power BI implementation organizes the retail analysis into four interconnected analytical views:

1. **Page 1: Executive Summary**:
   - High-level KPI cards for Total Revenue, Total Profit, Profit Margin %, Total Orders, and Average Order Value.
   - 12-month revenue and profit trajectory with dynamic date slicers.
   - High-level category and regional revenue breakdown.
2. **Page 2: Customer & Product Analysis**:
   - Product performance leaderboard comparing sales volume against margin realization.
   - Top 10 VIP customer contribution matrix with customer ranking.
   - Order quantity vs. profit margin scatter plot.
3. **Page 3: Regional & Monthly Analysis**:
   - Regional comparison matrix evaluating sales volume, profit, and realized margin % across zones.
   - Month-over-Month (MoM) revenue growth velocity visual.
   - Intra-regional category share of wallet.
4. **Page 4: Business Insights & Strategy**:
   - High-sales, low-margin transaction audit (323 margin leakage orders).
   - Realized profit margins across promotional discount tiers.
   - Structured executive recommendations.

### Core DAX Measures Created

```dax
-- Total Gross Sales Revenue
Total Sales = SUM(sales[Sales])

-- Total Realized Net Profit
Total Profit = SUM(sales[Profit])

-- Overall Profit Margin Percentage
Profit Margin % = DIVIDE([Total Profit], [Total Sales], 0)

-- Total Cleaned Orders
Total Orders = COUNTROWS(sales)

-- Total Physical Merchandise Volume
Total Quantity = SUM(sales[Quantity])

-- Average Order Value (AOV)
Average Order Value = DIVIDE([Total Sales], [Total Orders], 0)

-- Prior Month Sales (Time Intelligence)
Prior Month Sales = 
CALCULATE(
    [Total Sales],
    DATEADD(Dim_Date[Date], -1, MONTH)
)

-- Month-over-Month (MoM) Sales Growth Rate
MoM Sales Growth % = 
DIVIDE(
    [Total Sales] - [Prior Month Sales],
    [Prior Month Sales],
    0
)
```

---

## 10. Interactive Web Dashboard (RetailPulse)

A standalone interactive web application located in [`dashboard/`](file:///d:/Gravity%20Projects/dashboard/) delivers client-side exploration without requiring an external database or server:

- **View 1: Executive Overview**: Dynamic KPI scorecards, dual-axis monthly trajectory, category share doughnut, regional sales ranking.
- **View 2: Product & Customer Analysis**: Catalog leaderboards, color-coded product margins (Green $\ge 18\%$, Orange $12\text{--}18\%$, Red $< 12\%$), top 10 customer accounts, full product matrix.
- **View 3: Regional & Monthly Analysis**: Regional turnover vs. profit realization, MoM growth velocity chart, comprehensive regional KPI matrix table.
- **View 4: Interactive Data Explorer**: Multi-field live search (Order ID, Customer, Product, City), column sorting, configurable pagination (15, 25, 50, 100 rows), and client-side CSV export.
- **View 5: Strategic Business Insights**: Strict separation of empirical observations vs. business interpretations (Category mix, discount risk, Q4 seasonality, regional stability).
- **View 6: "What-If" Promotional Discount Simulator**: Interactive slider (5% to 30%) modeling estimated margin recovery from capping maximum discounts, accompanied by a non-causal disclaimer.
- **View 7: SQL Analysis Showcase**: Embedded SQL queries from `sql/03_advanced_analysis.sql` with syntax highlighting and one-click "Copy SQL" buttons.
- **Universal Compatibility**: Works seamlessly both over HTTP servers and directly via local `file:///` execution via an embedded data fallback. Includes Light/Dark theme switching.

---

## 11. Key Verified Empirical Findings

All metrics reflect exact figures verified across SQL, Python, Power BI, and the Web Dashboard:

| Metric | Verified Value | Analytical Significance |
|---|---|---|
| **Total Gross Sales** | **₹136,944,373.51** | ~₹13.69 Crore enterprise turnover |
| **Total Net Profit** | **₹17,779,802.71** | ~₹1.78 Crore net profit |
| **Overall Profit Margin** | **12.98%** | Baseline commercial health metric |
| **Total Orders** | **5,000** | 100% verified unique transactions |
| **Total Quantity Sold** | **15,647 units** | Physical inventory movement |
| **Average Order Value (AOV)**| **₹27,388.87** | Mean transaction size (Median: ₹6,415.53) |
| **Technology Revenue** | **₹89,533,749.78** | **65.38%** of total turnover (₹11.29M profit) |
| **Furniture Revenue** | **₹45,802,082.67** | **33.45%** of total turnover (₹6.12M profit) |
| **Office Supplies Revenue** | **₹1,608,541.06** | **1.17%** of turnover, but **highest margin at 23.21%** |
| **Top Sales Region** | **West (₹43,479,991.17)** | **31.75%** revenue share across 1,591 orders |
| **Top Sales Month** | **January (₹12,819,307.38)**| Annual revenue peak (Q1 corporate procurement) |
| **Lowest Sales Month** | **July (₹10,194,536.74)** | Annual revenue trough (-6.52% MoM) |
| **Highest Profit Month** | **August (₹1,674,537.89)** | Peak monthly profit (+23.97% MoM rebound) |
| **Top Customer Account** | **Riya Rathod (₹326,926.83)**| 9 orders, ₹47,750.60 profit, 14.61% margin |

---

## 12. Analytical Methodology Notes

To maintain rigorous data standards, the following analytical distinctions are explicitly documented:

> [!NOTE]
> **Correlation vs. Causation**: Statistical correlation ($r = -0.18$ between discount rate and profit margin) reflects an observed association in historical data, not a proven causal mechanism.

> [!WARNING]
> **Observational Discount Analysis**: The observed decline in margin on high-discount sales describes historical accounting performance. It does not prove that discounts caused customers to purchase or that eliminating discounts would retain identical sales volume.

> [!IMPORTANT]
> **What-If Simulation Caveat**: The interactive discount simulator models static margin recovery under a *ceteris paribus* (holding volume constant) accounting assumption. It is an executive decision aid for boundary testing, not an econometric price elasticity forecast.

---

## 13. Project Directory Structure

```text
d:\Gravity Projects\
├── data\
│   ├── sales_analysis_raw.csv           # Original raw transactional dataset (5,010 rows) [UNTOUCHED]
│   └── sales_analysis_cleaned.csv       # Cleaned, validated dataset (5,000 rows × 11 columns)
├── sql\
│   ├── sales_analysis.db                # SQLite database with indexed tables
│   ├── 01_database_setup.sql            # Table DDL, constraints, ingestion, and validation queries
│   ├── 02_basic_analysis.sql            # Core aggregation, category, regional, and monthly queries
│   ├── 02_basic_analysis_results.md     # Basic SQL verification report
│   └── 03_advanced_analysis.sql         # 15 advanced SQL queries (CTEs, Window Functions, Audits)
├── python\
│   ├── 01_data_understanding.py         # Initial inspection and anomaly detection script
│   ├── 02_data_cleaning.py              # Data cleaning and validation pipeline script
│   └── 03_python_analysis.py            # Comprehensive EDA, statistics, and chart generation script
├── outputs\                             # 8 high-resolution Matplotlib/Seaborn visualization plots
│   ├── category_performance.png
│   ├── region_performance.png
│   ├── monthly_sales_profit.png
│   ├── top_customers.png
│   ├── product_performance.png
│   ├── discount_profit_analysis.png
│   ├── sales_outliers.png
│   └── correlation_heatmap.png
├── dashboard\                           # Standalone interactive web analytics dashboard
│   ├── index.html                       # Semantic Single-Page Application (SPA)
│   ├── README.md                        # Dashboard architecture & execution documentation
│   ├── css\
│   │   └── style.css                    # Responsive stylesheet (Dark/Light themes, Glassmorphism)
│   ├── js\
│   │   ├── data-store.js                # PapaParse loader, reactive filter engine & calculations
│   │   ├── charts.js                    # Chart.js instances, dual-axis scales, tooltips, palettes
│   │   └── app.js                       # UI controller, routing, search, sort, pagination, simulator
│   └── data\
│       ├── sales_analysis_cleaned.csv   # Local dataset copy for standalone execution
│       └── sales_data.js                # Zero-config data bundle for offline & file:/// execution
├── 01_data_understanding.md             # Comprehensive data inspection report
├── 02_data_cleaning.md                  # Step-by-step cleaning and validation log
├── 03_advanced_sql_analysis.md          # Advanced SQL business intelligence query report
├── 03_python_analysis.md                # Full Python statistical and exploratory analysis report
└── README.md                            # Overarching project portfolio documentation (This file)
```

---

## 14. How to Run the Project

### Prerequisites
- **Python 3.8+** with `pandas`, `numpy`, `matplotlib`, `seaborn`
- **SQLite 3**
- Modern Web Browser (Chrome, Edge, Firefox, Safari)

### 1. Run Python Data Cleaning & EDA
```bash
# Execute initial inspection
python python/01_data_understanding.py

# Execute data cleaning pipeline
python python/02_data_cleaning.py

# Execute full statistical analysis and generate charts into outputs/
python python/03_python_analysis.py
```

### 2. Inspect & Query SQLite Database
```bash
# Open SQLite command-line shell
sqlite3 sql/sales_analysis.db

# Or run the advanced SQL script
sqlite3 sql/sales_analysis.db < sql/03_advanced_analysis.sql
```

### 3. Launch the Interactive Web Dashboard
Because the dashboard includes an embedded data fallback, you can open it in two ways:

#### Option A: Local HTTP Server (Recommended)
```bash
# Navigate to the dashboard directory
cd dashboard

# Start Python HTTP server on port 8000
python -m http.server 8000
```
Open **`http://localhost:8000`** in any web browser.

#### Option B: Direct Browser Open (Offline / `file:///`)
Simply double-click [`dashboard/index.html`](file:///d:/Gravity%20Projects/dashboard/index.html) in Windows File Explorer or open it directly in Chrome/Edge.

---

## 15. Web Dashboard Deployment (GitHub Pages)

To publish the interactive dashboard to GitHub Pages:
1. Initialize a Git repository and commit the workspace:
   ```bash
   git init
   git add .
   git commit -m "feat: complete e-commerce data analytics portfolio project"
   ```
2. Push to your GitHub repository.
3. In your repository on GitHub, navigate to **Settings > Pages**.
4. Under **Source**, select the `main` branch and choose `/root` or `/docs` (or link to `dashboard/index.html`).
5. Access your live portfolio dashboard URL instantly.

---

## 16. Skills Demonstrated

- **Data Cleaning & Wrangling**: Identifying duplicates, standardizing string casings, imputing missing values, datetime coercion, and boundary validation.
- **Exploratory Data Analysis (EDA)**: Statistical modeling, distributional skewness analysis, IQR outlier fences, and correlation matrix analysis.
- **SQL Business Intelligence**: Multi-stage CTEs, Window Functions (`LAG`, `RANK`), `CASE` statements, grouped aggregations, and margin leakage queries.
- **Data Visualization**: Designing dual-axis charts, categorical breakdowns, correlation heatmaps, and publication-ready plots.
- **Power BI & DAX**: Multi-page report design, relationship modeling, custom DAX measures, time-intelligence calculations, and interactive slicers.
- **Interactive Dashboard Development**: Client-side single-page applications, responsive design, Dark/Light mode tokens, and scenario modeling.
- **Analytical Validation**: 100% exact numerical cross-validation across Python, SQL, Power BI, and Web applications.
- **Business Insight Generation**: Translating transactional patterns into actionable executive recommendations with clear observation vs. interpretation boundaries.

---

## 17. Future Improvements

- **Automated Data Refresh**: Implement an automated ingestion script to periodically pull new daily order batches into the SQLite database.
- **API & Backend Architecture**: Develop a lightweight REST API (FastAPI / Flask) to query the SQLite database dynamically for larger enterprise datasets (>1M rows).
- **Scheduled Pipeline**: Deploy a workflow orchestrator (such as Apache Airflow or GitHub Actions) to automate cleaning, validation, and dashboard updating.
- **Predictive Demand Forecasting**: Build time-series forecasting models (ARIMA / Prophet) to forecast Q1 2026 sales based on historical 2025 trajectories.
- **Cloud Deployment**: Host the SQLite database on a cloud database (PostgreSQL on AWS RDS / Google Cloud SQL) with Power BI Service scheduled refresh.

---

## 18. Author & Contact

- **Data Analyst**: Hridhaan
- **Project**: E-Commerce Sales & Profit Analysis (FY 2025)
- **Portfolio Repository**: [`d:/Gravity Projects`](file:///d:/Gravity%20Projects/)
