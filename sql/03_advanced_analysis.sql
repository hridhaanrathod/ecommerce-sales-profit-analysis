-- ============================================================================
-- PROJECT: Retail Sales Analysis - Portfolio Project
-- PHASE: Advanced SQL Business Analysis
-- FILE: sql/03_advanced_analysis.sql
-- DATABASE ENGINE: SQLite 3 (v3.25+ with Window Functions & CTEs)
-- DATABASE: sql/sales_analysis.db
-- TABLE: sales (5,000 clean records)
-- ============================================================================
-- Description:
--   This script executes comprehensive, production-grade business analysis
--   queries demonstrating advanced SQL capabilities:
--     * Aggregations with GROUP BY and HAVING
--     * Conditional Logic with CASE expressions
--     * Scalar & Correlated Subqueries
--     * Common Table Expressions (CTEs)
--     * Relational Joins (INNER JOIN & LEFT JOIN with COALESCE)
--     * Analytical Window Functions (RANK, DENSE_RANK, LAG, PARTITION BY)
-- ============================================================================


-- ----------------------------------------------------------------------------
-- QUERY 1: Category-Wise Total Sales, Profit, and Quantity
-- Business Question: What is the overall commercial contribution (revenue, profit,
--                    volume, and profit margin) of each product category?
-- Technique: GROUP BY, SUM(), ROUND(), Mathematical Margin Calculation
-- ----------------------------------------------------------------------------
SELECT 
    Category,
    COUNT(Order_ID) AS total_orders,
    SUM(Quantity) AS total_units_sold,
    ROUND(SUM(Sales), 2) AS total_sales_inr,
    ROUND(SUM(Profit), 2) AS total_profit_inr,
    ROUND(SUM(Profit) * 100.0 / SUM(Sales), 2) AS profit_margin_pct
FROM sales
GROUP BY Category
ORDER BY total_sales_inr DESC;


-- ----------------------------------------------------------------------------
-- QUERY 2: Region-Wise Sales and Profit Performance
-- Business Question: Which geographic regions generate the highest sales volume
--                    and profitability across India?
-- Technique: GROUP BY, SUM(), ROUND(), ORDER BY
-- ----------------------------------------------------------------------------
SELECT 
    Region,
    COUNT(Order_ID) AS total_orders,
    SUM(Quantity) AS total_units_sold,
    ROUND(SUM(Sales), 2) AS total_sales_inr,
    ROUND(SUM(Profit), 2) AS total_profit_inr,
    ROUND(SUM(Profit) * 100.0 / SUM(Sales), 2) AS profit_margin_pct
FROM sales
GROUP BY Region
ORDER BY total_sales_inr DESC;


-- ----------------------------------------------------------------------------
-- QUERY 3: Highest-Selling Categories and Regions (Ranking via Window Functions)
-- Business Question: How do product categories and geographic territories rank
--                    in terms of top-line gross revenue generation?
-- Technique: CTE, Window Function RANK() OVER (ORDER BY ... DESC), UNION ALL
-- ----------------------------------------------------------------------------
WITH Category_Sales_Rank AS (
    SELECT 
        'Category' AS dimension_type,
        Category AS dimension_value,
        ROUND(SUM(Sales), 2) AS total_sales_inr,
        RANK() OVER (ORDER BY SUM(Sales) DESC) AS sales_rank
    FROM sales
    GROUP BY Category
),
Region_Sales_Rank AS (
    SELECT 
        'Region' AS dimension_type,
        Region AS dimension_value,
        ROUND(SUM(Sales), 2) AS total_sales_inr,
        RANK() OVER (ORDER BY SUM(Sales) DESC) AS sales_rank
    FROM sales
    GROUP BY Region
)
SELECT * FROM Category_Sales_Rank
UNION ALL
SELECT * FROM Region_Sales_Rank;


-- ----------------------------------------------------------------------------
-- QUERY 4: Most Profitable Categories and Regions
-- Business Question: Which categories and regions deliver the highest net profit
--                    and superior profit margins?
-- Technique: CTE, Window Functions RANK(), Margin Comparison
-- ----------------------------------------------------------------------------
WITH Category_Profit_Rank AS (
    SELECT 
        'Category' AS dimension_type,
        Category AS dimension_value,
        ROUND(SUM(Profit), 2) AS total_profit_inr,
        ROUND(SUM(Profit) * 100.0 / SUM(Sales), 2) AS profit_margin_pct,
        RANK() OVER (ORDER BY SUM(Profit) DESC) AS profit_rank
    FROM sales
    GROUP BY Category
),
Region_Profit_Rank AS (
    SELECT 
        'Region' AS dimension_type,
        Region AS dimension_value,
        ROUND(SUM(Profit), 2) AS total_profit_inr,
        ROUND(SUM(Profit) * 100.0 / SUM(Sales), 2) AS profit_margin_pct,
        RANK() OVER (ORDER BY SUM(Profit) DESC) AS profit_rank
    FROM sales
    GROUP BY Region
)
SELECT * FROM Category_Profit_Rank
UNION ALL
SELECT * FROM Region_Profit_Rank;


-- ----------------------------------------------------------------------------
-- QUERY 5: Orders Above Overall Average Sales (Scalar Subquery)
-- Business Question: How many orders exceed the store-wide average order value
--                    (₹27,388.87), and what is their collective profile?
-- Technique: Scalar Subquery in WHERE clause
-- ----------------------------------------------------------------------------
SELECT 
    COUNT(*) AS high_value_order_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM sales), 2) AS pct_of_total_orders,
    ROUND(SUM(Sales), 2) AS total_high_value_sales_inr,
    ROUND(AVG(Sales), 2) AS avg_high_value_sales_inr,
    (SELECT ROUND(AVG(Sales), 2) FROM sales) AS store_wide_avg_sales_inr
FROM sales
WHERE Sales > (SELECT AVG(Sales) FROM sales);


-- ----------------------------------------------------------------------------
-- QUERY 6A: Orders Above Category-Level Average Sales (Correlated Subquery)
-- Business Question: Which individual orders outperformed the average sales
--                    benchmark of their own specific product category?
-- Technique: Correlated Subquery (Evaluated per row against outer table)
-- ----------------------------------------------------------------------------
SELECT 
    s1.Order_ID,
    s1.Order_Date,
    s1.Customer,
    s1.Category,
    s1.Product,
    s1.Sales AS order_sales_inr,
    ROUND((SELECT AVG(s2.Sales) FROM sales s2 WHERE s2.Category = s1.Category), 2) AS category_avg_sales_inr,
    ROUND(s1.Sales - (SELECT AVG(s2.Sales) FROM sales s2 WHERE s2.Category = s1.Category), 2) AS excess_above_avg_inr
FROM sales s1
WHERE s1.Sales > (
    SELECT AVG(s2.Sales)
    FROM sales s2
    WHERE s2.Category = s1.Category
)
ORDER BY excess_above_avg_inr DESC
LIMIT 10;


-- ----------------------------------------------------------------------------
-- QUERY 6B: Orders Above Category-Level Average (CTE with INNER JOIN)
-- Business Question: What proportion of orders in each category surpass their
--                    respective category average benchmark?
-- Technique: CTE, INNER JOIN, Aggregation
-- ----------------------------------------------------------------------------
WITH Category_Benchmarks AS (
    SELECT 
        Category,
        COUNT(Order_ID) AS total_category_orders,
        ROUND(AVG(Sales), 2) AS avg_category_sales
    FROM sales
    GROUP BY Category
)
SELECT 
    s.Category,
    cb.total_category_orders,
    cb.avg_category_sales AS category_benchmark_inr,
    COUNT(s.Order_ID) AS orders_above_benchmark,
    ROUND(COUNT(s.Order_ID) * 100.0 / cb.total_category_orders, 2) AS pct_above_benchmark
FROM sales s
INNER JOIN Category_Benchmarks cb ON s.Category = cb.Category
WHERE s.Sales > cb.avg_category_sales
GROUP BY s.Category, cb.total_category_orders, cb.avg_category_sales
ORDER BY orders_above_benchmark DESC;


-- ----------------------------------------------------------------------------
-- QUERY 7: Top 10 Orders by Sales
-- Business Question: What are the top 10 single highest-grossing orders in store
--                    history, and what items were ordered?
-- Technique: ORDER BY Sales DESC, LIMIT 10
-- ----------------------------------------------------------------------------
SELECT 
    Order_ID,
    Order_Date,
    Customer,
    Category,
    Product,
    Region,
    Quantity,
    Discount,
    ROUND(Sales, 2) AS sales_inr,
    ROUND(Profit, 2) AS profit_inr,
    ROUND(Profit * 100.0 / Sales, 2) AS profit_margin_pct
FROM sales
ORDER BY Sales DESC
LIMIT 10;


-- ----------------------------------------------------------------------------
-- QUERY 8: Top 10 Orders by Profit
-- Business Question: What are the top 10 most profitable transactions, and what
--                    margins did they yield?
-- Technique: ORDER BY Profit DESC, LIMIT 10
-- ----------------------------------------------------------------------------
SELECT 
    Order_ID,
    Order_Date,
    Customer,
    Category,
    Product,
    Region,
    Quantity,
    Discount,
    ROUND(Sales, 2) AS sales_inr,
    ROUND(Profit, 2) AS profit_inr,
    ROUND(Profit * 100.0 / Sales, 2) AS profit_margin_pct
FROM sales
ORDER BY Profit DESC
LIMIT 10;


-- ----------------------------------------------------------------------------
-- QUERY 9: Profit Margin by Category with Profitability Tiers (CASE Statement)
-- Business Question: How does profitability margin vary across categories, and
--                    how does each department classify into strategic tiers?
-- Technique: GROUP BY, CASE Expressions, Margin Ratios
-- ----------------------------------------------------------------------------
SELECT 
    Category,
    COUNT(Order_ID) AS total_orders,
    ROUND(SUM(Sales), 2) AS total_sales_inr,
    ROUND(SUM(Profit), 2) AS total_profit_inr,
    ROUND(SUM(Profit) * 100.0 / SUM(Sales), 2) AS profit_margin_pct,
    CASE 
        WHEN SUM(Profit) * 100.0 / SUM(Sales) >= 20.0 THEN 'Tier 1: High Margin (>= 20%)'
        WHEN SUM(Profit) * 100.0 / SUM(Sales) >= 13.0 THEN 'Tier 2: Moderate Margin (13-20%)'
        ELSE 'Tier 3: Volume / Low Margin (< 13%)'
    END AS strategic_tier
FROM sales
GROUP BY Category
ORDER BY profit_margin_pct DESC;


-- ----------------------------------------------------------------------------
-- QUERY 10: Monthly Sales and Profit Trend with MoM Growth (CTE & LAG Function)
-- Business Question: What is the monthly trajectory of sales, profit, and
--                    month-over-month (MoM) revenue growth throughout 2025?
-- Technique: STRFTIME(), CTE, Window Function LAG() OVER ()
-- ----------------------------------------------------------------------------
WITH Monthly_Performance AS (
    SELECT 
        STRFTIME('%Y-%m', Order_Date) AS order_month,
        COUNT(Order_ID) AS total_orders,
        SUM(Quantity) AS total_units_sold,
        ROUND(SUM(Sales), 2) AS monthly_sales_inr,
        ROUND(SUM(Profit), 2) AS monthly_profit_inr,
        ROUND(SUM(Profit) * 100.0 / SUM(Sales), 2) AS monthly_margin_pct
    FROM sales
    GROUP BY STRFTIME('%Y-%m', Order_Date)
)
SELECT 
    order_month,
    total_orders,
    total_units_sold,
    monthly_sales_inr,
    ROUND(monthly_sales_inr - LAG(monthly_sales_inr) OVER (ORDER BY order_month), 2) AS mom_sales_change_inr,
    ROUND((monthly_sales_inr - LAG(monthly_sales_inr) OVER (ORDER BY order_month)) * 100.0 
          / LAG(monthly_sales_inr) OVER (ORDER BY order_month), 2) AS mom_growth_rate_pct,
    monthly_profit_inr,
    monthly_margin_pct
FROM Monthly_Performance
ORDER BY order_month ASC;


-- ----------------------------------------------------------------------------
-- QUERY 11: Sales and Profit by Region and Category (Multi-Dimensional Matrix)
-- Business Question: What is the detailed sales and profit breakdown across
--                    every Region x Category combination?
-- Technique: Multi-Column GROUP BY, Window Function SUM() OVER (PARTITION BY)
-- ----------------------------------------------------------------------------
SELECT 
    Region,
    Category,
    COUNT(Order_ID) AS order_count,
    ROUND(SUM(Sales), 2) AS total_sales_inr,
    ROUND(SUM(Profit), 2) AS total_profit_inr,
    ROUND(SUM(Profit) * 100.0 / SUM(Sales), 2) AS profit_margin_pct,
    ROUND(SUM(Sales) * 100.0 / SUM(SUM(Sales)) OVER (PARTITION BY Region), 2) AS pct_of_region_revenue
FROM sales
GROUP BY Region, Category
ORDER BY Region ASC, total_sales_inr DESC;


-- ----------------------------------------------------------------------------
-- QUERY 12: Customer-Level Sales, Profit, and VIP Segmentation (HAVING & CASE)
-- Business Question: Who are the top 10 most valuable repeat customers by
--                    lifetime spending, and how are customer tiers classified?
-- Technique: GROUP BY, HAVING, CASE, ORDER BY DESC LIMIT 10
-- ----------------------------------------------------------------------------
SELECT 
    Customer,
    COUNT(Order_ID) AS lifetime_orders,
    SUM(Quantity) AS total_units_bought,
    ROUND(SUM(Sales), 2) AS total_spend_inr,
    ROUND(SUM(Profit), 2) AS total_profit_generated_inr,
    ROUND(AVG(Sales), 2) AS avg_order_value_inr,
    CASE 
        WHEN SUM(Sales) >= 1500000 THEN 'Diamond VIP (>= 15L)'
        WHEN SUM(Sales) >= 1000000 THEN 'Platinum VIP (10L - 15L)'
        WHEN SUM(Sales) >= 500000  THEN 'Gold Member (5L - 10L)'
        ELSE 'Silver Member (< 5L)'
    END AS customer_tier
FROM sales
WHERE Customer != 'Unknown'
GROUP BY Customer
HAVING lifetime_orders >= 10
ORDER BY total_spend_inr DESC
LIMIT 10;


-- ----------------------------------------------------------------------------
-- QUERY 13: Identify High-Sales but Low-Profit Orders (Risk / Pricing Audit)
-- Business Question: Which orders generated large gross revenue (above average)
--                    yet yielded thin profit margins (< 10%), indicating discount leakage?
-- Technique: CTE, Multiple Conditional Filtering, Pricing Audit
-- ----------------------------------------------------------------------------
WITH Thresholds AS (
    SELECT 
        AVG(Sales) AS overall_avg_sales,
        SUM(Profit) * 100.0 / SUM(Sales) AS overall_avg_margin
    FROM sales
)
SELECT 
    s.Order_ID,
    s.Order_Date,
    s.Customer,
    s.Category,
    s.Product,
    s.Quantity,
    s.Discount,
    ROUND(s.Sales, 2) AS sales_inr,
    ROUND(s.Profit, 2) AS profit_inr,
    ROUND(s.Profit * 100.0 / s.Sales, 2) AS profit_margin_pct,
    'Margin Compression Risk' AS audit_status
FROM sales s, Thresholds t
WHERE s.Sales > t.overall_avg_sales
  AND (s.Profit * 100.0 / s.Sales) < 10.0
ORDER BY s.Sales DESC
LIMIT 10;


-- ----------------------------------------------------------------------------
-- QUERY 14: Rank Categories within Each Region by Sales (PARTITION BY)
-- Business Question: What is the intra-regional revenue and profit rank of each
--                    category within each respective territory?
-- Technique: CTE, Window Function RANK() OVER (PARTITION BY Region ORDER BY ...)
-- ----------------------------------------------------------------------------
WITH Regional_Category_Totals AS (
    SELECT 
        Region,
        Category,
        ROUND(SUM(Sales), 2) AS total_sales_inr,
        ROUND(SUM(Profit), 2) AS total_profit_inr
    FROM sales
    GROUP BY Region, Category
)
SELECT 
    Region,
    Category,
    total_sales_inr,
    total_profit_inr,
    RANK() OVER (PARTITION BY Region ORDER BY total_sales_inr DESC) AS sales_rank_in_region,
    RANK() OVER (PARTITION BY Region ORDER BY total_profit_inr DESC) AS profit_rank_in_region
FROM Regional_Category_Totals
ORDER BY Region ASC, sales_rank_in_region ASC;


-- ----------------------------------------------------------------------------
-- QUERY 15: Regional Mega-Order Distribution using LEFT JOIN & COALESCE
-- Business Question: How does mega-ticket order volume (>= ₹200,000) compare across
--                    all geographic territories, ensuring no region is omitted?
-- Technique: LEFT JOIN, COALESCE(), Aggregated Subquery
-- ----------------------------------------------------------------------------
WITH All_Regions AS (
    SELECT DISTINCT Region FROM sales
),
Mega_Orders AS (
    SELECT 
        Region,
        COUNT(Order_ID) AS mega_order_count,
        ROUND(SUM(Sales), 2) AS mega_order_sales_inr,
        ROUND(SUM(Profit), 2) AS mega_order_profit_inr
    FROM sales
    WHERE Sales >= 200000.0
    GROUP BY Region
)
SELECT 
    ar.Region,
    COALESCE(mo.mega_order_count, 0) AS orders_above_200k,
    COALESCE(mo.mega_order_sales_inr, 0.0) AS mega_sales_inr,
    COALESCE(mo.mega_order_profit_inr, 0.0) AS mega_profit_inr
FROM All_Regions ar
LEFT JOIN Mega_Orders mo ON ar.Region = mo.Region
ORDER BY orders_above_200k DESC;
