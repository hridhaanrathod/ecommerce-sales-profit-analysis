-- ============================================================================
-- PROJECT: Retail Sales Analysis - Portfolio Project
-- PHASE: Basic Exploratory SQL Analysis
-- FILE: sql/02_basic_analysis.sql
-- DATABASE ENGINE: SQLite 3
-- DATABASE: sql/sales_analysis.db
-- TABLE: sales (5,000 records)
-- ============================================================================
-- Description:
--   This file contains basic exploratory and validation queries designed
--   to inspect the foundational volume, financial totals, and categorical
--   distributions of the store.
--   Advanced SQL constructs (CTEs, Window Functions, Joins) are deferred
--   to subsequent analysis phases.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- QUERY 1: Count total orders
-- Business Question: What is the total volume of orders placed across the full year?
-- ----------------------------------------------------------------------------
SELECT 
    COUNT(Order_ID) AS total_orders
FROM sales;


-- ----------------------------------------------------------------------------
-- QUERY 2: Calculate total sales
-- Business Question: What is the total gross revenue generated from all sales transactions?
-- ----------------------------------------------------------------------------
SELECT 
    ROUND(SUM(Sales), 2) AS total_sales_inr
FROM sales;


-- ----------------------------------------------------------------------------
-- QUERY 3: Calculate total profit
-- Business Question: What is the total net profit earned across all transactions?
-- ----------------------------------------------------------------------------
SELECT 
    ROUND(SUM(Profit), 2) AS total_profit_inr
FROM sales;


-- ----------------------------------------------------------------------------
-- QUERY 4: Calculate total quantity sold
-- Business Question: How many total individual merchandise units were sold?
-- ----------------------------------------------------------------------------
SELECT 
    SUM(Quantity) AS total_units_sold
FROM sales;


-- ----------------------------------------------------------------------------
-- QUERY 5: Calculate average sales per order
-- Business Question: What is the Average Order Value (AOV) per transaction?
-- ----------------------------------------------------------------------------
SELECT 
    ROUND(AVG(Sales), 2) AS avg_sales_per_order_inr
FROM sales;


-- ----------------------------------------------------------------------------
-- QUERY 6: Find minimum and maximum sales
-- Business Question: What is the range of transaction values (lowest vs. highest order revenue)?
-- ----------------------------------------------------------------------------
SELECT 
    MIN(Sales) AS min_order_sales_inr,
    MAX(Sales) AS max_order_sales_inr
FROM sales;


-- ----------------------------------------------------------------------------
-- QUERY 7: Find minimum and maximum profit
-- Business Question: What are the minimum and maximum profit margins earned on an individual order?
-- ----------------------------------------------------------------------------
SELECT 
    MIN(Profit) AS min_order_profit_inr,
    MAX(Profit) AS max_order_profit_inr
FROM sales;


-- ----------------------------------------------------------------------------
-- QUERY 8: Count unique customers
-- Business Question: How many distinct customer profiles are represented in the dataset?
-- ----------------------------------------------------------------------------
SELECT 
    COUNT(DISTINCT Customer) AS total_unique_customer_profiles,
    COUNT(DISTINCT CASE WHEN Customer != 'Unknown' THEN Customer END) AS known_named_customers,
    COUNT(CASE WHEN Customer = 'Unknown' THEN 1 END) AS orders_with_unknown_customer
FROM sales;


-- ----------------------------------------------------------------------------
-- QUERY 9: List all categories
-- Business Question: What product departments/categories does the business offer?
-- ----------------------------------------------------------------------------
SELECT DISTINCT 
    Category
FROM sales
ORDER BY Category ASC;


-- ----------------------------------------------------------------------------
-- QUERY 10: List all regions
-- Business Question: What geographic sales regions does the company serve?
-- ----------------------------------------------------------------------------
SELECT DISTINCT 
    Region
FROM sales
ORDER BY Region ASC;


-- ----------------------------------------------------------------------------
-- QUERY 11: Count orders by category
-- Business Question: How are customer purchases distributed across the 3 product departments?
-- ----------------------------------------------------------------------------
SELECT 
    Category,
    COUNT(*) AS order_count,
    ROUND(COUNT(*) * 100.0 / 5000, 2) AS percentage_of_total_orders
FROM sales
GROUP BY Category
ORDER BY order_count DESC;


-- ----------------------------------------------------------------------------
-- QUERY 12: Count orders by region
-- Business Question: Which geographic territory drives the highest order transaction volume?
-- ----------------------------------------------------------------------------
SELECT 
    Region,
    COUNT(*) AS order_count,
    ROUND(COUNT(*) * 100.0 / 5000, 2) AS percentage_of_total_orders
FROM sales
GROUP BY Region
ORDER BY order_count DESC;
