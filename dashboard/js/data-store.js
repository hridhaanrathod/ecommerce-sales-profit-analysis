/**
 * ============================================================================
 * E-COMMERCE SALES & PROFIT ANALYSIS - DATA STORE
 * File: dashboard/js/data-store.js
 * ============================================================================
 * Description:
 *   Handles client-side CSV ingestion via PapaParse, maintains the in-memory
 *   relational store, applies multi-criteria cross-filtering, and computes
 *   dynamic KPIs, statistical distributions, category/region breakdowns,
 *   customer segments, and what-if simulation metrics.
 * ============================================================================
 */

const DataStore = (() => {
  // Private store state
  let rawData = [];
  let filteredData = [];
  let isLoaded = false;

  // Active filter criteria
  const activeFilters = {
    dateRange: "all",    // 'all' | 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'YYYY-MM'
    region: "all",       // 'all' | 'West' | 'South' | 'North' | 'East'
    category: "all"      // 'all' | 'Technology' | 'Furniture' | 'Office Supplies'
  };

  const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /**
   * Initializes and loads the dataset using PapaParse.
   * Fetches over HTTP/HTTPS with fallback paths, or falls back to EMBEDDED_CSV_DATA
   * when executed under the file:// protocol or offline.
   */
  async function init(onSuccess, onError) {
    let csvText = null;

    // 1. Attempt dynamic HTTP fetch if on http/https protocol
    if (typeof window !== "undefined" && (window.location.protocol === "http:" || window.location.protocol === "https:")) {
      const candidatePaths = [
        "data/sales_analysis_cleaned.csv",
        "./data/sales_analysis_cleaned.csv",
        "../data/sales_analysis_cleaned.csv",
        "dashboard/data/sales_analysis_cleaned.csv",
        "/dashboard/data/sales_analysis_cleaned.csv"
      ];

      for (const path of candidatePaths) {
        try {
          const response = await fetch(path);
          if (response.ok) {
            const text = await response.text();
            if (text && text.trim().length > 0 && text.includes("Order_ID")) {
              csvText = text;
              console.log(`[DataStore] Successfully loaded CSV from: ${path}`);
              break;
            }
          }
        } catch (e) {
          // Continue to next candidate path
        }
      }
    }

    // 2. Fallback to embedded CSV dataset (for file:/// protocol, offline, or CORS-restricted environments)
    if (!csvText && typeof window !== "undefined" && window.EMBEDDED_CSV_DATA) {
      console.log("[DataStore] Ingesting CSV from embedded dataset fallback");
      csvText = window.EMBEDDED_CSV_DATA;
    }

    // 3. Parse with PapaParse synchronously
    if (csvText && typeof Papa !== "undefined") {
      try {
        const results = Papa.parse(csvText.trim(), {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true
        });

        if (results && results.data && results.data.length > 0) {
          processRawData(results.data);
          isLoaded = true;
          console.log(`[DataStore] Parsed ${rawData.length} rows successfully.`);
          if (onSuccess) onSuccess();
          return;
        } else {
          console.error("[DataStore] PapaParse returned 0 valid rows:", results.errors);
        }
      } catch (err) {
        console.error("[DataStore] PapaParse parsing error:", err);
      }
    }

    // 4. Handle failure
    isLoaded = false;
    if (onError) {
      onError("Could not load sales_analysis_cleaned.csv. Please ensure data file is accessible.");
    }
  }

  /**
   * Cleans, formats, and casts data types into memory.
   */
  function processRawData(data) {
    rawData = data.map((row) => {
      const sales = parseFloat(row.Sales) || 0.0;
      const profit = parseFloat(row.Profit) || 0.0;
      const quantity = parseInt(row.Quantity, 10) || 1;
      const discount = parseFloat(row.Discount) || 0.0;
      const dateParts = String(row.Order_Date).split("-");
      const year = parseInt(dateParts[0], 10) || 2025;
      const monthNum = parseInt(dateParts[1], 10) || 1;
      const dayNum = parseInt(dateParts[2], 10) || 1;

      // Assign quarter
      let quarter = "Q1";
      if (monthNum >= 4 && monthNum <= 6) quarter = "Q2";
      else if (monthNum >= 7 && monthNum <= 9) quarter = "Q3";
      else if (monthNum >= 10 && monthNum <= 12) quarter = "Q4";

      const monthName = MONTH_NAMES[monthNum - 1] || "Jan";
      const marginPct = sales > 0 ? (profit / sales) * 100 : 0.0;

      return {
        Order_ID: String(row.Order_ID || "").trim(),
        Order_Date: String(row.Order_Date || "").trim(),
        Year: year,
        Month_Num: monthNum,
        Month_Name: monthName,
        Year_Month: `${year}-${String(monthNum).padStart(2, "0")}`,
        Quarter: quarter,
        Customer: String(row.Customer || "Unknown").trim(),
        Category: String(row.Category || "").trim(),
        Product: String(row.Product || "").trim(),
        Region: String(row.Region || "").trim(),
        City: String(row.City || "Unknown").trim(),
        Quantity: quantity,
        Discount: discount,
        Sales: sales,
        Profit: profit,
        Profit_Margin: marginPct
      };
    });

    isLoaded = true;
    applyFilters();
  }

  /**
   * Updates filter state and recalculates filtered data.
   */
  function setFilter(filterType, value) {
    if (activeFilters.hasOwnProperty(filterType)) {
      activeFilters[filterType] = value;
      applyFilters();
    }
  }

  function resetFilters() {
    activeFilters.dateRange = "all";
    activeFilters.region = "all";
    activeFilters.category = "all";
    applyFilters();
  }

  function getActiveFilters() {
    return { ...activeFilters };
  }

  function applyFilters() {
    filteredData = rawData.filter((row) => {
      // 1. Date Range
      if (activeFilters.dateRange !== "all") {
        if (activeFilters.dateRange.startsWith("Q")) {
          if (row.Quarter !== activeFilters.dateRange) return false;
        } else if (activeFilters.dateRange.includes("-")) {
          if (row.Year_Month !== activeFilters.dateRange) return false;
        }
      }

      // 2. Region
      if (activeFilters.region !== "all" && row.Region !== activeFilters.region) {
        return false;
      }

      // 3. Category
      if (activeFilters.category !== "all" && row.Category !== activeFilters.category) {
        return false;
      }

      return true;
    });
  }

  // =========================================================================
  // ANALYTICAL AGGREGATIONS
  // =========================================================================

  function getOverviewKPIs() {
    const data = filteredData;
    const totalOrders = data.length;
    if (totalOrders === 0) {
      return { totalSales: 0, totalProfit: 0, totalQuantity: 0, totalOrders: 0, aov: 0, profitMargin: 0 };
    }

    const totalSales = data.reduce((acc, r) => acc + r.Sales, 0);
    const totalProfit = data.reduce((acc, r) => acc + r.Profit, 0);
    const totalQuantity = data.reduce((acc, r) => acc + r.Quantity, 0);
    const aov = totalSales / totalOrders;
    const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;

    return {
      totalSales,
      totalProfit,
      totalQuantity,
      totalOrders,
      aov,
      profitMargin
    };
  }

  function getCategoryPerformance() {
    const data = filteredData;
    const catMap = {};
    const totalSalesAll = data.reduce((acc, r) => acc + r.Sales, 0);

    data.forEach((r) => {
      if (!catMap[r.Category]) {
        catMap[r.Category] = { Category: r.Category, Sales: 0, Profit: 0, Quantity: 0, Orders: 0 };
      }
      catMap[r.Category].Sales += r.Sales;
      catMap[r.Category].Profit += r.Profit;
      catMap[r.Category].Quantity += r.Quantity;
      catMap[r.Category].Orders += 1;
    });

    const result = Object.values(catMap).map((c) => ({
      Category: c.Category,
      Total_Sales: c.Sales,
      Total_Profit: c.Profit,
      Total_Quantity: c.Quantity,
      Order_Count: c.Orders,
      Avg_Sales: c.Orders > 0 ? c.Sales / c.Orders : 0,
      Profit_Margin_Pct: c.Sales > 0 ? (c.Profit / c.Sales) * 100 : 0,
      Sales_Share_Pct: totalSalesAll > 0 ? (c.Sales / totalSalesAll) * 100 : 0
    }));

    return result.sort((a, b) => b.Total_Sales - a.Total_Sales);
  }

  function getRegionPerformance() {
    const data = filteredData;
    const regMap = {};
    const totalSalesAll = data.reduce((acc, r) => acc + r.Sales, 0);

    data.forEach((r) => {
      if (!regMap[r.Region]) {
        regMap[r.Region] = { Region: r.Region, Sales: 0, Profit: 0, Quantity: 0, Orders: 0 };
      }
      regMap[r.Region].Sales += r.Sales;
      regMap[r.Region].Profit += r.Profit;
      regMap[r.Region].Quantity += r.Quantity;
      regMap[r.Region].Orders += 1;
    });

    const result = Object.values(regMap).map((c) => ({
      Region: c.Region,
      Total_Sales: c.Sales,
      Total_Profit: c.Profit,
      Total_Quantity: c.Quantity,
      Order_Count: c.Orders,
      Avg_Sales: c.Orders > 0 ? c.Sales / c.Orders : 0,
      Profit_Margin_Pct: c.Sales > 0 ? (c.Profit / c.Sales) * 100 : 0,
      Sales_Share_Pct: totalSalesAll > 0 ? (c.Sales / totalSalesAll) * 100 : 0
    }));

    return result.sort((a, b) => b.Total_Sales - a.Total_Sales);
  }

  function getMonthlyTrend() {
    const data = filteredData;
    const monthMap = {};

    for (let m = 1; m <= 12; m++) {
      monthMap[m] = {
        Month_Num: m,
        Month_Name: MONTH_NAMES[m - 1],
        Sales: 0,
        Profit: 0,
        Quantity: 0,
        Orders: 0
      };
    }

    data.forEach((r) => {
      if (monthMap[r.Month_Num]) {
        monthMap[r.Month_Num].Sales += r.Sales;
        monthMap[r.Month_Num].Profit += r.Profit;
        monthMap[r.Month_Num].Quantity += r.Quantity;
        monthMap[r.Month_Num].Orders += 1;
      }
    });

    const list = Object.values(monthMap).sort((a, b) => a.Month_Num - b.Month_Num);

    // Calculate Margin and MoM Growth
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      item.Profit_Margin_Pct = item.Sales > 0 ? (item.Profit / item.Sales) * 100 : 0;
      if (i > 0 && list[i - 1].Sales > 0) {
        item.MoM_Sales_Growth_Pct = ((item.Sales - list[i - 1].Sales) / list[i - 1].Sales) * 100;
        item.MoM_Sales_Change = item.Sales - list[i - 1].Sales;
      } else {
        item.MoM_Sales_Growth_Pct = 0;
        item.MoM_Sales_Change = 0;
      }
    }

    return list;
  }

  function getProductPerformance() {
    const data = filteredData;
    const prodMap = {};

    data.forEach((r) => {
      if (!prodMap[r.Product]) {
        prodMap[r.Product] = { Product: r.Product, Category: r.Category, Sales: 0, Profit: 0, Quantity: 0, Orders: 0 };
      }
      prodMap[r.Product].Sales += r.Sales;
      prodMap[r.Product].Profit += r.Profit;
      prodMap[r.Product].Quantity += r.Quantity;
      prodMap[r.Product].Orders += 1;
    });

    const list = Object.values(prodMap).map((p) => ({
      ...p,
      Profit_Margin_Pct: p.Sales > 0 ? (p.Profit / p.Sales) * 100 : 0,
      Avg_Price: p.Quantity > 0 ? p.Sales / p.Quantity : 0
    }));

    return {
      all: list,
      bySales: [...list].sort((a, b) => b.Sales - a.Sales),
      byProfit: [...list].sort((a, b) => b.Profit - a.Profit),
      byMargin: [...list].sort((a, b) => b.Profit_Margin_Pct - a.Profit_Margin_Pct)
    };
  }

  function getCustomerAnalysis() {
    const data = filteredData.filter((r) => r.Customer !== "Unknown");
    const custMap = {};

    data.forEach((r) => {
      if (!custMap[r.Customer]) {
        custMap[r.Customer] = { Customer: r.Customer, Sales: 0, Profit: 0, Quantity: 0, Orders: 0 };
      }
      custMap[r.Customer].Sales += r.Sales;
      custMap[r.Customer].Profit += r.Profit;
      custMap[r.Customer].Quantity += r.Quantity;
      custMap[r.Customer].Orders += 1;
    });

    const list = Object.values(custMap).map((c) => ({
      ...c,
      Avg_Order_Value: c.Orders > 0 ? c.Sales / c.Orders : 0,
      Profit_Margin_Pct: c.Sales > 0 ? (c.Profit / c.Sales) * 100 : 0
    }));

    return {
      topBySales: [...list].sort((a, b) => b.Sales - a.Sales).slice(0, 10),
      topByProfit: [...list].sort((a, b) => b.Profit - a.Profit).slice(0, 10),
      topByOrders: [...list].sort((a, b) => b.Orders - a.Orders).slice(0, 10),
      allCount: list.length
    };
  }

  function getDiscountAnalysis() {
    const data = filteredData;
    const tiers = [
      { label: "0-5%", min: 0.0, max: 0.05, Orders: 0, Sales: 0, Profit: 0 },
      { label: "5-10%", min: 0.05001, max: 0.10, Orders: 0, Sales: 0, Profit: 0 },
      { label: "10-20%", min: 0.10001, max: 0.20, Orders: 0, Sales: 0, Profit: 0 },
      { label: "20-30%", min: 0.20001, max: 0.301, Orders: 0, Sales: 0, Profit: 0 }
    ];

    data.forEach((r) => {
      for (const t of tiers) {
        if (r.Discount >= t.min && r.Discount <= t.max) {
          t.Orders += 1;
          t.Sales += r.Sales;
          t.Profit += r.Profit;
          break;
        }
      }
    });

    return tiers.map((t) => ({
      Tier: t.label,
      Order_Count: t.Orders,
      Total_Sales: t.Sales,
      Total_Profit: t.Profit,
      Avg_Sales: t.Orders > 0 ? t.Sales / t.Orders : 0,
      Avg_Profit: t.Orders > 0 ? t.Profit / t.Orders : 0,
      Profit_Margin_Pct: t.Sales > 0 ? (t.Profit / t.Sales) * 100 : 0
    }));
  }

  function getOutlierSummary() {
    const data = filteredData;
    if (data.length === 0) return { salesOutliers: [], profitOutliers: [] };

    const getMetrics = (arr, key) => {
      const sorted = [...arr].map((r) => r[key]).sort((a, b) => a - b);
      const q1 = sorted[Math.floor(sorted.length * 0.25)];
      const q3 = sorted[Math.floor(sorted.length * 0.75)];
      const iqr = q3 - q1;
      const upperFence = q3 + 1.5 * iqr;
      const lowerFence = Math.max(0, q1 - 1.5 * iqr);
      const outliers = arr.filter((r) => r[key] > upperFence || r[key] < lowerFence);
      return { q1, q3, iqr, upperFence, lowerFence, count: outliers.length, outliers };
    };

    const salesOutliers = getMetrics(data, "Sales");
    const profitOutliers = getMetrics(data, "Profit");

    return { salesOutliers, profitOutliers };
  }

  function getHighSalesLowProfitOrders() {
    const data = filteredData;
    if (data.length === 0) return [];

    const totalSales = data.reduce((acc, r) => acc + r.Sales, 0);
    const avgSales = totalSales / data.length;

    const matched = data.filter((r) => r.Sales > avgSales && r.Profit_Margin < 10.0);
    matched.sort((a, b) => b.Sales - a.Sales);

    return {
      orders: matched,
      count: matched.length,
      totalSales: matched.reduce((acc, r) => acc + r.Sales, 0),
      totalProfit: matched.reduce((acc, r) => acc + r.Profit, 0),
      avgDiscount: matched.length > 0 ? matched.reduce((acc, r) => acc + r.Discount, 0) / matched.length : 0,
      avgMargin: matched.length > 0 ? matched.reduce((acc, r) => acc + r.Profit_Margin, 0) / matched.length : 0
    };
  }

  /**
   * Simulates what-if scenario where discounts are capped at a target ceiling.
   * Clearly disclaimed as a model estimation based on fixed volume assumptions.
   */
  function simulateDiscountCap(capRate = 0.15) {
    const data = filteredData;
    let originalProfit = 0;
    let simulatedProfit = 0;
    let impactedOrders = 0;
    let recoveredRevenue = 0;

    data.forEach((r) => {
      originalProfit += r.Profit;
      if (r.Discount > capRate) {
        impactedOrders += 1;
        // Estimate pre-discount price: Sales = Undiscounted * (1 - Discount)
        const undiscountedSales = r.Sales / (1.0 - r.Discount);
        const newSales = undiscountedSales * (1.0 - capRate);
        const additionalProfit = newSales - r.Sales; // Assuming fixed cost
        recoveredRevenue += additionalProfit;
        simulatedProfit += r.Profit + additionalProfit;
      } else {
        simulatedProfit += r.Profit;
      }
    });

    const totalSales = data.reduce((acc, r) => acc + r.Sales, 0);
    const originalMargin = totalSales > 0 ? (originalProfit / totalSales) * 100 : 0;
    const simulatedSales = totalSales + recoveredRevenue;
    const simulatedMargin = simulatedSales > 0 ? (simulatedProfit / simulatedSales) * 100 : 0;

    return {
      capRate: capRate * 100,
      impactedOrders,
      originalProfit,
      simulatedProfit,
      potentialProfitGain: recoveredRevenue,
      originalMargin,
      simulatedMargin,
      marginLiftBps: (simulatedMargin - originalMargin) * 100
    };
  }

  return {
    init,
    isLoaded: () => isLoaded,
    getRawData: () => rawData,
    getFilteredData: () => filteredData,
    setFilter,
    resetFilters,
    getActiveFilters,
    getOverviewKPIs,
    getCategoryPerformance,
    getRegionPerformance,
    getMonthlyTrend,
    getProductPerformance,
    getCustomerAnalysis,
    getDiscountAnalysis,
    getOutlierSummary,
    getHighSalesLowProfitOrders,
    simulateDiscountCap
  };
})();
