# Phase 3: Basic SQL Analysis & Query Execution Results

**Project**: Retail Sales & Profitability Analysis (Data Analyst Portfolio Project)  
**Database File**: [`sql/sales_analysis.db`](file:///d:/Gravity%20Projects/sql/sales_analysis.db)  
**Target Table**: `sales`  
**Dataset Source**: [`data/sales_analysis_cleaned.csv`](file:///d:/Gravity%20Projects/data/sales_analysis_cleaned.csv) (5,000 sanitized records)  
**Script Files**: 
- DDL & Setup: [`sql/01_database_setup.sql`](file:///d:/Gravity%20Projects/sql/01_database_setup.sql)
- Queries: [`sql/02_basic_analysis.sql`](file:///d:/Gravity%20Projects/sql/02_basic_analysis.sql)  
**Phase**: Step 03 — Database Ingestion & Basic Exploratory SQL  
**Status**: Executed & Verified (Zero Fabricated Numbers)  

---

## Executive Summary & Database Integrity Check

The cleaned dataset `data/sales_analysis_cleaned.csv` was ingested into a dedicated local SQLite database [`sql/sales_analysis.db`](file:///d:/Gravity%20Projects/sql/sales_analysis.db) inside the `sales` table.

### Post-Ingestion Verification Results

Prior to running exploratory queries, four strict relational integrity constraints were validated:

| Verification Metric | Expected Target | Actual Database Result | Status |
| :--- | :---: | :---: | :---: |
| **Total Rows Loaded** | 5,000 | **5,000** | **PASS** |
| **Unique `Order_ID` Count** | 5,000 | **5,000** | **PASS** |
| **Duplicate `Order_ID` Count** | 0 | **0** | **PASS** |
| **Unexpected NULL Values** | 0 | **0** | **PASS** |

All 5,000 transactions are intact, uniquely indexed by primary key `Order_ID`, and free of unintended nulls.

---

## High-Level KPI Scorecard

| Core Metric | SQL Calculation Result | Unit / Format |
| :--- | :---: | :--- |
| **Total Order Volume** | **5,000** | Orders |
| **Total Gross Revenue** | **₹136,944,373.51** | INR (₹13.69 Cr / ~136.9M) |
| **Total Net Profit** | **₹17,779,802.71** | INR (₹1.78 Cr / ~17.8M) |
| **Overall Profit Margin** | **12.98%** | Aggregate (`Total Profit / Total Sales`) |
| **Total Quantity Sold** | **15,647** | Units |
| **Average Order Value (AOV)**| **₹27,388.87** | INR per transaction |
| **Average Units per Order** | **3.13** | Units per transaction |
| **Sales Value Range** | **₹81.42 – ₹512,064.81** | INR per transaction |
| **Profit Range** | **₹15.95 – ₹65,734.45** | INR per transaction |
| **Unique Customer Accounts** | **192** named (+ 20 Unknown) | Customer Profiles |

---

## Detailed Query Execution Log

The following 12 exploratory and validation queries were executed directly against [`sql/sales_analysis.db`](file:///d:/Gravity%20Projects/sql/sales_analysis.db). Every query, its business purpose, and the actual database output are recorded below.

---

### Query 1: Count Total Orders

**Purpose**: Quantify the overall transaction volume processed by the store across the entire operational period.

```sql
SELECT 
    COUNT(Order_ID) AS total_orders
FROM sales;
```

**Actual Result**:

| total_orders |
| :---: |
| 5,000 |

*Business Context*: Confirms that exactly 5,000 individual transactions are registered in the system following the removal of duplicate records.

---

### Query 2: Calculate Total Sales

**Purpose**: Calculate the cumulative gross revenue generated across all transactions before deductions.

```sql
SELECT 
    ROUND(SUM(Sales), 2) AS total_sales_inr
FROM sales;
```

**Actual Result**:

| total_sales_inr |
| :---: |
| 136,944,373.51 |

*Business Context*: Total gross revenue stands at **₹136,944,373.51** (~₹13.69 Crore).

---

### Query 3: Calculate Total Profit

**Purpose**: Determine the total cumulative net profit realized across all sales transactions.

```sql
SELECT 
    ROUND(SUM(Profit), 2) AS total_profit_inr
FROM sales;
```

**Actual Result**:

| total_profit_inr |
| :---: |
| 17,779,802.71 |

*Business Context*: The business earned **₹17,779,802.71** in cumulative net profit, yielding a healthy aggregate commercial return of **12.98%**.

---

### Query 4: Calculate Total Quantity Sold

**Purpose**: Measure total physical product volume moving through distribution channels.

```sql
SELECT 
    SUM(Quantity) AS total_units_sold
FROM sales;
```

**Actual Result**:

| total_units_sold |
| :---: |
| 15,647 |

*Business Context*: Across 5,000 orders, **15,647 individual merchandise units** were fulfilled, reflecting an average basket size of 3.13 units per order.

---

### Query 5: Calculate Average Sales per Order

**Purpose**: Establish the Average Order Value (AOV) benchmark to monitor customer spending tiers.

```sql
SELECT 
    ROUND(AVG(Sales), 2) AS avg_sales_per_order_inr
FROM sales;
```

**Actual Result**:

| avg_sales_per_order_inr |
| :---: |
| 27,388.87 |

*Business Context*: The mean ticket size is **₹27,388.87**. As identified in Phase 1, this parametric mean is skewed upwards by high-value technology items (laptops and monitors), whereas the median order value is ₹6,415.53.

---

### Query 6: Find Minimum and Maximum Sales

**Purpose**: Identify the transaction value boundary extremes (lowest vs. highest order revenue).

```sql
SELECT 
    MIN(Sales) AS min_sales_inr, 
    MAX(Sales) AS max_sales_inr
FROM sales;
```

**Actual Result**:

| min_sales_inr | max_sales_inr |
| :---: | :---: |
| 81.42 | 512,064.81 |

*Business Context*: 
- **Minimum Sale (₹81.42)**: Single-unit purchase of a discounted File Folder (`ORD01623`).
- **Maximum Sale (₹512,064.81)**: Bulk 10-unit corporate purchase of high-end Laptops (`ORD00179`).

---

### Query 7: Find Minimum and Maximum Profit

**Purpose**: Identify the earnings boundary extremes achieved on individual sales orders.

```sql
SELECT 
    MIN(Profit) AS min_profit_inr, 
    MAX(Profit) AS max_profit_inr
FROM sales;
```

**Actual Result**:

| min_profit_inr | max_profit_inr |
| :---: | :---: |
| 15.95 | 65,734.45 |

*Business Context*:
- **Minimum Profit (₹15.95)**: Associated with the lowest-value transaction (`ORD01623`).
- **Maximum Profit (₹65,734.45)**: Associated with an 8-unit commercial Laptop transaction (`ORD00090`).
- Confirms zero orders incurred a net operational loss in this dataset.

---

### Query 8: Count Unique Customers

**Purpose**: Measure customer acquisition breadth and quantify the guest/unregistered transaction segment.

```sql
SELECT 
    COUNT(DISTINCT Customer) AS total_unique_profiles,
    COUNT(DISTINCT CASE WHEN Customer != 'Unknown' THEN Customer END) AS known_named_customers,
    COUNT(CASE WHEN Customer = 'Unknown' THEN 1 END) AS orders_with_unknown_customer
FROM sales;
```

**Actual Result**:

| total_unique_profiles | known_named_customers | orders_with_unknown_customer |
| :---: | :---: | :---: |
| 193 | 192 | 20 |

*Business Context*: 
- **192 verified unique repeat customers** generate 4,980 of the 5,000 orders (~25.9 orders per customer).
- Exactly **20 orders** belong to guest/unregistered transactions safely documented as `'Unknown'`.

---

### Query 9: List All Categories

**Purpose**: Enumerate all active merchandise departments to confirm categorical standardization.

```sql
SELECT DISTINCT 
    Category
FROM sales
ORDER BY Category ASC;
```

**Actual Result**:

| Category |
| :--- |
| Furniture |
| Office Supplies |
| Technology |

*Business Context*: Confirms that casing normalization successfully collapsed the 5 raw categories into the **3 intended departments** (`Furniture`, `Office Supplies`, `Technology`).

---

### Query 10: List All Regions

**Purpose**: Enumerate all operational geographic territories to confirm regional standardization.

```sql
SELECT DISTINCT 
    Region
FROM sales
ORDER BY Region ASC;
```

**Actual Result**:

| Region |
| :--- |
| East |
| North |
| South |
| West |

*Business Context*: Confirms that regional normalization successfully unified the 8 raw values into the **4 standard Indian zones** (`East`, `North`, `South`, `West`).

---

### Query 11: Count Orders by Category

**Purpose**: Evaluate merchandise department order volume and percentage distribution.

```sql
SELECT 
    Category,
    COUNT(*) AS order_count,
    ROUND(COUNT(*) * 100.0 / 5000, 2) AS percentage_of_total_orders
FROM sales
GROUP BY Category
ORDER BY order_count DESC;
```

**Actual Result**:

| Category | order_count | percentage_of_total_orders |
| :--- | :---: | :---: |
| **Technology** | 1,890 | 37.80% |
| **Office Supplies** | 1,776 | 35.52% |
| **Furniture** | 1,334 | 26.68% |
| **Total** | **5,000** | **100.00%** |

*Business Context*: 
- **Technology** leads order volume with **37.80%** (1,890 orders).
- **Office Supplies** closely follows with **35.52%** (1,776 orders).
- **Furniture** constitutes the remaining **26.68%** (1,334 orders).

---

### Query 12: Count Orders by Region

**Purpose**: Evaluate geographical territory order distribution to identify leading demand hubs.

```sql
SELECT 
    Region,
    COUNT(*) AS order_count,
    ROUND(COUNT(*) * 100.0 / 5000, 2) AS percentage_of_total_orders
FROM sales
GROUP BY Region
ORDER BY order_count DESC;
```

**Actual Result**:

| Region | order_count | percentage_of_total_orders |
| :--- | :---: | :---: |
| **West** | 1,591 | 31.82% |
| **South** | 1,237 | 24.74% |
| **North** | 1,209 | 24.18% |
| **East** | 963 | 19.26% |
| **Total** | **5,000** | **100.00%** |

*Business Context*:
- **West** is the dominant region, driving **31.82%** of all orders (1,591 orders across Ahmedabad, Surat, Rajkot, and Vadodara).
- **South** (24.74%) and **North** (24.18%) contribute nearly equal shares (~1,200 orders each).
- **East** accounts for **19.26%** (963 orders across Kolkata, Patna, Guwahati, and Bhubaneswar).

---

## Verification & File Manifest

All assets for the SQL Analysis Phase are organized and ready:

1. **SQLite Database**: [`sql/sales_analysis.db`](file:///d:/Gravity%20Projects/sql/sales_analysis.db) (Contains `sales` table with 5,000 validated rows)
2. **Database Setup Script**: [`sql/01_database_setup.sql`](file:///d:/Gravity%20Projects/sql/01_database_setup.sql) (DDL, loading documentation, validation queries)
3. **Exploratory Analysis Script**: [`sql/02_basic_analysis.sql`](file:///d:/Gravity%20Projects/sql/02_basic_analysis.sql) (12 formatted business queries with explanatory comments)
4. **Analysis Results Document**: [`sql/02_basic_analysis_results.md`](file:///d:/Gravity%20Projects/sql/02_basic_analysis_results.md) (This document, recording exact empirical outputs)

---
*All queries executed and results verified against SQLite 3 via Python standard library connector.*
