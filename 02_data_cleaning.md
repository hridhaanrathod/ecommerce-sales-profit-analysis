# Phase 2: Data Cleaning & Preprocessing Report

**Project**: Retail Sales & Profitability Analysis (Data Analyst Portfolio Project)  
**Input Raw Dataset**: `sales_analysis_raw.csv` (Preserved Intact — Hash Verified)  
**Output Cleaned Dataset**: [`data/sales_analysis_cleaned.csv`](file:///d:/Gravity%20Projects/data/sales_analysis_cleaned.csv)  
**Script Executed**: [`python/02_data_cleaning.py`](file:///d:/Gravity%20Projects/python/02_data_cleaning.py)  
**Phase**: Step 02 — Data Cleaning & Validation  
**Status**: Completed  

---

## Executive Summary

Following the diagnostic audit conducted in **Step 01 (Data Understanding)**, the **Step 02 Data Cleaning Pipeline** was designed and executed. 

The primary objective of this phase is to resolve all identified structural defects, casing inconsistencies, missing value issues, and datatype misalignments while strictly adhering to data governance rules:
- **The raw dataset `sales_analysis_raw.csv` remains 100% untouched and unchanged.**
- **No records were removed except the 10 exact duplicate rows identified in Step 1.**
- **Zero data fabrication**: Missing customer identities and city locations were not guessed; they were preserved and explicitly labeled as `'Unknown'`.
- **All financial and transactional values (`Sales`, `Profit`, `Quantity`, `Discount`) remain completely unaltered.**
- The cleaned, sanitized dataset has been exported to [`data/sales_analysis_cleaned.csv`](file:///d:/Gravity%20Projects/data/sales_analysis_cleaned.csv).

---

## 1. Before vs. After Validation Audit

| Metric | Before (Raw) | After (Cleaned) | Status / Action Taken |
| :--- | :---: | :---: | :--- |
| **Total Rows** | 5,010 | **5,000** | Dropped 10 exact duplicate rows; 5,000 unique orders retained |
| **Total Columns** | 11 | **11** | Schema structure fully preserved |
| **Duplicate Rows** | 10 | **0** | Verified 0 duplicate rows remaining |
| **Unique Order_IDs** | 5,000 | **5,000** | Primary key is 100% unique; 1:1 row correspondence |
| **Order_Date Data Type** | `object` (string) | **`datetime64[ns]`** | Converted to datetime; unlocks time-series capabilities |
| **Invalid Dates** | 0 | **0** | All 5,000 dates successfully parsed to ISO format |
| **Missing Customer Entries** | 20 (0.40%) | **0 nulls (20 `'Unknown'`)** | Imputed with `'Unknown'`; zero fabricated names |
| **Missing City Entries** | 15 (0.30%) | **0 nulls (15 `'Unknown'`)** | Imputed with `'Unknown'`; zero geographic speculation |
| **Category Unique Values** | 5 raw | **3** | Normalized lowercase `furniture` & `technology` to Title Case |
| **Region Unique Values** | 8 raw | **4** | Normalized uppercase `EAST`, `WEST`, `NORTH`, `SOUTH` to Title Case |
| **Text Whitespace Issues** | Checked | **0** | Stripped all leading/trailing whitespace across all text columns |
| **Invalid Numeric Values** | 0 | **0** | Verified `Quantity >= 1`, `0 <= Discount <= 0.30`, `Sales > 0`, `Profit > 0` |

---

## 2. Step-by-Step Cleaning Implementation

### Task 1: Load Raw Data
- **Action**: Loaded `sales_analysis_raw.csv` using pandas.
- **Verification**: Exact shape confirmed as **5,010 rows × 11 columns**.
- **Governance**: A decoupled working copy was created in memory; the original CSV on disk was never written to.

### Task 2: Remove Exact Duplicate Rows
- **Problem**: 10 duplicate rows were appended at the end of the raw CSV (index positions 5000–5009).
- **Action**: Executed `df.drop_duplicates()` in pandas.
- **Verification**:
  - Raw row count: `5,010`
  - Cleaned row count: `5,000`
  - Remaining duplicate rows: `0`
  - Net revenue double-counting eliminated: **₹171,192.48**.

### Task 3: Convert `Order_Date` to Datetime Datatype
- **Problem**: `Order_Date` was stored as a generic `object` (string) in `YYYY-MM-DD` text format.
- **Action**: Converted using `pd.to_datetime(df['Order_Date'], format='%Y-%m-%d', errors='coerce')`.
- **Verification**:
  - Target datatype: `datetime64[ns]`
  - Number of failed / invalid date parses: **0**
  - Verified temporal boundary: **2025-01-01** to **2025-12-31** (365 calendar days).

### Task 4: Standardize `Category` Capitalization
- **Problem**: Inconsistent lowercase entries artificially fragmented category aggregations:
  - `furniture`: 5 rows (`ORD00450`, `ORD01137`, `ORD01531`, `ORD01647`, `ORD02202`)
  - `technology`: 1 row (`ORD04831`)
- **Action**: Applied mapping dictionary:
  ```python
  category_mapping = {"furniture": "Furniture", "technology": "Technology"}
  df["Category"] = df["Category"].replace(category_mapping)
```
- **Verification**:
  - Final unique categories: Exactly **3** (`Technology`, `Office Supplies`, `Furniture`).
  - Breakdown:
    - **Technology**: 1,890 orders (37.80%)
    - **Office Supplies**: 1,776 orders (35.52%)
    - **Furniture**: 1,334 orders (26.68%)

### Task 5: Standardize `Region` Capitalization
- **Problem**: Inconsistent uppercase entries fragmented regional aggregations:
  - `EAST`: 2 rows (`ORD01111`, `ORD03163`)
  - `WEST`: 2 rows (`ORD02117`, `ORD02190`)
  - `NORTH`: 1 row (`ORD00887`)
  - `SOUTH`: 1 row (`ORD04478`)
- **Action**: Applied mapping dictionary:
  ```python
  region_mapping = {
      "EAST": "East",
      "WEST": "West",
      "NORTH": "North",
      "SOUTH": "South",
  }
  df["Region"] = df["Region"].replace(region_mapping)
```
- **Verification**:
  - Final unique regions: Exactly **4** (`West`, `South`, `North`, `East`).
  - Breakdown:
    - **West**: 1,591 orders (31.82%)
    - **South**: 1,237 orders (24.74%)
    - **North**: 1,209 orders (24.18%)
    - **East**: 963 orders (19.26%)

### Task 6: Handle Missing `Customer` Values
- **Problem**: 20 transactions had blank / `NaN` customer names.
- **Decision & Analytical Justification**:
  - *Option Rejected*: Deleting the 20 rows would discard valid commercial revenue (₹704,815.34 in valid sales) and distort product demand statistics.
  - *Option Rejected*: Fabricating or randomly assigning names from other customers violates data integrity and creates false customer loyalty metrics.
  - *Selected Approach*: Imputed with `'Unknown'` via `df['Customer'].fillna('Unknown')`.
  - *Interview Talking Point*: Treating unidentifiable customers as a distinct `'Unknown'` cohort preserves 100% of revenue and order volume while clearly indicating to stakeholders that these guest/unregistered transactions require separate customer-level filtering.
- **Verification**:
  - Missing count after treatment: **0**
  - Records tagged `'Unknown'`: Exactly **20** rows.

### Task 7: Handle Missing `City` Values
- **Problem**: 15 transactions had blank / `NaN` delivery city names.
- **Decision & Analytical Justification**:
  - *Investigation*: Step 1 revealed that customers purchase across an average of 12.6 different cities, meaning customer identity cannot reliably predict order destination. Furthermore, each region encompasses 4 separate cities.
  - *Selected Approach*: Imputed with `'Unknown'` via `df['City'].fillna('Unknown')`.
  - *Interview Talking Point*: Since the `Region` field is 100% populated for all 15 orders, regional performance metrics remain accurate. Imputing `'Unknown'` avoids geographic speculation while preventing visualization tools from dropping rows.
- **Verification**:
  - Missing count after treatment: **0**
  - Records tagged `'Unknown'`: Exactly **15** rows.

### Task 8: Clean Text Fields
- **Action**: Applied `.astype(str).str.strip()` across all string attributes (`Customer`, `Category`, `Product`, `Region`, `City`).
- **Verification**:
  - Checked for whitespace anomalies: **0** leading/trailing spaces remaining.
  - Checked for accidental empty strings (`""`): **0** found.
  - Verified legitimate names and products remain intact without truncation.

### Task 9: Validate Numeric Columns
- **Verification Assertions Executed**:
  1. `Quantity >= 1`: **PASS** (Min: 1 unit, Max: 10 units).
  2. `0.00 <= Discount <= 0.30`: **PASS** (Min: 0.00, Max: 0.30).
  3. `Sales > 0`: **PASS** (Min: ₹81.42, Max: ₹512,064.81).
  4. `Profit > 0`: **PASS** (Min: ₹15.95, Max: ₹65,734.45).
  5. `Profit <= Sales`: **PASS** (No transaction exhibits profit exceeding gross sales).
- **Rule Enforced**: No numeric adjustments or transformations were applied to valid business data.

### Task 10: Validate `Order_ID` Primary Key
- **Integrity Checks**:
  - Total `Order_ID` rows: **5,000**
  - Total unique `Order_ID` values: **5,000**
  - Duplicate `Order_ID` count: **0**
- **Verification**: Every order is uniquely identifiable with 100% relational integrity.

---

## 3. Final Schema & Metadata Profile

### Final Column Inventory

| # | Column Name | Final Datatype in Pandas | Non-Null Count | Missing Count | Data Integrity Status |
| :-: | :--- | :--- | :-: | :-: | :--- |
| 1 | `Order_ID` | `object` (string) | 5,000 | **0** | Clean, 100% unique primary key |
| 2 | `Order_Date` | `datetime64[ns]` | 5,000 | **0** | Valid ISO dates (2025-01-01 to 2025-12-31) |
| 3 | `Customer` | `object` (string) | 5,000 | **0** | 192 legitimate names + 20 `'Unknown'` |
| 4 | `Category` | `object` (string) | 5,000 | **0** | Standardized into 3 Title Case departments |
| 5 | `Product` | `object` (string) | 5,000 | **0** | Standardized 14 retail products |
| 6 | `Region` | `object` (string) | 5,000 | **0** | Standardized into 4 Title Case zones |
| 7 | `City` | `object` (string) | 5,000 | **0** | 16 tier-1/2 Indian cities + 15 `'Unknown'` |
| 8 | `Quantity` | `int64` | 5,000 | **0** | Range: 1 to 10 units |
| 9 | `Discount` | `float64` | 5,000 | **0** | Range: 0.00 to 0.30 |
| 10 | `Sales` | `float64` | 5,000 | **0** | Range: ₹81.42 to ₹512,064.81 |
| 11 | `Profit` | `float64` | 5,000 | **0** | Range: ₹15.95 to ₹65,734.45 |

---

## 4. Final Categorical & Numerical Distributions

### A. Categories (3 Final Unique)
| Category | Order Count | Total Revenue (₹) | Total Profit (₹) | Avg Profit Margin |
| :--- | :-: | :-: | :-: | :-: |
| **Technology** | 1,890 (37.80%) | ₹82,863,613.62 | ₹10,859,712.98 | 18.89% |
| **Office Supplies** | 1,776 (35.52%) | ₹2,551,607.39 | ₹614,037.19 | 24.16% |
| **Furniture** | 1,334 (26.68%) | ₹51,202,367.63 | ₹6,281,424.13 | 11.89% |
| **Total** | **5,000** | **₹136,617,588.64** | **₹17,755,174.30** | **18.89% (Overall)** |

### B. Regions (4 Final Unique)
| Region | Order Count | Percentage | Cities Included |
| :--- | :-: | :-: | :--- |
| **West** | 1,591 | 31.82% | Ahmedabad, Rajkot, Surat, Vadodara |
| **South** | 1,237 | 24.74% | Bengaluru, Chennai, Hyderabad, Kochi |
| **North** | 1,209 | 24.18% | Chandigarh, Delhi, Jaipur, Lucknow |
| **East** | 963 | 19.26% | Bhubaneswar, Guwahati, Kolkata, Patna |
| **Total** | **5,000** | **100.00%** | **16 cities across 4 geographic regions** |

### C. Numeric Summary Statistics (Cleaned 5,000 Records)
| Metric | Quantity | Discount | Sales (INR ₹) | Profit (INR ₹) |
| :--- | :-: | :-: | :-: | :-: |
| **Minimum** | 1.00 | 0.00 (0%) | ₹81.42 | ₹15.95 |
| **25th Percentile (Q1)** | 1.00 | 0.00 (0%) | ₹844.02 | ₹211.71 |
| **Median (50%)** | 2.00 | 0.10 (10%) | ₹6,378.46 | ₹1,078.43 |
| **Mean** | 3.13 | 0.0863 (8.63%) | ₹27,323.52 | ₹3,551.03 |
| **75th Percentile (Q3)** | 4.00 | 0.15 (15%) | ₹32,156.41 | ₹4,291.60 |
| **Maximum** | 10.00 | 0.30 (30%) | ₹512,064.81 | ₹65,734.45 |
| **Standard Deviation** | 2.24 | 0.0755 | ₹51,230.13 | ₹6,316.58 |

---

## 5. Artifact Delivery & Cleaned File Path

The cleaned dataset is ready for downstream analytical modules (feature engineering, exploratory data analysis, dashboard building, and business modeling):

- **Cleaned File Location**: [`d:\Gravity Projects\data\sales_analysis_cleaned.csv`](file:///d:/Gravity%20Projects/data/sales_analysis_cleaned.csv)
- **Record Count**: Exactly 5,000 rows, 11 columns
- **Original Raw File**: [`d:\Gravity Projects\sales_analysis_raw.csv`](file:///d:/Gravity%20Projects/sales_analysis_raw.csv) (Completely preserved and unchanged)

---
*Report generated and validated via automated pipeline `python/02_data_cleaning.py`.*
