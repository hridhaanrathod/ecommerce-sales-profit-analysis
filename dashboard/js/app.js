/**
 * ============================================================================
 * RETAILPULSE - MAIN DASHBOARD UI CONTROLLER
 * File: dashboard/js/app.js
 * ============================================================================
 * Description:
 *   Orchestrates tab routing, reactive filter bindings, dynamic table
 *   rendering, search, multi-column sorting, pagination, CSV exports,
 *   what-if discount simulation, theme toggling, and toast notifications.
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const startTime = performance.now();

  // App State
  let activeTab = "overview";
  let explorerCurrentPage = 1;
  let explorerPageSize = 25;
  let explorerSortColumn = "Order_Date";
  let explorerSortOrder = "desc";
  let explorerSearchQuery = "";

  // DOM Elements - Navigation & Theme
  const sidebar = document.getElementById("sidebar");
  const btnMobileMenu = document.getElementById("btn-mobile-menu");
  const btnThemeToggle = document.getElementById("btn-theme-toggle");
  const currentPageTitle = document.getElementById("current-page-title");
  const dataStatusBadge = document.getElementById("data-status-badge");
  const navLinks = document.querySelectorAll(".nav-link");
  const tabPages = document.querySelectorAll(".tab-page");

  // DOM Elements - Slicers
  const selectDate = document.getElementById("select-date");
  const selectRegion = document.getElementById("select-region");
  const selectCategory = document.getElementById("select-category");
  const btnResetFilters = document.getElementById("btn-reset-filters");
  const activeFilterText = document.getElementById("active-filter-text");

  // DOM Elements - KPIs
  const kpiTotalSales = document.getElementById("kpi-total-sales");
  const kpiTotalProfit = document.getElementById("kpi-total-profit");
  const kpiProfitMargin = document.getElementById("kpi-profit-margin");
  const kpiMarginHealth = document.getElementById("kpi-margin-health");
  const kpiTotalOrders = document.getElementById("kpi-total-orders");
  const kpiTotalQuantity = document.getElementById("kpi-total-quantity");
  const kpiAov = document.getElementById("kpi-aov");

  // DOM Elements - Tables
  const tableProductsMatrixBody = document.getElementById("table-products-matrix-body");
  const tableRegionalMatrixBody = document.getElementById("table-regional-matrix-body");
  const tableExplorerBody = document.getElementById("table-explorer-body");
  const explorerSearch = document.getElementById("explorer-search");
  const explorerPageSizeSelect = document.getElementById("explorer-page-size");
  const btnExportCsv = document.getElementById("btn-export-csv");
  const tablePaginationInfo = document.getElementById("table-pagination-info");
  const paginationButtons = document.getElementById("pagination-buttons");

  // DOM Elements - What-If Simulator
  const sliderDiscountCap = document.getElementById("slider-discount-cap");
  const valDiscountCap = document.getElementById("val-discount-cap");
  const simImpactedOrders = document.getElementById("sim-impacted-orders");
  const simOriginalProfit = document.getElementById("sim-original-profit");
  const simSimulatedProfit = document.getElementById("sim-simulated-profit");
  const simProfitGain = document.getElementById("sim-profit-gain");
  const simMarginLift = document.getElementById("sim-margin-lift");
  const simBpsGain = document.getElementById("sim-bps-gain");

  // DOM Elements - Toast
  const toastContainer = document.getElementById("toast-container");

  // --------------------------------------------------------------------------
  // 1. INITIALIZATION & DATA LOADING
  // --------------------------------------------------------------------------

  // Restore saved theme preference
  const savedTheme = localStorage.getItem("retailpulse_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  btnThemeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";

  // Ingest data
  DataStore.init(
    () => {
      const elapsed = Math.round(performance.now() - startTime);
      dataStatusBadge.textContent = `Loaded (${elapsed}ms)`;
      dataStatusBadge.className = "badge badge-success";
      updateDashboard();
      initEventListeners();
      showToast("5,000 Cleaned Transactions Ready", "success");
    },
    (errMsg) => {
      dataStatusBadge.textContent = "Error Loading CSV";
      dataStatusBadge.className = "badge badge-danger";
      showToast(errMsg, "error");
    }
  );

  // --------------------------------------------------------------------------
  // 2. DASHBOARD VIEW REACTION
  // --------------------------------------------------------------------------

  function updateDashboard() {
    updateKPIs();
    updateFilterIndicator();
    updateProductMatrixTable();
    updateRegionalMatrixTable();
    updateDataExplorer();
    updateSimulator();

    // Re-render active charts
    ChartManager.refreshActiveCharts(activeTab);
  }

  function formatExactRupees(val) {
    return "₹" + Number(val).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function updateKPIs() {
    const kpis = DataStore.getOverviewKPIs();
    kpiTotalSales.textContent = formatExactRupees(kpis.totalSales);
    kpiTotalProfit.textContent = formatExactRupees(kpis.totalProfit);
    kpiProfitMargin.textContent = kpis.profitMargin.toFixed(2) + "%";
    kpiTotalOrders.textContent = kpis.totalOrders.toLocaleString("en-US");
    kpiTotalQuantity.textContent = kpis.totalQuantity.toLocaleString("en-US");
    kpiAov.textContent = formatExactRupees(kpis.aov);

    // Health indicator
    if (kpis.profitMargin >= 13.0) {
      kpiMarginHealth.textContent = "Healthy (Target: >12%)";
      kpiMarginHealth.className = "kpi-delta positive";
    } else if (kpis.profitMargin >= 10.0) {
      kpiMarginHealth.textContent = "Moderate (10% - 13%)";
      kpiMarginHealth.className = "kpi-delta";
      kpiMarginHealth.style.color = "var(--warning)";
    } else {
      kpiMarginHealth.textContent = "Margin Warning (<10%)";
      kpiMarginHealth.className = "kpi-delta negative";
    }
  }

  function updateFilterIndicator() {
    const filters = DataStore.getActiveFilters();
    const data = DataStore.getFilteredData();
    const parts = [];

    if (filters.dateRange !== "all") parts.push(`Period: ${filters.dateRange}`);
    if (filters.region !== "all") parts.push(`Region: ${filters.region}`);
    if (filters.category !== "all") parts.push(`Category: ${filters.category}`);

    if (parts.length === 0) {
      activeFilterText.textContent = `Showing all ${data.length.toLocaleString()} transactions`;
    } else {
      activeFilterText.textContent = `Filtered: ${data.length.toLocaleString()} orders (${parts.join(", ")})`;
    }
  }

  // --------------------------------------------------------------------------
  // 3. TABLE RENDERING
  // --------------------------------------------------------------------------

  function updateProductMatrixTable() {
    if (!tableProductsMatrixBody) return;
    const prodData = DataStore.getProductPerformance();
    const rows = prodData.bySales.map((p) => {
      let marginClass = "badge-danger";
      if (p.Profit_Margin_Pct >= 18) marginClass = "badge-success";
      else if (p.Profit_Margin_Pct >= 12) marginClass = "badge-warning";

      return `
        <tr>
          <td><strong>${p.Product}</strong></td>
          <td><span class="badge badge-primary">${p.Category}</span></td>
          <td class="text-right">${p.Orders.toLocaleString()}</td>
          <td class="text-right">${p.Quantity.toLocaleString()}</td>
          <td class="text-right"><strong>${ChartManager.formatCurrency(p.Sales)}</strong></td>
          <td class="text-right">${ChartManager.formatCurrency(p.Profit)}</td>
          <td class="text-right"><span class="badge ${marginClass}">${p.Profit_Margin_Pct.toFixed(2)}%</span></td>
        </tr>
      `;
    });
    tableProductsMatrixBody.innerHTML = rows.join("");
  }

  function updateRegionalMatrixTable() {
    if (!tableRegionalMatrixBody) return;
    const regData = DataStore.getRegionPerformance();
    const rows = regData.map((r) => {
      return `
        <tr>
          <td><strong>${r.Region} Region</strong></td>
          <td class="text-right">${r.Order_Count.toLocaleString()}</td>
          <td class="text-right"><strong>${ChartManager.formatCurrency(r.Total_Sales)}</strong></td>
          <td class="text-right">${r.Sales_Share_Pct.toFixed(1)}%</td>
          <td class="text-right">${ChartManager.formatCurrency(r.Total_Profit)}</td>
          <td class="text-right"><span class="badge badge-success">${r.Profit_Margin_Pct.toFixed(2)}%</span></td>
          <td class="text-right">${ChartManager.formatCurrency(r.Avg_Sales)}</td>
        </tr>
      `;
    });
    tableRegionalMatrixBody.innerHTML = rows.join("");
  }

  // --------------------------------------------------------------------------
  // 4. DATA EXPLORER (SEARCH, SORT, PAGINATE, EXPORT)
  // --------------------------------------------------------------------------

  function getExplorerFilteredData() {
    let data = [...DataStore.getFilteredData()];

    // Search query
    if (explorerSearchQuery.trim() !== "") {
      const q = explorerSearchQuery.toLowerCase().trim();
      data = data.filter((r) => {
        return (
          r.Order_ID.toLowerCase().includes(q) ||
          r.Customer.toLowerCase().includes(q) ||
          r.Product.toLowerCase().includes(q) ||
          r.City.toLowerCase().includes(q) ||
          r.Region.toLowerCase().includes(q) ||
          r.Category.toLowerCase().includes(q)
        );
      });
    }

    // Sort
    data.sort((a, b) => {
      let valA = a[explorerSortColumn];
      let valB = b[explorerSortColumn];

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return explorerSortOrder === "asc" ? -1 : 1;
      if (valA > valB) return explorerSortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }

  function updateDataExplorer() {
    if (!tableExplorerBody) return;
    const data = getExplorerFilteredData();
    const totalRecords = data.length;
    const totalPages = Math.ceil(totalRecords / explorerPageSize) || 1;

    if (explorerCurrentPage > totalPages) explorerCurrentPage = totalPages;
    if (explorerCurrentPage < 1) explorerCurrentPage = 1;

    const startIdx = (explorerCurrentPage - 1) * explorerPageSize;
    const endIdx = Math.min(startIdx + explorerPageSize, totalRecords);
    const pageRecords = data.slice(startIdx, endIdx);

    // Render Table Rows
    if (pageRecords.length === 0) {
      tableExplorerBody.innerHTML = `<tr><td colspan="12" class="text-center" style="padding: 2rem; color: var(--text-muted);">No matching transactions found.</td></tr>`;
    } else {
      const rows = pageRecords.map((r) => {
        let marginClass = "badge-danger";
        if (r.Profit_Margin >= 18) marginClass = "badge-success";
        else if (r.Profit_Margin >= 10) marginClass = "badge-warning";

        const discountPct = (r.Discount * 100).toFixed(0) + "%";

        return `
          <tr>
            <td><code>${r.Order_ID}</code></td>
            <td>${r.Order_Date}</td>
            <td><strong>${r.Customer}</strong></td>
            <td><span class="badge badge-primary">${r.Category}</span></td>
            <td>${r.Product}</td>
            <td>${r.Region}</td>
            <td>${r.City}</td>
            <td class="text-right">${r.Quantity}</td>
            <td class="text-right"><span class="badge badge-warning">${discountPct}</span></td>
            <td class="text-right"><strong>₹${r.Sales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
            <td class="text-right">₹${r.Profit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td class="text-right"><span class="badge ${marginClass}">${r.Profit_Margin.toFixed(1)}%</span></td>
          </tr>
        `;
      });
      tableExplorerBody.innerHTML = rows.join("");
    }

    // Update Pagination Info
    tablePaginationInfo.textContent = totalRecords === 0
      ? "Showing 0 entries"
      : `Showing ${(startIdx + 1).toLocaleString()} to ${endIdx.toLocaleString()} of ${totalRecords.toLocaleString()} entries`;

    // Render Pagination Buttons
    renderPaginationButtons(totalPages);
  }

  function renderPaginationButtons(totalPages) {
    if (!paginationButtons) return;
    let html = "";

    // Prev Button
    html += `<button class="btn-page" id="btn-prev-page" ${explorerCurrentPage === 1 ? "disabled" : ""}>‹</button>`;

    // Page numbers with ellipsis
    const maxButtons = 5;
    let startPage = Math.max(1, explorerCurrentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    if (startPage > 1) {
      html += `<button class="btn-page" data-page="1">1</button>`;
      if (startPage > 2) html += `<span style="padding: 0 4px; color: var(--text-muted);">...</span>`;
    }

    for (let p = startPage; p <= endPage; p++) {
      html += `<button class="btn-page ${p === explorerCurrentPage ? "active" : ""}" data-page="${p}">${p}</button>`;
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) html += `<span style="padding: 0 4px; color: var(--text-muted);">...</span>`;
      html += `<button class="btn-page" data-page="${totalPages}">${totalPages}</button>`;
    }

    // Next Button
    html += `<button class="btn-page" id="btn-next-page" ${explorerCurrentPage === totalPages ? "disabled" : ""}>›</button>`;

    paginationButtons.innerHTML = html;

    // Attach click events
    paginationButtons.querySelectorAll(".btn-page").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.id === "btn-prev-page") {
          if (explorerCurrentPage > 1) {
            explorerCurrentPage--;
            updateDataExplorer();
          }
        } else if (btn.id === "btn-next-page") {
          if (explorerCurrentPage < totalPages) {
            explorerCurrentPage++;
            updateDataExplorer();
          }
        } else if (btn.dataset.page) {
          explorerCurrentPage = parseInt(btn.dataset.page, 10);
          updateDataExplorer();
        }
      });
    });
  }

  function exportFilteredToCSV() {
    const data = getExplorerFilteredData();
    if (data.length === 0) {
      showToast("No data to export", "warning");
      return;
    }

    const headers = ["Order_ID", "Order_Date", "Customer", "Category", "Product", "Region", "City", "Quantity", "Discount", "Sales", "Profit"];
    const csvRows = [headers.join(",")];

    data.forEach((r) => {
      const row = [
        `"${r.Order_ID}"`,
        `"${r.Order_Date}"`,
        `"${r.Customer.replace(/"/g, '""')}"`,
        `"${r.Category}"`,
        `"${r.Product.replace(/"/g, '""')}"`,
        `"${r.Region}"`,
        `"${r.City.replace(/"/g, '""')}"`,
        r.Quantity,
        r.Discount,
        r.Sales.toFixed(2),
        r.Profit.toFixed(2)
      ];
      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().split("T")[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `retailpulse_sales_filtered_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${data.length.toLocaleString()} rows to CSV`, "success");
  }

  // --------------------------------------------------------------------------
  // 5. WHAT-IF DISCOUNT SIMULATOR
  // --------------------------------------------------------------------------

  function updateSimulator() {
    if (!sliderDiscountCap) return;
    const capPct = parseInt(sliderDiscountCap.value, 10);
    const capRate = capPct / 100.0;
    valDiscountCap.textContent = `${capPct}%`;

    const sim = DataStore.simulateDiscountCap(capRate);
    simImpactedOrders.textContent = sim.impactedOrders.toLocaleString();
    simOriginalProfit.textContent = ChartManager.formatCurrency(sim.originalProfit);
    simSimulatedProfit.textContent = ChartManager.formatCurrency(sim.simulatedProfit);
    simProfitGain.textContent = `+${ChartManager.formatCurrency(sim.potentialProfitGain)}`;
    simMarginLift.textContent = `${sim.simulatedMargin.toFixed(2)}%`;
    simBpsGain.textContent = `+${Math.round(sim.marginLiftBps)} bps lift (from ${sim.originalMargin.toFixed(2)}%)`;
  }

  // --------------------------------------------------------------------------
  // 6. EVENT LISTENERS
  // --------------------------------------------------------------------------

  function initEventListeners() {
    // Tab Switching
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const tab = link.dataset.tab;
        if (!tab || tab === activeTab) return;

        navLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");

        tabPages.forEach((page) => page.classList.remove("active"));
        const targetPage = document.getElementById(`tab-${tab}`);
        if (targetPage) targetPage.classList.add("active");

        activeTab = tab;
        const titleMap = {
          overview: "Executive Overview",
          products: "Product & Customer Analysis",
          regional: "Regional & Monthly Analysis",
          explorer: "Data Explorer",
          insights: "Strategic Business Insights",
          simulator: "What-If Discount Simulator",
          sql: "SQL Analysis & Benchmarks"
        };
        currentPageTitle.textContent = titleMap[tab] || "Dashboard";

        // Sidebar closes on mobile after selection
        if (window.innerWidth <= 768) {
          sidebar.classList.remove("open");
        }

        // Render charts for new active tab
        ChartManager.refreshActiveCharts(activeTab);
      });
    });

    // Mobile Menu Toggle
    btnMobileMenu.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });

    // Theme Switcher
    btnThemeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("retailpulse_theme", next);
      btnThemeToggle.textContent = next === "dark" ? "☀️" : "🌙";
      ChartManager.rethemeAllCharts();
      showToast(`Switched to ${next} mode`, "info");
    });

    // Slicers
    selectDate.addEventListener("change", (e) => {
      DataStore.setFilter("dateRange", e.target.value);
      updateDashboard();
    });

    selectRegion.addEventListener("change", (e) => {
      DataStore.setFilter("region", e.target.value);
      updateDashboard();
    });

    selectCategory.addEventListener("change", (e) => {
      DataStore.setFilter("category", e.target.value);
      updateDashboard();
    });

    btnResetFilters.addEventListener("click", () => {
      DataStore.resetFilters();
      selectDate.value = "all";
      selectRegion.value = "all";
      selectCategory.value = "all";
      updateDashboard();
      showToast("Filters reset to default", "info");
    });

    // Data Explorer Controls
    if (explorerSearch) {
      explorerSearch.addEventListener("input", (e) => {
        explorerSearchQuery = e.target.value;
        explorerCurrentPage = 1;
        updateDataExplorer();
      });
    }

    if (explorerPageSizeSelect) {
      explorerPageSizeSelect.addEventListener("change", (e) => {
        explorerPageSize = parseInt(e.target.value, 10);
        explorerCurrentPage = 1;
        updateDataExplorer();
      });
    }

    if (btnExportCsv) {
      btnExportCsv.addEventListener("click", exportFilteredToCSV);
    }

    // Explorer Sorting
    const sortHeaders = document.querySelectorAll("#data-explorer-table th.sortable");
    sortHeaders.forEach((th) => {
      th.addEventListener("click", () => {
        const col = th.dataset.col;
        if (explorerSortColumn === col) {
          explorerSortOrder = explorerSortOrder === "asc" ? "desc" : "asc";
        } else {
          explorerSortColumn = col;
          explorerSortOrder = "desc";
        }

        sortHeaders.forEach((h) => {
          h.classList.remove("asc", "desc");
        });
        th.classList.add(explorerSortOrder);

        updateDataExplorer();
      });
    });

    // What-If Slider
    if (sliderDiscountCap) {
      sliderDiscountCap.addEventListener("input", () => {
        updateSimulator();
      });
    }

    // SQL Code Copy Buttons
    document.querySelectorAll(".btn-copy-code").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pre = btn.parentElement.querySelector("code");
        if (pre) {
          navigator.clipboard.writeText(pre.innerText).then(() => {
            showToast("SQL snippet copied to clipboard!", "success");
          });
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. TOAST NOTIFICATION UTILITY
  // --------------------------------------------------------------------------

  function showToast(message, type = "info") {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast";

    const iconMap = {
      success: "✓",
      error: "✕",
      warning: "⚠️",
      info: "ℹ️"
    };

    toast.innerHTML = `<span>${iconMap[type] || "ℹ️"}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 300ms ease";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
});
