# E-Commerce Sales & Profit Analysis

An end-to-end Data Analyst portfolio project analyzing 5,000 retail sales transactions across India to evaluate revenue performance, product margins, customer buying patterns, and the impact of discounts on profitability.

[![Live Demo](https://img.shields.io/badge/Live%20Dashboard-GitHub%20Pages-blue.svg)](https://hridhaanrathod.github.io/ecommerce-sales-profit-analysis/)
[![Cleaned Dataset](https://img.shields.io/badge/Dataset-5%2C000%20Verified%20Orders-emerald.svg)](data/sales_analysis_cleaned.csv)
[![Total Revenue](https://img.shields.io/badge/Total%20Sales-%E2%82%B9136.94M-purple.svg)](03_python_analysis.md)
[![Net Profit](https://img.shields.io/badge/Net%20Profit-%E2%82%B917.78M-orange.svg)](03_python_analysis.md)
[![SQL Reconciled](https://img.shields.io/badge/SQL%20Validation-100%25%20Exact-success.svg)](sql/03_advanced_analysis.sql)

---

## Project Overview

In retail and e-commerce, high gross revenue can easily hide profit margin compression caused by aggressive discounts or low-margin product mixes. In this project, I analyze a full year of sales data (5,000 orders across 16 Indian cities) to understand where revenue and profits actually come from, how discounting affects margins, and what changes could help protect profit without hurting sales volume.

The analysis follows an end-to-end data analytics workflow: raw data audit and cleaning in Python, relational modeling in SQLite, advanced business queries in SQL, exploratory statistical analysis in Python, visual reporting in Power BI, and an interactive web dashboard for scenario testing.

---

## Business Objectives

The analysis addresses key business questions across eight dimensions:

1. **Sales Performance**: What was the annual top-line revenue trajectory, and how did average ticket size behave throughout 2025?
2. **Profitability**: What was the overall net profit margin, and how consistent was margin realization across product lines?
3. **Customer Performance**: How concentrated is revenue among high-value client accounts, and how can customers be tiered by contribution?
4. **Product Performance**: Which catalog items generate high revenue volume versus high profit margin efficiency?
5. **Regional Trends**: How do the four geographic zones (West, South, North, East) compare in sales contribution, order counts, and pricing discipline?
6. **Monthly Trends**: Where do seasonal peaks and troughs occur throughout the year, and what is the month-over-month (MoM) growth trajectory?
7. **Discount and Profit Relationship**: How do promotional discount tiers affect realized profit margins, and where does margin leakage occur on high-revenue orders?
8. **Business Opportunities**: What operational policy adjustments (e.g., promotional discount caps, inventory reallocations) can protect profitability?

---

## Dataset

* **Source File**: `data/sales_analysis_raw.csv` (Preserved 100% untouched)
* **Cleaned File**: [`data/sales_analysis_cleaned.csv`](data/sales_analysis_cleaned.csv)
* **Scale**: Exactly 5,000 orders × 11 columns
* **Date Range**: January 1, 2025 – December 31, 2025 (Full Calendar Year)
* **Primary Key**: `Order_ID` (100% unique, zero duplicates)

### Data Schema

| Column Name | Data Type | Description | Sample Value |
|---|---|---|---|
| `Order_ID` | String | Unique transaction identifier | `ORD00001` |
| `Order_Date` | Date | Order placement date (YYYY-MM-DD) | `2025-04-13` |
| `Customer` | String | Customer account name (192 verified + 'Unknown') | `Aarav Rathod` |
| `Category` | String | Merchandise department (Technology, Furniture, Office Supplies) | `Office Supplies` |
| `Product` | String | Catalog product name (14 unique items) | `Calculator` |
| `Region` | String | Sales territory (West, South, North, East) | `South` |
| `City` | String | Delivery city (16 Indian cities) | `Hyderabad` |
| `Quantity` | Integer | Units ordered per transaction (1 to 10) | `3` |
| `Discount` | Float | Discount rate applied (0.00 to 0.30) | `0.05` |
| `Sales` | Float | Gross order revenue in INR (₹) | `1899.23` |
| `Profit` | Float | Realized net profit in INR (₹) | `364.51` |

---

## Tools & Technologies

Only tools and technologies actually used in the project are listed below:

* **Python 3**: Core language used for data inspection, cleaning pipelines, and statistical EDA.
* **Pandas**: Data manipulation, filtering, aggregation, feature engineering, and time-series extraction.
* **Matplotlib & Seaborn**: Static data visualization (dual-axis charts, distributions, heatmaps, box plots).
* **SQL & SQLite 3**: Relational schema design, table constraints, batch data loading, and business queries.
* **Power BI Desktop & DAX**: Multi-page BI report design, data modeling, and custom DAX measures.
* **HTML5 & CSS3**: Responsive web layout, CSS custom properties, and Light/Dark themes.
* **JavaScript (ES6+)**: Client-side dashboard logic, routing, reactive filtering, pagination, and scenario simulation.
* **Chart.js**: Responsive client-side charts (line, bar, doughnut).
* **PapaParse**: High-speed client-side CSV parsing.
* **Git & GitHub**: Version control, repository management, and GitHub Pages web deployment.

---

## Project Workflow

The project followed a structured, seven-stage analytical pipeline:

```
Raw CSV Data (sales_analysis_raw.csv, 5,010 records)
↓
Data Understanding (Structural audit, missing data inspection, anomaly detection)
↓
Data Cleaning (Deduplication, datetime parsing, text standardization, boundary checks)
↓
SQL Analysis (SQLite relational schema, aggregations, CTEs, window functions, audits)
↓
Python EDA (Statistical distributions, IQR outlier fences, correlation matrix, 8 charts)
↓
Power BI Dashboard (4-page executive BI report with interactive slicers and DAX measures)
↓
Interactive Web Dashboard (Standalone client-side SPA with live filtering and simulator)
↓
Business Insights (Actionable findings separating empirical observation from interpretation)
```

---

## Data Cleaning

Data cleaning was executed in [`python/02_data_cleaning.py`](python/02_data_cleaning.py) and documented in [`02_data_cleaning.md`](02_data_cleaning.md). Key steps included:

1. **Duplicate Removal**: Identified and removed 10 exact duplicate rows appended at the end of the file, reducing observations from **5,010 to exactly 5,000 clean records**.
2. **Missing-Value Handling**: Identified 20 missing values in `Customer` and 15 in `City`. Rather than deleting these rows (which would eliminate valid revenue) or inventing artificial customer identities, they were imputed as `'Unknown'`, preserving financial accuracy while tracking the unassigned cohort.
3. **Category Normalization**: Resolved inconsistent lowercase strings (`furniture` → `Furniture`, `technology` → `Technology`), consolidating the catalog into 3 standardized categories.
4. **Region Normalization**: Normalized uppercase casing (`EAST`, `WEST`, `NORTH`, `SOUTH`), standardizing the data into 4 clean geographic territories.
5. **Date Validation**: Converted `Order_Date` from plain text to strict `datetime64[ns]` ISO 8601 format (`YYYY-MM-DD`). Verified zero invalid, unparseable, or out-of-range dates across all 5,000 rows.
6. **Numeric / Data-Quality Validation**: Verified that all numeric attributes conformed to expected business boundaries:
   * `Quantity`: $1 \le Q \le 10$ (Zero non-positive quantities)
   * `Discount`: $0.00 \le D \le 0.30$ (Zero negative discounts or excessive cuts)
   * `Sales`: $S > 0$ (Zero zero-dollar or negative sales)
   * `Profit`: $P > 0$ (Zero losses or negative profits in the cleaned scope)

---

## SQL Analysis

Relational analysis was conducted using SQLite across three structured SQL scripts: [`sql/01_database_setup.sql`](sql/01_database_setup.sql), [`sql/02_basic_analysis.sql`](sql/02_basic_analysis.sql), and [`sql/03_advanced_analysis.sql`](sql/03_advanced_analysis.sql).

### Key SQL Techniques Implemented

* **Aggregations & Grouping**: `GROUP BY` and `HAVING` clauses calculating total sales, profit, and order volumes across categories, regions, and cities.
* **Conditional Logic (`CASE`)**:
  * Tiering customer accounts into RFM-style contribution tiers (`Diamond VIP` for $\ge ₹250\text{k}$, `Platinum` for $\ge ₹150\text{k}$, `Gold` for $\ge ₹75\text{k}$, `Silver` below).
  * Segmenting transactions into discount rate brackets (0–5%, 5–10%, 10–20%, 20–30%).
* **Subqueries & Correlated Subqueries**: Identifying individual orders whose transaction value exceeded the average of their respective product category or geographic region.
* **Common Table Expressions (CTEs)**: Modular `WITH` clauses structuring multi-stage pipelines for monthly growth calculations, running totals, and category contribution analysis.
* **Window Functions**:
  * `LAG()`: Evaluated Month-over-Month (MoM) revenue growth velocity across all 12 calendar months.
  * `RANK()` and `DENSE_RANK()` with `PARTITION BY`: Ranked top-grossing products within each category and top customers within each region.
  * `SUM() OVER ()`: Computed cumulative running sales totals and calculated each segment's exact percentage of total company revenue.
* **Margin Leakage Audit**: A multi-stage CTE query isolating the cross-section where `Sales > Avg_Sales` yet realized `Profit_Margin < 10%`, identifying 323 high-volume orders where deep discounts significantly compromised margins.

---

## Python Analysis & Visualizations

Exploratory data analysis was conducted in [`python/03_python_analysis.py`](python/03_python_analysis.py) and documented in [`03_python_analysis.md`](03_python_analysis.md).

### Statistical EDA Highlights

* **Distributional Skewness**:
  * **Mean Sales (₹27,388.87)** is **4.27× higher** than **Median Sales (₹6,415.53)**.
  * **Mean Profit (₹3,555.96)** is **3.28× higher** than **Median Profit (₹1,082.99)**.
  * This severe right-skewness indicates that typical customer baskets are modest, while a small number of high-value laptop orders heavily pull up the arithmetic mean.
* **Outlier Detection (1.5 × IQR Method)**:
  * Identified 471 Sales outliers ($> ₹79,355$) and 446 Profit outliers ($> ₹10,421$).
  * These represent legitimate high-value bulk and corporate orders, making up 45.8% of total revenue.
* **Correlation Analysis**:
  * Strong positive linear correlation ($r = 0.89$) between Sales and Profit.
  * Negative correlation ($r = -0.18$) between Discount Rate and Profit Margin %, confirming that aggressive promotional pricing compresses margin realization.

### Output Visualizations ([`outputs/`](outputs/))

1. [`outputs/category_performance.png`](outputs/category_performance.png): Dual-panel comparison of category sales vs. profit, and realized profit margin percentages.
2. [`outputs/region_performance.png`](outputs/region_performance.png): Regional revenue share doughnut chart alongside comparative sales and profit bars.
3. [`outputs/monthly_sales_profit.png`](outputs/monthly_sales_profit.png): Dual-axis line chart tracking 2025 monthly revenue and net profit trajectory.
4. [`outputs/top_customers.png`](outputs/top_customers.png): Sales and profit contribution for top 10 VIP accounts in Lakhs.
5. [`outputs/product_performance.png`](outputs/product_performance.png): Horizontal bar rankings of sales and realized margin % across all 14 products.
6. [`outputs/discount_profit_analysis.png`](outputs/discount_profit_analysis.png): Average profit per order and realized margin curve across discount brackets.
7. [`outputs/sales_outliers.png`](outputs/sales_outliers.png): IQR boxplot distributions of Sales and Profit highlighting upper fences.
8. [`outputs/correlation_heatmap.png`](outputs/correlation_heatmap.png): Annotated lower-triangle Pearson correlation matrix.

---

## Power BI Dashboard

The Power BI implementation organizes the retail intelligence into four dedicated report views:

1. **Page 1: Executive Summary**:
   * Headline KPI cards: Total Revenue, Total Profit, Profit Margin %, Total Orders, and Average Order Value.
   * 12-month revenue trajectory with dynamic date slicers.
   * High-level category and regional revenue share visuals.
2. **Page 2: Customer & Product Analysis**:
   * Product performance leaderboard comparing total sales against realized margins.
   * Top 10 VIP customer contribution matrix with account ranking.
   * Order quantity vs. profit margin scatter visual.
3. **Page 3: Regional & Monthly Analysis**:
   * Regional comparison matrix evaluating sales volume, profit, and realized margin % across zones.
   * Month-over-Month (MoM) revenue growth velocity visual.
   * Intra-regional category share of wallet.
4. **Page 4: Business Insights & Strategy**:
   * High-sales, low-margin transaction audit visual (323 margin leakage orders).
   * Realized profit margins across promotional discount tiers.
   * Structured executive takeaways.

### Core DAX Measures

```dax
-- Total Gross Sales Revenue
Total Sales = SUM(sales[Sales])

-- Total Realized Net Profit
Total Profit = SUM(sales[Profit])

-- Overall Profit Margin Percentage
Profit Margin % = DIVIDE([Total Profit], [Total Sales], 0)

-- Total Cleaned Orders
Total Orders = COUNTROWS(sales)

-- Total Physical Units Sold
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

## Interactive Dashboard

A standalone interactive web application located in [`dashboard/`](dashboard/) delivers client-side exploration without requiring an external database or server:

* **Executive Overview**: Dynamic KPI scorecards, dual-axis monthly trajectory, category share doughnut, regional sales ranking.
* **Product & Customer Analysis**: Catalog leaderboards, color-coded product margins (Green $\ge 18\%$, Orange $12\text{--}18\%$, Red $< 12\%$), top 10 customer accounts, full product catalog matrix.
* **Regional & Monthly Analysis**: Regional sales vs. profit realization, MoM growth velocity chart, regional KPI comparison matrix table.
* **Data Explorer**: Searchable, sortable, paginated table of all 5,000 records with configurable page sizes (15, 25, 50, 100 rows) and instant CSV export.
* **Strategic Insights**: Strict separation of empirical observations vs. business interpretations.
* **What-If Promotional Discount Simulator**: Interactive slider (5% to 30%) modeling estimated profit recovery from capping extreme promotional discounts under a fixed-volume assumption.
* **SQL Analysis Showcase**: Embedded SQL queries from `sql/03_advanced_analysis.sql` with syntax highlighting and one-click copy buttons.
* **Universal Compatibility**: Works over local HTTP servers and directly via local `file:///` execution through an embedded data fallback. Includes Light/Dark theme switching.

---

## Key Findings & Business Insights

All figures reflect exact metrics reconciled across SQL, Python, Power BI, and the Web Dashboard:

| Metric | Verified Value | Analytical Significance |
|---|---|---|
| **Total Gross Sales** | **₹136,944,373.51** | ~₹13.69 Crore total sales revenue |
| **Total Net Profit** | **₹17,779,802.71** | ~₹1.78 Crore net profit |
| **Overall Profit Margin** | **12.98%** | Overall business profit margin |
| **Total Orders** | **5,000** | 100% verified unique transactions |
| **Total Quantity Sold** | **15,647 units** | Physical merchandise movement |
| **Average Order Value (AOV)** | **₹27,388.87** | Mean transaction size (Median: ₹6,415.53) |
| **Technology Revenue** | **₹89,533,749.78** | **65.38%** of total revenue (₹11.29M profit) |
| **Furniture Revenue** | **₹45,802,082.67** | **33.45%** of total revenue (₹6.12M profit) |
| **Office Supplies Revenue** | **₹1,608,541.06** | **1.17%** of revenue, but **highest margin at 23.21%** |
| **Top Sales Region** | **West (₹43,479,991.17)** | **31.75%** revenue share across 1,591 orders |
| **Top Sales Month** | **January (₹12,819,307.38)** | Annual revenue peak (Q1 corporate procurement) |
| **Lowest Sales Month** | **July (₹10,194,536.74)** | Annual revenue trough (-6.52% MoM) |
| **Highest Profit Month** | **August (₹1,674,537.89)** | Peak monthly profit (+23.97% MoM rebound) |
| **Top Customer Account** | **Riya Rathod (₹326,926.83)** | 9 orders, ₹47,750.60 profit, 14.61% margin |

### Strategic Business Takeaways

1. **Technology is the Volume Engine, Office Supplies is the Margin Champion**:
   Technology drives nearly two-thirds of all revenue and profit, but Office Supplies delivers an outstanding 23.21% profit margin (almost double Technology's 12.61%). Bundling high-margin office supplies with large technology purchases represents an immediate margin expansion opportunity.
2. **Promotional Discounting Compresses Margins**:
   Transactions with 0–5% discount average a 13.78% margin, while discounts of 20–30% compress margins down to 12.06%. Furthermore, 323 orders generated above-average revenue but yielded sub-10% margins due to aggressive promotional cuts. Implementing a standard discount ceiling of 15% would safeguard profitability.
3. **Regional Pricing Consistency**:
   Regional profit margins across India remain tightly bound between 12.87% (East) and 13.19% (South). This near-zero variance indicates that discounting policies are consistently enforced across all four territories without geographic leakage.

---

## Analytical Methodology Notes

To maintain rigorous analytical integrity, the following methodological boundaries are explicitly noted:

> [!NOTE]
> **Correlation vs. Causation**: The observed negative correlation ($r = -0.18$) between discount rates and profit margins reflects historical accounting associations, not proof of cause-and-effect.

> [!WARNING]
> **Observational Discount Analysis**: Historical data shows that steep discounts compress realized margins; however, this analysis does not claim that eliminating discounts would maintain identical sales volume. Customer price elasticity must be tested through controlled experiments.

> [!IMPORTANT]
> **What-If Simulation Caveat**: The interactive discount simulator models static accounting recovery assuming constant transaction volume (*ceteris paribus*). It is intended as a scenario-testing tool for policy thresholds, not an econometric forecast.

---

## Project Structure

```text
ecommerce-sales-profit-analysis/
├── .gitignore                           # Git ignore rules (excludes caches & temporary files)
├── index.html                           # Root entry point redirecting to dashboard/
├── README.md                            # Overarching project portfolio documentation (This file)
├── sales_analysis_raw.csv               # Original raw transactional dataset (5,010 rows) [UNTOUCHED]
├── 01_data_understanding.md             # Initial data inspection and quality report
├── 02_data_cleaning.md                  # Comprehensive cleaning & validation log
├── 03_advanced_sql_analysis.md          # Advanced SQL business intelligence query report
├── 03_python_analysis.md                # Full Python statistical & exploratory analysis report
├── data/
│   └── sales_analysis_cleaned.csv       # Cleaned, validated dataset (5,000 clean rows × 11 columns)
├── sql/
│   ├── sales_analysis.db                # SQLite database with verified sales table
│   ├── 01_database_setup.sql            # Table DDL, constraints, ingestion, and validation queries
│   ├── 02_basic_analysis.sql            # Core aggregation, category, regional, and monthly queries
│   ├── 02_basic_analysis_results.md     # Basic SQL verification report
│   └── 03_advanced_analysis.sql         # 15 advanced SQL queries (CTEs, Window Functions, Audits)
├── python/
│   ├── 01_data_understanding.py         # Initial inspection and anomaly detection script
│   ├── 02_data_cleaning.py              # Data cleaning and validation pipeline script
│   └── 03_python_analysis.py            # Comprehensive EDA, statistics, and chart generation script
├── outputs/                             # 8 high-resolution Matplotlib/Seaborn visualization plots
│   ├── category_performance.png
│   ├── region_performance.png
│   ├── monthly_sales_profit.png
│   ├── top_customers.png
│   ├── product_performance.png
│   ├── discount_profit_analysis.png
│   ├── sales_outliers.png
│   └── correlation_heatmap.png
└── dashboard/                           # Standalone interactive web analytics dashboard
    ├── index.html                       # Semantic Single-Page Application (SPA)
    ├── README.md                        # Dashboard architecture & execution documentation
    ├── css/
    │   └── style.css                    # Responsive stylesheet (Dark/Light themes, Glassmorphism)
    ├── js/
    │   ├── data-store.js                # PapaParse loader, reactive filter engine & calculations
    │   ├── charts.js                    # Chart.js instances, dual-axis scales, tooltips, palettes
    │   └── app.js                       # UI controller, routing, search, sort, pagination, simulator
    └── data/
        ├── sales_analysis_cleaned.csv   # Local dataset copy for standalone execution
        └── sales_data.js                # Zero-config data bundle for offline & file:/// execution
```

---

## How to Run the Project

### 1. Run Python Data Cleaning & EDA
```bash
# Execute initial inspection
python python/01_data_understanding.py

# Execute data cleaning pipeline
python python/02_data_cleaning.py

# Execute full statistical analysis and generate charts into outputs/
python python/03_python_analysis.py
```

### 2. Query SQLite Database
```bash
# Open SQLite command-line shell
sqlite3 sql/sales_analysis.db

# Or run the advanced SQL script directly
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
Simply double-click [`dashboard/index.html`](dashboard/index.html) in your file manager or open it directly in Chrome or Edge.

---

## Live Demo & GitHub Pages

The interactive dashboard is deployed and live on GitHub Pages:
**[https://hridhaanrathod.github.io/ecommerce-sales-profit-analysis/](https://hridhaanrathod.github.io/ecommerce-sales-profit-analysis/)**

The root `index.html` automatically forwards visitors directly to `dashboard/index.html`, where all 5,000 records, charts, dynamic filters, and analytical views load seamlessly.

---

## Author & Contact

* **Data Analyst**: Hridhaan Rathod
* **Project**: E-Commerce Sales & Profit Analysis (FY 2025)
* **GitHub Repository**: [`ecommerce-sales-profit-analysis`](https://github.com/hridhaanrathod/ecommerce-sales-profit-analysis)
