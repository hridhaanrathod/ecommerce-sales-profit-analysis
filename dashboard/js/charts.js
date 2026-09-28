/**
 * ============================================================================
 * E-COMMERCE SALES & PROFIT ANALYSIS - CHART CONTROLLER
 * File: dashboard/js/charts.js
 * ============================================================================
 * Description:
 *   Manages all Chart.js instances, color palettes, responsive tooltips,
 *   currency formatting (INR Millions / Lakhs / Thousands), and reactive
 *   re-rendering upon filter adjustments or theme switches.
 * ============================================================================
 */

const ChartManager = (() => {
  // Registry of active chart instances
  const instances = {};

  // Theme palettes
  const PALETTES = {
    light: {
      primary: "#2563eb",       // Sapphire Blue
      secondary: "#059669",     // Emerald Green
      accent: "#f59e0b",        // Amber
      coral: "#dc2626",         // Crimson
      purple: "#7c3aed",        // Royal Purple
      neutral: "#64748b",       // Slate
      grid: "#e2e8f0",          // Subtle grid line
      text: "#1e293b",          // Dark text
      background: "#ffffff",
      colors: ["#2563eb", "#059669", "#f59e0b", "#dc2626", "#7c3aed", "#0891b2"]
    },
    dark: {
      primary: "#3b82f6",       // Lighter Blue
      secondary: "#10b981",     // Lighter Green
      accent: "#fbbf24",        // Bright Amber
      coral: "#f87171",         // Rose Red
      purple: "#a78bfa",        // Lavender Purple
      neutral: "#94a3b8",       // Light Slate
      grid: "#334155",          // Dark border grid
      text: "#f8fafc",          // Off-white text
      background: "#1e293b",
      colors: ["#3b82f6", "#10b981", "#fbbf24", "#f87171", "#a78bfa", "#06b6d4"]
    }
  };

  function getCurrentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function formatCurrency(val) {
    if (Math.abs(val) >= 1e7) {
      return "₹" + (val / 1e7).toFixed(2) + " Cr";
    }
    if (Math.abs(val) >= 1e5) {
      return "₹" + (val / 1e5).toFixed(2) + " L";
    }
    if (Math.abs(val) >= 1e3) {
      return "₹" + (val / 1e3).toFixed(1) + " k";
    }
    return "₹" + val.toFixed(0);
  }

  function destroyChart(id) {
    if (instances[id]) {
      instances[id].destroy();
      delete instances[id];
    }
  }

  // --------------------------------------------------------------------------
  // 1. EXECUTIVE OVERVIEW CHARTS
  // --------------------------------------------------------------------------

  function renderExecutiveCharts() {
    const theme = PALETTES[getCurrentTheme()];
    const monthlyData = DataStore.getMonthlyTrend();
    const catData = DataStore.getCategoryPerformance();
    const regData = DataStore.getRegionPerformance();

    // Chart 1: Monthly Sales & Profit Trend
    destroyChart("chart-monthly-trend");
    const ctxMonthly = document.getElementById("chart-monthly-trend");
    if (ctxMonthly) {
      instances["chart-monthly-trend"] = new Chart(ctxMonthly, {
        type: "line",
        data: {
          labels: monthlyData.map((m) => m.Month_Name),
          datasets: [
            {
              label: "Sales Revenue",
              data: monthlyData.map((m) => m.Sales),
              borderColor: theme.primary,
              backgroundColor: "rgba(37, 99, 235, 0.1)",
              borderWidth: 2.5,
              fill: true,
              tension: 0.3,
              pointRadius: 4,
              pointHoverRadius: 6,
              yAxisID: "y"
            },
            {
              label: "Net Profit",
              data: monthlyData.map((m) => m.Profit),
              borderColor: theme.secondary,
              backgroundColor: "transparent",
              borderWidth: 2.5,
              borderDash: [5, 4],
              tension: 0.3,
              pointRadius: 4,
              pointHoverRadius: 6,
              yAxisID: "y1"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { position: "top", labels: { color: theme.text, font: { weight: "600" } } },
            tooltip: {
              callbacks: {
                label: (context) => `${context.dataset.label}: ${formatCurrency(context.raw)}`
              }
            }
          },
          scales: {
            x: { grid: { color: theme.grid }, ticks: { color: theme.text } },
            y: {
              type: "linear",
              position: "left",
              grid: { color: theme.grid },
              ticks: { color: theme.primary, callback: (v) => formatCurrency(v) }
            },
            y1: {
              type: "linear",
              position: "right",
              grid: { drawOnChartArea: false },
              ticks: { color: theme.secondary, callback: (v) => formatCurrency(v) }
            }
          }
        }
      });
    }

    // Chart 2: Category Sales Share Donut
    destroyChart("chart-category-sales");
    const ctxCategory = document.getElementById("chart-category-sales");
    if (ctxCategory) {
      instances["chart-category-sales"] = new Chart(ctxCategory, {
        type: "doughnut",
        data: {
          labels: catData.map((c) => c.Category),
          datasets: [
            {
              data: catData.map((c) => c.Total_Sales),
              backgroundColor: [theme.primary, theme.secondary, theme.accent],
              borderWidth: 2,
              borderColor: theme.background,
              hoverOffset: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "68%",
          plugins: {
            legend: { position: "bottom", labels: { color: theme.text, padding: 16 } },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const pct = total > 0 ? ((context.raw / total) * 100).toFixed(1) : 0;
                  return ` ${context.label}: ${formatCurrency(context.raw)} (${pct}%)`;
                }
              }
            }
          }
        }
      });
    }

    // Chart 3: Regional Sales Bar
    destroyChart("chart-region-sales");
    const ctxRegion = document.getElementById("chart-region-sales");
    if (ctxRegion) {
      instances["chart-region-sales"] = new Chart(ctxRegion, {
        type: "bar",
        data: {
          labels: regData.map((r) => r.Region),
          datasets: [
            {
              label: "Sales Revenue",
              data: regData.map((r) => r.Total_Sales),
              backgroundColor: theme.primary,
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => `Sales: ${formatCurrency(context.raw)}`
              }
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: theme.text, font: { weight: "600" } } },
            y: { grid: { color: theme.grid }, ticks: { color: theme.text, callback: (v) => formatCurrency(v) } }
          }
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 2. PRODUCT & CUSTOMER CHARTS
  // --------------------------------------------------------------------------

  function renderProductCustomerCharts() {
    const theme = PALETTES[getCurrentTheme()];
    const prodData = DataStore.getProductPerformance();
    const custData = DataStore.getCustomerAnalysis();

    // Chart 4: Top 5 Products by Sales
    destroyChart("chart-top-products");
    const ctxTopProd = document.getElementById("chart-top-products");
    if (ctxTopProd) {
      const top5Sales = prodData.bySales.slice(0, 7).reverse();
      instances["chart-top-products"] = new Chart(ctxTopProd, {
        type: "bar",
        data: {
          labels: top5Sales.map((p) => p.Product),
          datasets: [
            {
              label: "Sales (INR)",
              data: top5Sales.map((p) => p.Sales),
              backgroundColor: theme.primary,
              borderRadius: 5
            }
          ]
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => `Sales: ${formatCurrency(context.raw)}`
              }
            }
          },
          scales: {
            x: { grid: { color: theme.grid }, ticks: { color: theme.text, callback: (v) => formatCurrency(v) } },
            y: { grid: { display: false }, ticks: { color: theme.text, font: { weight: "600" } } }
          }
        }
      });
    }

    // Chart 5: Product Profit Margins
    destroyChart("chart-product-margins");
    const ctxProdMargin = document.getElementById("chart-product-margins");
    if (ctxProdMargin) {
      const marginList = [...prodData.all].sort((a, b) => a.Profit_Margin_Pct - b.Profit_Margin_Pct);
      instances["chart-product-margins"] = new Chart(ctxProdMargin, {
        type: "bar",
        data: {
          labels: marginList.map((p) => p.Product),
          datasets: [
            {
              label: "Profit Margin (%)",
              data: marginList.map((p) => p.Profit_Margin_Pct),
              backgroundColor: marginList.map((p) =>
                p.Profit_Margin_Pct >= 20 ? theme.secondary : p.Profit_Margin_Pct >= 13 ? theme.accent : theme.coral
              ),
              borderRadius: 4
            }
          ]
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => `Margin: ${context.raw.toFixed(2)}%`
              }
            }
          },
          scales: {
            x: { grid: { color: theme.grid }, ticks: { color: theme.text, callback: (v) => v + "%" }, max: 35 },
            y: { grid: { display: false }, ticks: { color: theme.text, font: { size: 11 } } }
          }
        }
      });
    }

    // Chart 6: Top 10 Customers by Sales & Profit
    destroyChart("chart-top-customers");
    const ctxTopCust = document.getElementById("chart-top-customers");
    if (ctxTopCust) {
      const top10 = [...custData.topBySales].reverse();
      instances["chart-top-customers"] = new Chart(ctxTopCust, {
        type: "bar",
        data: {
          labels: top10.map((c) => c.Customer),
          datasets: [
            {
              label: "Sales",
              data: top10.map((c) => c.Sales),
              backgroundColor: theme.primary,
              borderRadius: 4
            },
            {
              label: "Profit",
              data: top10.map((c) => c.Profit),
              backgroundColor: theme.secondary,
              borderRadius: 4
            }
          ]
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "top", labels: { color: theme.text } },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`
              }
            }
          },
          scales: {
            x: { grid: { color: theme.grid }, ticks: { color: theme.text, callback: (v) => formatCurrency(v) } },
            y: { grid: { display: false }, ticks: { color: theme.text, font: { size: 11, weight: "600" } } }
          }
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 3. REGIONAL & MONTHLY ANALYSIS CHARTS
  // --------------------------------------------------------------------------

  function renderRegionalMonthlyCharts() {
    const theme = PALETTES[getCurrentTheme()];
    const regData = DataStore.getRegionPerformance();
    const monthlyData = DataStore.getMonthlyTrend();

    // Chart 7: Region Comparison (Sales vs Profit)
    destroyChart("chart-region-comparison");
    const ctxRegComp = document.getElementById("chart-region-comparison");
    if (ctxRegComp) {
      instances["chart-region-comparison"] = new Chart(ctxRegComp, {
        type: "bar",
        data: {
          labels: regData.map((r) => r.Region),
          datasets: [
            {
              label: "Sales (INR)",
              data: regData.map((r) => r.Total_Sales),
              backgroundColor: theme.primary,
              borderRadius: 6
            },
            {
              label: "Profit (INR)",
              data: regData.map((r) => r.Total_Profit),
              backgroundColor: theme.secondary,
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "top", labels: { color: theme.text } },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`
              }
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: theme.text, font: { weight: "600" } } },
            y: { grid: { color: theme.grid }, ticks: { color: theme.text, callback: (v) => formatCurrency(v) } }
          }
        }
      });
    }

    // Chart 8: MoM Sales Growth Rate (%)
    destroyChart("chart-monthly-mom");
    const ctxMoM = document.getElementById("chart-monthly-mom");
    if (ctxMoM) {
      instances["chart-monthly-mom"] = new Chart(ctxMoM, {
        type: "bar",
        data: {
          labels: monthlyData.map((m) => m.Month_Name),
          datasets: [
            {
              label: "MoM Growth (%)",
              data: monthlyData.map((m) => m.MoM_Sales_Growth_Pct),
              backgroundColor: monthlyData.map((m) =>
                m.MoM_Sales_Growth_Pct >= 0 ? theme.secondary : theme.coral
              ),
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => `Growth: ${ctx.raw >= 0 ? "+" : ""}${ctx.raw.toFixed(2)}%`
              }
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: theme.text } },
            y: {
              grid: { color: theme.grid },
              ticks: { color: theme.text, callback: (v) => v + "%" }
            }
          }
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 4. DISCOUNT VS PROFIT SIMULATOR CHARTS
  // --------------------------------------------------------------------------

  function renderDiscountAnalysisChart() {
    const theme = PALETTES[getCurrentTheme()];
    const discData = DataStore.getDiscountAnalysis();

    destroyChart("chart-discount-margin");
    const ctxDisc = document.getElementById("chart-discount-margin");
    if (ctxDisc) {
      instances["chart-discount-margin"] = new Chart(ctxDisc, {
        type: "bar",
        data: {
          labels: discData.map((d) => d.Tier),
          datasets: [
            {
              type: "bar",
              label: "Average Profit (INR)",
              data: discData.map((d) => d.Avg_Profit),
              backgroundColor: theme.primary,
              borderRadius: 5,
              yAxisID: "y"
            },
            {
              type: "line",
              label: "Profit Margin (%)",
              data: discData.map((d) => d.Profit_Margin_Pct),
              borderColor: theme.coral,
              backgroundColor: theme.coral,
              borderWidth: 2.5,
              pointRadius: 5,
              yAxisID: "y1"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "top", labels: { color: theme.text } },
            tooltip: {
              callbacks: {
                label: (ctx) =>
                  ctx.dataset.type === "line"
                    ? `Margin: ${ctx.raw.toFixed(2)}%`
                    : `Avg Profit: ${formatCurrency(ctx.raw)}`
              }
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: theme.text, font: { weight: "600" } } },
            y: {
              type: "linear",
              position: "left",
              grid: { color: theme.grid },
              ticks: { color: theme.primary, callback: (v) => formatCurrency(v) }
            },
            y1: {
              type: "linear",
              position: "right",
              grid: { drawOnChartArea: false },
              ticks: { color: theme.coral, callback: (v) => v + "%" },
              min: 8,
              max: 16
            }
          }
        }
      });
    }
  }

  /**
   * Re-renders all visible charts according to the active tab.
   */
  function refreshActiveCharts(activeTabId) {
    if (activeTabId === "overview") {
      renderExecutiveCharts();
    } else if (activeTabId === "products") {
      renderProductCustomerCharts();
    } else if (activeTabId === "regional") {
      renderRegionalMonthlyCharts();
    } else if (activeTabId === "simulator") {
      renderDiscountAnalysisChart();
    }
  }

  function rethemeAllCharts() {
    renderExecutiveCharts();
    renderProductCustomerCharts();
    renderRegionalMonthlyCharts();
    renderDiscountAnalysisChart();
  }

  return {
    renderExecutiveCharts,
    renderProductCustomerCharts,
    renderRegionalMonthlyCharts,
    renderDiscountAnalysisChart,
    refreshActiveCharts,
    rethemeAllCharts,
    formatCurrency
  };
})();
