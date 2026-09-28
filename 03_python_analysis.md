# Python Data Analysis

**Project**: Retail Sales & Profitability Analysis (Data Analyst Portfolio Project)  
**Dataset**: [`data/sales_analysis_cleaned.csv`](file:///d:/Gravity%20Projects/data/sales_analysis_cleaned.csv) (5,000 Cleaned Transactions)  
**Executable Script**: [`python/03_python_analysis.py`](file:///d:/Gravity%20Projects/python/03_python_analysis.py)  
**Visualizations**: Stored in [`outputs/`](file:///d:/Gravity%20Projects/outputs/)  
**Phase**: Step 05 — Python Data Analysis & Statistical Modeling  
**Status**: Completed & Cross-Validated Against SQL  

---

## 1. Objective

The objective of this phase is to conduct an in-depth exploratory, descriptive, and diagnostic business analysis of the sanitized e-commerce sales dataset using Python's data analysis stack (**Pandas**, **NumPy**, **Matplotlib**, and **Seaborn**).

This analysis translates transactional data into actionable business intelligence by evaluating:
1. Overall commercial volume, revenue scale, and profit margins.
2. Distributional skewness and statistical dispersion in sales and profit.
3. Category and regional performance hierarchies.
4. Temporal velocity and month-over-month (MoM) revenue fluctuations.
5. Customer concentration and key account value tiers.
6. Product catalog profitability and margin efficiency.
7. Pricing policy and empirical discount-to-profit relationships.
8. Outlier identification and commercial relevance using the Interquartile Range (IQR) method.
9. Identification of high-sales, low-margin transactions (discount erosion risk).
10. Correlation analysis across operational and financial variables.
11. End-to-end reconciliation against completed SQL baselines.

---

## 2. Dataset Overview

- **Business Question**: *What is the baseline operational scale, temporal boundaries, and high-level financial volume of the enterprise?*
- **Method**: Loaded [`data/sales_analysis_cleaned.csv`](file:///d:/Gravity%20Projects/data/sales_analysis_cleaned.csv) into a Pandas DataFrame. Computed `.shape`, `.nunique()`, `.min()`, `.max()`, and vector sums.
- **Key Result**:

| High-Level Metric | Calculated Empirical Value | Notes / Scope |
| :--- | :--- | :--- |
| **Total Rows (Observations)** | **5,000** | Individual cleaned orders |
| **Total Columns (Features)** | **11** | Transaction, product, geographic, and financial attributes |
| **Date Range** | **2025-01-01 to 2025-12-31** | Full calendar year 2025 (365 days of active trading) |
| **Unique Orders** | **5,000** | 100% unique primary key (`Order_ID`) |
| **Unique Customer Accounts** | **193** | 192 verified repeat customer names + `'Unknown'` cohort |
| **Unique Products** | **14** | Commercial catalog across 3 departments |
| **Product Categories** | **3** | Technology, Furniture, Office Supplies |
| **Geographic Regions** | **4** | West, South, North, East (16 Indian cities) |
| **Total Gross Sales** | **₹136,944,373.51** | ~₹13.69 Crore gross revenue |
| **Total Net Profit** | **₹17,779,802.71** | ~₹1.78 Crore net profit |
| **Total Quantity Sold** | **15,647 units** | Physical merchandise movement |
| **Average Order Value (AOV)** | **₹27,388.87** | Mean transaction size |
| **Overall Profit Margin** | **12.98%** | Net commercial return rate (`Total Profit / Total Sales`) |

- **Business Interpretation**: The business operates at significant commercial scale with ₹136.9M in revenue across 5,000 transactions. With a 12.98% overall profit margin, the enterprise maintains healthy commercial viability, but the large gap between average ticket size (₹27.38k) and median ticket size warrants deeper distributional inspection.

---

## 3. Descriptive Statistics

- **Business Question**: *What are the central tendencies, spread, and distributional properties of key quantitative variables?*
- **Method**: Evaluated parametric metrics (mean, standard deviation) alongside non-parametric order statistics (median, quartiles, IQR) using `.describe()`.
- **Key Result**:

| Variable | Count | Mean | Median | Mean / Median Ratio | Std Dev | Min | 25% (Q1) | 75% (Q3) | Max | IQR |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Quantity (Units)** | 5,000 | 3.13 | 2.00 | 1.56x | 2.24 | 1.00 | 1.00 | 4.00 | 10.00 | 3.00 |
| **Discount (Rate)** | 5,000 | 0.0863 | 0.1000 | 0.86x | 0.0755 | 0.00 | 0.00 | 0.15 | 0.30 | 0.15 |
| **Sales (INR ₹)** | 5,000 | ₹27,388.87 | ₹6,415.53 | **4.27x** | ₹51,320.95 | ₹81.42 | ₹843.95 | ₹32,248.22 | ₹512,064.81 | ₹31,404.28 |
| **Profit (INR ₹)** | 5,000 | ₹3,555.96 | ₹1,082.99 | **3.28x** | ₹6,326.01 | ₹15.95 | ₹211.63 | ₹4,295.55 | ₹65,734.45 | ₹4,083.92 |

- **Business Interpretation & Distributional Insights**:
  - **Severe Positive (Right) Skewness in Sales & Profit**: 
    - The **Mean Sales (₹27,388.87)** is **4.27 times higher than the Median Sales (₹6,415.53)**.
    - The **Mean Profit (₹3,555.96)** is **3.28 times higher than the Median Profit (₹1,082.99)**.
    - *What this indicates*: Over 50% of orders are modest transactions under ₹6,416. However, an elite tail of high-value capital equipment (laptops, monitors, conference tables reaching up to ₹512,065) dramatically inflates the arithmetic mean. In business discussions, **median order value (₹6,415.53)** provides a more realistic representation of typical customer orders, while mean reflects total financial flow.
  - **Quantity Distribution**: Modest positive skew (Mean 3.13 vs. Median 2.0). 75% of all orders contain 4 units or fewer.
  - **Discount Distribution**: Centered around 8.6% with a median of 10%, indicating disciplined promotional bounds (maximum capped at 30%).

---

## 4. Category Performance

- **Business Question**: *How do product categories compare in terms of revenue scale, physical volume, and net profit efficiency?*
- **Method**: Grouped by `Category` using Pandas `.groupby()`, computing absolute totals, unit averages, and margin percentages. Generated comparative bar visualizations.
- **Key Result**:

| Category | Total Sales (INR ₹) | Sales Share (%) | Total Profit (INR ₹) | Profit Share (%) | Total Quantity | Order Count | Avg Order Sales | Avg Order Profit | Profit Margin (%) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Technology** | ₹89,533,749.78 | **65.38%** | ₹11,288,431.49 | **63.49%** | 5,842 | 1,890 | ₹47,372.35 | ₹5,972.72 | 12.61% |
| **Furniture** | ₹45,802,082.67 | **33.45%** | ₹6,118,096.81 | **34.41%** | 4,263 | 1,334 | ₹34,334.39 | ₹4,586.28 | 13.36% |
| **Office Supplies**| ₹1,608,541.06 | **1.17%** | ₹373,274.41 | **2.10%** | 5,542 | 1,776 | ₹905.71 | ₹210.18 | **23.21%** |
| **Total / Overall**| **₹136,944,373.51** | **100.00%** | **₹17,779,802.71** | **100.00%** | **15,647** | **5,000** | **₹27,388.87** | **₹3,555.96** | **12.98%** |

- **Visualization**: Saved to [`outputs/category_performance.png`](file:///d:/Gravity%20Projects/outputs/category_performance.png)  
  *(Displays dual-panel comparison: Sales vs. Profit in Millions, and Profit Margin percentages by category)*.
- **Business Interpretation**:
  - **Volume Engine vs. Margin Champion**: Technology is the indispensable revenue engine, driving nearly two-thirds of all revenue and profit. However, **Office Supplies delivers an outstanding 23.21% profit margin**, almost double Technology's 12.61%.
  - **Strategic Role**: Office supplies serves as a high-margin consumable buffer that reliably generates profitable baskets, while Technology and Furniture provide the large-scale cash turnover necessary to sustain enterprise scale.

---

## 5. Region Performance

- **Business Question**: *What is the geographical revenue and profitability footprint across India?*
- **Method**: Grouped by `Region`, calculated regional aggregates, margin ratios, and percentage contributions. Rendered regional donut share and dual-metric charts.
- **Key Result**:

| Region | Total Sales (INR ₹) | Revenue Share (%) | Total Profit (INR ₹) | Profit Share (%) | Total Quantity | Order Count | Avg Order Value | Profit Margin (%) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **West** | ₹43,479,991.17 | **31.75%** | ₹5,605,798.69 | 31.53% | 4,929 | 1,591 | ₹27,328.72 | 12.89% |
| **North** | ₹34,734,774.69 | **25.36%** | ₹4,508,474.97 | 25.36% | 3,955 | 1,209 | ₹28,730.17 | 12.98% |
| **South** | ₹33,832,694.46 | **24.71%** | ₹4,461,928.93 | 25.10% | 3,850 | 1,237 | ₹27,350.60 | **13.19%** |
| **East** | ₹24,896,913.19 | **18.18%** | ₹3,203,600.12 | 18.02% | 2,913 | 963 | ₹25,853.49 | 12.87% |

- **Visualization**: Saved to [`outputs/region_performance.png`](file:///d:/Gravity%20Projects/outputs/region_performance.png)  
  *(Displays regional revenue share donut chart alongside comparative sales and profit bar charts)*.
- **Business Interpretation**:
  - **West leads across all operational indicators**: Captures nearly a third of all business revenue (₹43.48M) driven by four major industrial hubs (Ahmedabad, Surat, Rajkot, Vadodara).
  - **Operational Consistency Across India**: Regional profit margins remain tightly bound between **12.87% (East) and 13.19% (South)**. This near-zero variance demonstrates that discounting and cost structures are rigorously enforced across all territories without regional margin erosion.
  - **Expansion Potential in East**: East represents 18.18% of revenue; maintaining parity in margin (12.87%) indicates that increasing marketing penetration in East will yield profitable expansion.

---

## 6. Monthly Trend Analysis

- **Business Question**: *What is the annual revenue and profit trajectory, and where do seasonal accelerations or contractions occur?*
- **Method**: Extracted `Year`, `Month_Num`, and `Month_Name` using Pandas `.dt`. Computed monthly totals, profit margins, and month-over-month (MoM) revenue growth percentages via `.pct_change()`.
- **Key Result**:

| Month | Total Sales (INR ₹) | MoM Sales Growth (%) | Total Profit (INR ₹) | Profit Margin (%) | Total Quantity | Order Count |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Jan** | **₹12,819,307.38** | — | ₹1,654,932.17 | 12.91% | 1,296 | 424 |
| **Feb** | ₹10,859,688.53 | **-15.29%** | ₹1,375,990.66 | 12.67% | 1,126 | 356 |
| **Mar** | ₹12,255,812.78 | **+12.86%** | ₹1,571,324.79 | 12.82% | 1,386 | 447 |
| **Apr** | ₹11,234,221.82 | **-8.34%** | ₹1,424,935.89 | 12.68% | 1,252 | 406 |
| **May** | ₹12,423,575.50 | **+10.59%** | ₹1,671,356.97 | 13.45% | 1,395 | 443 |
| **Jun** | ₹10,906,061.78 | **-12.21%** | ₹1,385,745.62 | 12.71% | 1,198 | 370 |
| **Jul** | **₹10,194,536.74** | **-6.52%** | ₹1,306,074.88 | 12.81% | 1,390 | 448 |
| **Aug** | ₹12,638,440.34 | **+23.97%** | **₹1,674,537.89** | 13.25% | 1,433 | 459 |
| **Sep** | ₹10,964,203.13 | **-13.25%** | ₹1,495,901.16 | **13.64%** | 1,355 | 432 |
| **Oct** | ₹10,913,587.89 | **-0.46%** | ₹1,398,922.10 | 12.82% | 1,315 | 403 |
| **Nov** | ₹11,314,304.70 | **+3.67%** | ₹1,445,317.47 | 12.77% | 1,229 | 391 |
| **Dec** | ₹10,420,632.92 | **-7.90%** | ₹1,374,763.11 | 13.19% | 1,272 | 421 |

- **Key Monthly Milestones**:
  - **Highest Sales Month**: **January (₹12,819,307.38)** — Q1 corporate budget release period.
  - **Lowest Sales Month**: **July (₹10,194,536.74)** — mid-year procurement slowdown.
  - **Highest Profit Month**: **August (₹1,674,537.89)** — driven by high unit volume (1,433 units).
  - **Highest Profit-Margin Month**: **September (13.64%)** — favorable high-margin product mix.
  - **Highest Positive MoM Growth**: **August (+23.97%)** — strong post-monsoon commercial rebound.
  - **Largest Negative MoM Growth**: **February (-15.29%)** — shorter month combined with post-holiday normalization.
- **Visualization**: Saved to [`outputs/monthly_sales_profit.png`](file:///d:/Gravity%20Projects/outputs/monthly_sales_profit.png)  
  *(Dual-axis chart illustrating monthly revenue line against secondary profit curve with key seasonal milestones)*.

---

## 7. Customer Analysis

- **Business Question**: *Who are the primary accounts driving cumulative business revenue and profit, and how concentrated is customer order volume?*
- **Method**: Filtered valid customer names (excluding `'Unknown'`), grouped by customer profile, and evaluated cumulative lifetime spend, profit generation, order frequency, and AOV.
- **Key Result**:

### Top 10 Customers by Total Sales

| Customer Name | Lifetime Orders | Total Units Bought | Total Sales (INR ₹) | Total Profit (INR ₹) | Avg Order Value (INR ₹) | Customer Value Tier |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Riya Rathod** | 36 | 121 | **₹1,749,736.30** | ₹209,718.36 | ₹48,603.79 | Diamond VIP (>= 15L) |
| **Meera Mehta** | 31 | 97 | **₹1,671,557.28** | ₹235,287.97 | ₹53,921.20 | Diamond VIP (>= 15L) |
| **Sneha Singh** | 33 | 109 | **₹1,508,515.15** | ₹170,518.17 | ₹45,712.58 | Diamond VIP (>= 15L) |
| **Ananya Verma** | 37 | 112 | **₹1,431,675.91** | ₹187,035.23 | ₹38,693.94 | Platinum VIP (10L - 15L) |
| **Isha Kumar** | 32 | 119 | **₹1,400,564.34** | ₹177,143.81 | ₹43,767.64 | Platinum VIP (10L - 15L) |
| **Vivek Gupta** | 30 | 99 | **₹1,374,723.00** | ₹150,923.92 | ₹45,824.10 | Platinum VIP (10L - 15L) |
| **Arjun Kumar** | 33 | 99 | **₹1,365,924.39** | ₹180,338.16 | ₹41,391.65 | Platinum VIP (10L - 15L) |
| **Priya Gupta** | 36 | 104 | **₹1,331,515.02** | ₹177,678.64 | ₹36,986.53 | Platinum VIP (10L - 15L) |
| **Karan Singh** | 28 | 132 | **₹1,327,488.94** | ₹156,123.75 | ₹47,410.32 | Platinum VIP (10L - 15L) |
| **Meera Rathod** | 31 | 92 | **₹1,322,602.68** | ₹177,248.09 | ₹42,664.60 | Platinum VIP (10L - 15L) |

- **Top Customers by Profit Contribution**: Led by **Meera Mehta (₹235,287.97)** and **Riya Rathod (₹209,718.36)**.
- **Top Customers by Order Frequency**: Led by **Meera Singh (38 orders)**, **Vivek Patel (37)**, **Ananya Verma (37)**, and **Sneha Desai (37)**.
- **Visualization**: Saved to [`outputs/top_customers.png`](file:///d:/Gravity%20Projects/outputs/top_customers.png)  
  *(Horizontal bar chart visualizing sales vs. net profit for the top 10 accounts in INR Lakhs)*.
- **Business Interpretation**:
  - The customer base exhibits deep loyalty, with top accounts averaging over 32 repeat purchases per year.
  - Three customers exceed the **₹15 Lakh threshold (Diamond VIP)**. The top 10 accounts alone generate **₹14.48M in sales (10.58% of total revenue)** and ₹1.82M in profit, demonstrating manageable account concentration.

---

## 8. Product Analysis

- **Business Question**: *What is the financial and operational profile of each individual product in the merchandise catalog?*
- **Method**: Grouped by `Product` and `Category`, computing sales volume, net profit, unit movement, order frequency, and profit margins. Ranked by sales and margin efficiency.
- **Key Result**:

| Product Name | Category | Total Sales (INR ₹) | Total Profit (INR ₹) | Units Sold | Order Count | Profit Margin (%) | Margin Rank |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Laptop** | Technology | **₹53,176,873.46** | **₹6,145,169.41** | 1,065 | 354 | 11.56% | 12 |
| **Conference Table** | Furniture | **₹22,172,091.66** | **₹2,468,099.56** | 1,097 | 339 | 11.13% | 13 |
| **Monitor** | Technology | **₹19,710,354.03** | **₹2,790,647.27** | 1,205 | 380 | 14.16% | 10 |
| **Printer** | Technology | **₹13,774,051.45** | **₹1,722,364.01** | 1,257 | 405 | 12.50% | 11 |
| **Desk** | Furniture | **₹10,700,864.94** | **₹1,662,900.96** | 1,069 | 340 | 15.54% | 9 |
| **Office Chair** | Furniture | ₹7,194,368.83 | ₹1,226,382.24 | 1,045 | 308 | 17.05% | 8 |
| **Bookshelf** | Furniture | ₹5,734,757.24 | ₹760,714.05 | 1,052 | 347 | **10.74%** | **14 (Lowest)** |
| **Keyboard** | Technology | ₹1,935,683.18 | ₹403,103.85 | 1,168 | 361 | 20.82% | 7 |
| **Mouse** | Technology | ₹936,787.66 | ₹227,146.95 | 1,147 | 390 | 24.25% | 4 |
| **Calculator** | Office Supplies | ₹701,674.62 | ₹136,095.44 | 1,098 | 342 | 19.40% | 6 |
| **Stapler** | Office Supplies | ₹337,423.98 | ₹80,134.07 | 1,043 | 349 | 23.75% | 5 |
| **Pen Set** | Office Supplies | ₹266,350.92 | ₹78,245.43 | 1,159 | 374 | **29.38%** | **1 (Highest)** |
| **Notebook** | Office Supplies | ₹174,713.29 | ₹47,531.84 | 1,066 | 333 | **27.21%** | 2 |
| **File Folder** | Office Supplies | ₹128,378.25 | ₹31,267.63 | 1,176 | 378 | **24.36%** | 3 |

- **Visualization**: Saved to [`outputs/product_performance.png`](file:///d:/Gravity%20Projects/outputs/product_performance.png)  
  *(Displays total sales per product alongside individual profit margins color-coded by performance tiers)*.
- **Business Interpretation**:
  - **Laptops generate over 38.8% of entire enterprise revenue** (₹53.18M), serving as the core revenue pillar.
  - **Inverse Relationship Between Ticket Size and Margin %**: High-revenue hardware (Laptops, Conference Tables, Bookshelves) carries profit margins between **10.7% and 11.6%**, whereas small consumable office goods (Pen Sets, Notebooks, Folders, Mice) yield margins between **24% and 29%**.

---

## 9. Discount vs. Profit Analysis

- **Business Question**: *What empirical associations exist between promotional discount levels and order profitability?*
- **Method**: Segmented promotional discounts into standard retail brackets: `0–5%`, `5–10%`, `10–20%`, and `20–30%` using `pd.cut()`. Analyzed order volume, mean revenue, mean profit, and overall bracket margins.
- **Key Result**:

| Promotional Discount Bracket | Order Count | Percentage of Orders | Mean Sales per Order | Mean Profit per Order | Total Sales (INR ₹) | Total Profit (INR ₹) | Realized Profit Margin (%) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **0–5%** | 2,370 | 47.40% | ₹28,638.77 | ₹3,845.44 | ₹67,873,889.41 | ₹9,113,682.74 | **13.43%** |
| **5–10%** | 1,226 | 24.52% | ₹28,316.56 | ₹3,672.17 | ₹34,716,108.10 | ₹4,502,079.45 | **12.97%** |
| **10–20%** | 1,223 | 24.46% | ₹24,631.67 | ₹3,030.63 | ₹30,124,533.32 | ₹3,706,457.50 | **12.30%** |
| **20–30%** | 181 | 3.62% | ₹23,369.30 | ₹2,528.08 | ₹4,229,842.68 | ₹457,583.02 | **10.82%** |

- **Visualization**: Saved to [`outputs/discount_profit_analysis.png`](file:///d:/Gravity%20Projects/outputs/discount_profit_analysis.png)  
  *(Displays average profit per order alongside realized profit margin curves across discount tiers)*.
- **Business Interpretation & Governance Note**:
  - **Empirical Association**: As discount tiers increase from `0–5%` to `20–30%`, the realized profit margin decreases steadily from **13.43% down to 10.82%** (-261 basis points), and average profit per order drops from **₹3,845 to ₹2,528** (-34.2%).
  - **Methodological Clarification**: This is an observational association reflecting gross margin mechanics; it does **not** assert causal elasticity (e.g. we do not assume eliminating discounts would maintain current volume).

---

## 10. Outlier Analysis

- **Business Question**: *What is the volume and magnitude of statistical outliers in Sales and Profit, and why are they commercially vital?*
- **Method**: Evaluated outliers using the standard non-parametric Interquartile Range (IQR) technique ($1.5 \times IQR$ above the 75th percentile).
- **Key Result**:

| Metric | 25th Percentile (Q1) | 75th Percentile (Q3) | IQR | Upper Fence Limit | Outlier Count | Outlier Pct (%) | Maximum Outlier Observed |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Sales** | ₹843.95 | ₹32,248.22 | ₹31,404.28 | **₹79,354.64** | **471** | **9.42%** | ₹512,064.81 |
| **Profit** | ₹211.63 | ₹4,295.55 | ₹4,083.92 | **₹10,421.42** | **446** | **8.92%** | ₹65,734.45 |

- **Visualization**: Saved to [`outputs/sales_outliers.png`](file:///d:/Gravity%20Projects/outputs/sales_outliers.png)  
  *(Standard boxplots of Sales and Profit in thousands showing positive outlier distributions beyond the upper fences)*.
- **Why Outliers Must NOT Be Deleted**:
  - In retail analytics, high-value transactions represent legitimate bulk institutional purchases (e.g., procurement of 10 laptops or 8 conference tables).
  - Deleting these 471 sales outliers would artificially erase **₹62.7M in revenue (45.8% of total revenue)**, invalidating the financial integrity of the business portfolio.

---

## 11. High-Sales Low-Profit Orders (Pricing & Margin Audit)

- **Business Question**: *Which transactions produced high top-line revenue but yielded compressed margins (< 10%), posing margin erosion risks?*
- **Method**: Filtered orders satisfying: $\text{Sales} > \text{Store-Wide Mean (₹27,388.87)}$ AND $\text{Profit Margin} < 10.0\%$.
- **Key Result**:

| Metric in High-Sales Low-Profit Cohort | Calculated Value | Contextual Benchmark |
| :--- | :---: | :--- |
| **Total Number of Identified Orders** | **323 orders** | **6.46%** of all 5,000 store transactions |
| **Cumulative Sales Revenue** | **₹31,668,016.22** | **23.13%** of total store revenue |
| **Cumulative Net Profit** | **₹2,589,972.44** | **14.57%** of total store profit |
| **Average Promotional Discount** | **10.03%** | Compared to 8.63% store-wide average |
| **Average Realized Profit Margin** | **8.34%** | Compared to 12.98% store-wide average |

### Top 5 Exemplars of Margin Compression:
| Order_ID | Order_Date | Customer | Product | Quantity | Discount | Sales (INR ₹) | Profit (INR ₹) | Profit Margin (%) |
| :--- | :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| `ORD04339` | 2025-01-09 | Karan Kumar | Laptop | 10 | 0.05 | ₹509,788.51 | ₹38,232.11 | 7.50% |
| `ORD01245` | 2025-12-26 | Sneha Singh | Laptop | 8 | 0.00 | ₹451,007.65 | ₹34,634.06 | 7.68% |
| `ORD04759` | 2025-04-29 | Vivek Gupta | Laptop | 10 | 0.20 | ₹421,268.17 | ₹39,562.83 | 9.39% |
| `ORD00654` | 2025-12-17 | Riya Mehta | Laptop | 8 | 0.05 | ₹409,899.51 | ₹27,344.06 | 6.67% |
| `ORD01239` | 2025-04-27 | Arjun Desai | Laptop | 10 | 0.30 | ₹388,680.20 | ₹17,921.54 | **4.61%** |

- **Business Interpretation**:
  - While none of these orders incurred losses, orders like `ORD01239` (where a 30% discount on 10 laptops reduced margin to 4.61%) represent prime candidates for minimum-margin floor governance. Setting a minimum margin floor of 8% on bulk B2B hardware would protect bottom-line earnings.

---

## 12. Correlation Analysis

- **Business Question**: *What is the degree of linear association between quantitative operational and financial parameters?*
- **Method**: Evaluated Pearson correlation coefficients across numerical attributes and generated an annotated heatmap.
- **Key Result**:

| Metric | Quantity | Discount | Sales | Profit | Profit Margin (%) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Quantity** | 1.000 | -0.000 | 0.355 | 0.378 | -0.008 |
| **Discount** | -0.000 | 1.000 | -0.030 | -0.058 | -0.076 |
| **Sales** | 0.355 | -0.030 | 1.000 | **0.954** | -0.476 |
| **Profit** | 0.378 | -0.058 | **0.954** | 1.000 | -0.403 |
| **Profit Margin (%)** | -0.008 | -0.076 | -0.476 | -0.403 | 1.000 |

- **Visualization**: Saved to [`outputs/correlation_heatmap.png`](file:///d:/Gravity%20Projects/outputs/correlation_heatmap.png)  
  *(Lower-triangle annotated heatmap color-coded by linear association strength)*.
- **Analytical Governance**:
  - **Sales and Profit exhibit an exceptionally strong positive correlation ($r = 0.954$)**, confirming that top-line volume is the primary driver of absolute profit dollars.
  - **Negative correlation between Sales and Profit Margin ($r = -0.476$)**: Higher-priced hardware orders carry lower percentage margins, while low-cost office items carry high percentage margins.
  - *Methodological Rule*: Correlation measures linear co-movement only; it does not indicate that increasing sales mechanically causes margins to contract.

---

## 13. Executive Business KPI Summary

The table below consolidates the core performance metrics derived from the Python analysis:

| Executive Business KPI | Baseline Empirical Value | Strategic Commercial Significance |
| :--- | :---: | :--- |
| **Total Gross Revenue** | **₹136,944,373.51** | Total top-line sales turnover |
| **Total Net Profit** | **₹17,779,802.71** | Realized cumulative enterprise earnings |
| **Overall Profit Margin** | **12.98%** | Net commercial profitability benchmark |
| **Total Order Volume** | **5,000 orders** | Fulfilled commercial transactions |
| **Total Merchandise Units Sold** | **15,647 units** | Physical unit volume moving through supply chain |
| **Average Order Value (AOV)** | **₹27,388.87** | Mean transaction size across all orders |
| **Top Category by Sales** | **Technology (₹89,533,749.78)** | Generates 65.38% of total revenue |
| **Top Region by Sales** | **West (₹43,479,991.17)** | Leading sales territory (31.75% of revenue) |
| **Top Product by Sales** | **Laptop (₹53,176,873.46)** | Single highest grossing product (38.83% of revenue) |
| **Top Customer by Spend** | **Riya Rathod (₹1,749,736.30)** | #1 account with 36 repeat purchases |

---

## 14. Final Business Insights (Observation vs. Interpretation)

To maintain rigorous data analyst standards, empirical findings are separated into verifiable facts (**Observation**) and commercial strategic deductions (**Interpretation**):

### Insight 1: Heavy Pareto Concentration in Order Value
- **Observation**: 27.66% of orders (1,383 transactions) generate 84.90% of total revenue (₹116.27M). Mean sales (₹27,389) is 4.27x the median sales (₹6,416).
- **Interpretation**: The business model is heavily anchored by B2B bulk purchases. While everyday consumer orders sustain transaction velocity, enterprise corporate clients drive the bottom-line health of the company.

### Insight 2: Category Polarization: Volume Driver vs. Margin Champion
- **Observation**: Technology generates 65.38% of revenue at a 12.61% profit margin. Office Supplies generates only 1.17% of revenue but achieves a 23.21% profit margin.
- **Interpretation**: Technology acts as the customer acquisition and cash-generation engine, while Office Supplies provides margin efficiency. Bundling high-margin supplies with technology hardware represents a strong cross-selling strategy.

### Insight 3: Geographic Parity in Profitability
- **Observation**: Sales volume varies substantially by territory (West at ₹43.48M vs. East at ₹24.90M), yet regional profit margins remain tightly clustered between 12.87% and 13.19%.
- **Interpretation**: Pricing discipline is successfully standardized nationwide. The East territory is not inherently less profitable; it is simply underpenetrated in sales volume.

### Insight 4: Rebound Capacity and Cyclicality in 2025
- **Observation**: Monthly revenue peaked in January (₹12.82M), declined to an annual low in July (₹10.19M), and experienced a sharp +23.97% MoM rebound in August (₹12.64M).
- **Interpretation**: Annual sales demonstrate strong cyclicality aligned with corporate procurement cycles (January budget releases and August Q3 inventory expansions). Operational staffing and inventory should be proactively positioned ahead of these peaks.

### Insight 5: Margin Compression in Deep Discount Tiers
- **Observation**: Realized profit margin declines from 13.43% for orders with $\le 5\%$ discount down to 10.82% for orders with $> 20\%$ discount. 323 high-value orders have margins below 10%, averaging an 8.34% margin.
- **Interpretation**: Aggressive discounting on large-ticket hardware erodes margin without necessarily providing proportionate volume expansion. Establishing minimum-margin thresholds on B2B laptop orders would safeguard bottom-line returns.

### Insight 6: High Repeat Customer Loyalty
- **Observation**: The top 10 individual accounts each made between 28 and 37 purchases in 2025, generating over ₹1.3M in lifetime spend each.
- **Interpretation**: Commercial accounts demonstrate high retention and recurring purchase cycles. Establishing dedicated account management for Diamond and Platinum VIP tiers will protect this key revenue stream.

---

## 15. Cross-Validation Against SQL Baseline

To ensure data integrity across the analytical stack, key metrics produced by Python were cross-checked against the SQL database outputs from Steps 3 and 4:

| Validation Metric | SQL Baseline Result (Step 3 & 4) | Python Pandas Result (Step 5) | Numerical Difference | Validation Status |
| :--- | :---: | :---: | :---: | :---: |
| **Total Gross Sales** | ₹136,944,373.51 | ₹136,944,373.51 | **0.0000** | **EXACT MATCH (PASS)** |
| **Total Net Profit** | ₹17,779,802.71 | ₹17,779,802.71 | **0.0000** | **EXACT MATCH (PASS)** |
| **Total Orders** | 5,000 | 5,000 | **0** | **EXACT MATCH (PASS)** |
| **Technology Sales** | ₹89,533,749.78 | ₹89,533,749.78 | **0.0000** | **EXACT MATCH (PASS)** |
| **Furniture Sales** | ₹45,802,082.67 | ₹45,802,082.67 | **0.0000** | **EXACT MATCH (PASS)** |
| **Office Supplies Sales** | ₹1,608,541.06 | ₹1,608,541.06 | **0.0000** | **EXACT MATCH (PASS)** |
| **West Region Sales** | ₹43,479,991.17 | ₹43,479,991.17 | **0.0000** | **EXACT MATCH (PASS)** |
| **North Region Sales** | ₹34,734,774.69 | ₹34,734,774.69 | **0.0000** | **EXACT MATCH (PASS)** |
| **South Region Sales** | ₹33,832,694.46 | ₹33,832,694.46 | **0.0000** | **EXACT MATCH (PASS)** |
| **East Region Sales** | ₹24,896,913.19 | ₹24,896,913.19 | **0.0000** | **EXACT MATCH (PASS)** |
| **January Sales** | ₹12,819,307.38 | ₹12,819,307.38 | **0.0000** | **EXACT MATCH (PASS)** |
| **December Sales** | ₹10,420,632.92 | ₹10,420,632.92 | **0.0000** | **EXACT MATCH (PASS)** |

**Validation Audit Result**: **100.00% Exact Match**. There are zero discrepancies between the SQL relational database queries and the Python Pandas calculations.

---
*Report and visualizations generated via `python/03_python_analysis.py`.*
