-- ============================================================================
-- PROJECT: Retail Sales Analysis - Portfolio Project
-- PHASE: SQL Database Setup & Data Ingestion
-- FILE: sql/01_database_setup.sql
-- DATABASE ENGINE: SQLite 3
-- TARGET DATABASE: sql/sales_analysis.db
-- SOURCE DATA: data/sales_analysis_cleaned.csv (5,000 sanitized records)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. TABLE CREATION DDL (DATA DEFINITION LANGUAGE)
-- ----------------------------------------------------------------------------
-- Create the main 'sales' table with appropriate SQLite data types and constraints.
-- Order_ID is defined as TEXT PRIMARY KEY to enforce entity uniqueness.
-- Order_Date is stored in ISO-8601 string format (YYYY-MM-DD), the standard for SQLite date functions.
-- Quantitative fields are defined as INTEGER and REAL.

DROP TABLE IF EXISTS sales;

CREATE TABLE sales (
    Order_ID    TEXT PRIMARY KEY,
    Order_Date  TEXT NOT NULL,
    Customer    TEXT NOT NULL,
    Category    TEXT NOT NULL,
    Product     TEXT NOT NULL,
    Region      TEXT NOT NULL,
    City        TEXT NOT NULL,
    Quantity    INTEGER NOT NULL CHECK(Quantity >= 1),
    Discount    REAL NOT NULL CHECK(Discount >= 0.0 AND Discount <= 1.0),
    Sales       REAL NOT NULL CHECK(Sales > 0.0),
    Profit      REAL NOT NULL CHECK(Profit > 0.0)
);

-- Indexing for accelerated analytical queries
CREATE INDEX IF NOT EXISTS idx_sales_order_date ON sales(Order_Date);
CREATE INDEX IF NOT EXISTS idx_sales_category   ON sales(Category);
CREATE INDEX IF NOT EXISTS idx_sales_region     ON sales(Region);
CREATE INDEX IF NOT EXISTS idx_sales_customer   ON sales(Customer);

-- ----------------------------------------------------------------------------
-- 2. DATA LOADING APPROACH & INSTRUCTIONS
-- ----------------------------------------------------------------------------
/*
 APPROACH A: Using Python (Automated & Recommended)
 --------------------------------------------------
 Python's built-in sqlite3 and pandas libraries handle CSV loading into the schema:

    import sqlite3
    import pandas as pd

    conn = sqlite3.connect('sql/sales_analysis.db')
    df = pd.read_csv('data/sales_analysis_cleaned.csv')
    df.to_sql('sales', conn, if_exists='append', index=False)
    conn.commit()
    conn.close()

 APPROACH B: Using the SQLite Command Line Interface (CLI)
 ---------------------------------------------------------
 Execute the following shell commands in sqlite3 CLI:

    sqlite3 sql/sales_analysis.db
    sqlite> .mode csv
    sqlite> .import --skip 1 data/sales_analysis_cleaned.csv sales
*/

-- ----------------------------------------------------------------------------
-- 3. POST-INGESTION VALIDATION QUERIES
-- ----------------------------------------------------------------------------

-- Validation Check 1: Total Row Count (Must equal exactly 5,000)
SELECT 
    COUNT(*) AS total_rows,
    CASE WHEN COUNT(*) = 5000 THEN 'PASS' ELSE 'FAIL' END AS validation_status
FROM sales;

-- Validation Check 2: Unique Order_ID Count (Must equal exactly 5,000)
SELECT 
    COUNT(DISTINCT Order_ID) AS unique_order_ids,
    CASE WHEN COUNT(DISTINCT Order_ID) = 5000 THEN 'PASS' ELSE 'FAIL' END AS validation_status
FROM sales;

-- Validation Check 3: Duplicate Order_ID Count (Must equal 0)
SELECT 
    Order_ID, 
    COUNT(*) AS occurrence_count
FROM sales
GROUP BY Order_ID
HAVING COUNT(*) > 1;

-- Validation Check 4: Audit for Unexpected NULL Values Across All Columns (Must equal 0)
SELECT 
    COUNT(*) AS null_violation_count,
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS validation_status
FROM sales
WHERE Order_ID IS NULL
   OR Order_Date IS NULL
   OR Customer IS NULL
   OR Category IS NULL
   OR Product IS NULL
   OR Region IS NULL
   OR City IS NULL
   OR Quantity IS NULL
   OR Discount IS NULL
   OR Sales IS NULL
   OR Profit IS NULL;

-- Validation Check 5: Range & Non-Negativity Sanity Checks (Must equal 0 violations)
SELECT 
    COUNT(*) AS out_of_bounds_count
FROM sales
WHERE Quantity < 1
   OR Discount < 0.0 OR Discount > 0.30
   OR Sales <= 0.0
   OR Profit <= 0.0
   OR Profit > Sales;
