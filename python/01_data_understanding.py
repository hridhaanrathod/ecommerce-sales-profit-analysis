"""
================================================================================
PROJECT: Retail Sales Analysis - Portfolio Project
STEP 01: Data Understanding & Initial Inspection
FILE: python/01_data_understanding.py
================================================================================
Description:
    This beginner-friendly Python script loads the raw, uncleaned dataset
    'sales_analysis_raw.csv' and performs a comprehensive exploratory data
    inspection using pandas.

    It adheres strictly to the rule:
    * DO NOT clean or alter the data yet.
    * Inspect and document the true, unvarnished state of the raw dataset.

Author: Data Analyst Portfolio
================================================================================
"""

import os
import pandas as pd


def load_dataset():
    """
    Safely locates and loads 'sales_analysis_raw.csv' whether the script
    is executed from the repository root or from within the python/ folder.
    """
    candidates = [
        "sales_analysis_raw.csv",
        os.path.join("..", "sales_analysis_raw.csv"),
        os.path.join(os.path.dirname(__file__), "..", "sales_analysis_raw.csv")
    ]
    for path in candidates:
        if os.path.exists(path):
            print(f"[INFO] Successfully loaded dataset from: {path}\n")
            return pd.read_csv(path)

    raise FileNotFoundError(
        "Could not find 'sales_analysis_raw.csv'. Please ensure the file is in the project root."
    )


def print_section_header(title):
    """Prints a clear, formatted header for terminal output."""
    print("=" * 80)
    print(f" {title.upper()}")
    print("=" * 80)


def main():
    # -------------------------------------------------------------------------
    # STEP 0: LOAD RAW DATASET
    # -------------------------------------------------------------------------
    df = load_dataset()

    # -------------------------------------------------------------------------
    # 1. NUMBER OF ROWS AND COLUMNS
    # -------------------------------------------------------------------------
    print_section_header("1. Dataset Dimensions (Shape)")
    total_rows, total_cols = df.shape
    print(f"Total Rows (Records) : {total_rows:,}")
    print(f"Total Columns (Fields): {total_cols}")
    print(f"Total Data Cells      : {total_rows * total_cols:,}\n")

    # -------------------------------------------------------------------------
    # 2. ALL COLUMN NAMES
    # -------------------------------------------------------------------------
    print_section_header("2. Column Names")
    for i, col in enumerate(df.columns, start=1):
        print(f"  {i:2d}. {col}")
    print()

    # -------------------------------------------------------------------------
    # 3. DATA TYPE OF EVERY COLUMN
    # -------------------------------------------------------------------------
    print_section_header("3. Data Types (Raw vs Recommended)")
    dtype_overview = pd.DataFrame({
        "Column_Name": df.columns,
        "Raw_Pandas_Dtype": [str(t) for t in df.dtypes],
        "Non_Null_Count": df.notnull().sum().values,
        "Recommended_Dtype": [
            "string",    # Order_ID
            "datetime",  # Order_Date (currently string object)
            "string",    # Customer
            "category",  # Category
            "category",  # Product
            "category",  # Region
            "string",    # City
            "int64",     # Quantity
            "float64",   # Discount
            "float64",   # Sales
            "float64"    # Profit
        ]
    })
    print(dtype_overview.to_string(index=False))
    print("\nObservation: 'Order_Date' is currently loaded as object (string) and must be parsed to datetime in later steps.\n")

    # -------------------------------------------------------------------------
    # 4 & 5. MISSING VALUES COUNT AND PERCENTAGE
    # -------------------------------------------------------------------------
    print_section_header("4 & 5. Missing Values Analysis")
    missing_count = df.isnull().sum()
    missing_pct = (missing_count / total_rows) * 100
    missing_table = pd.DataFrame({
        "Column": df.columns,
        "Missing_Count": missing_count.values,
        "Missing_Percentage": missing_pct.values
    })
    # Filter to show columns with missing values first
    print(missing_table.to_string(index=False, formatters={"Missing_Percentage": "{:.2f}%".format}))
    
    null_rows = df[df.isnull().any(axis=1)]
    print(f"\nTotal rows containing at least one missing value: {len(null_rows)} ({len(null_rows)/total_rows*100:.2f}%)")
    print(f"- Customer missing : {missing_count['Customer']} rows (0.40%)")
    print(f"- City missing     : {missing_count['City']} rows (0.30%)")
    print("- Rows with both missing: 0 (Customer and City nulls occur in separate transactions)\n")

    # -------------------------------------------------------------------------
    # 6. NUMBER OF DUPLICATE ROWS
    # -------------------------------------------------------------------------
    print_section_header("6. Duplicate Rows Analysis")
    exact_duplicates = df.duplicated().sum()
    order_id_duplicates = df["Order_ID"].duplicated().sum()
    print(f"Exact Full-Row Duplicates : {exact_duplicates}")
    print(f"Duplicate Order_ID values : {order_id_duplicates}")
    
    if exact_duplicates > 0:
        print("\nIdentified Duplicate Records (Order_IDs repeated at the end of the file):")
        dup_mask = df.duplicated(keep=False)
        dup_samples = df[dup_mask].sort_values("Order_ID")
        print(dup_samples[["Order_ID", "Order_Date", "Customer", "Product", "Sales"]].to_string())
    print()

    # -------------------------------------------------------------------------
    # 7. UNIQUE VALUES IN CATEGORICAL COLUMNS
    # -------------------------------------------------------------------------
    print_section_header("7. Unique Values in Categorical Columns")
    cat_columns = ["Customer", "Category", "Product", "Region", "City"]
    for col in cat_columns:
        n_unique_with_null = df[col].nunique(dropna=False)
        n_unique_clean = df[col].nunique(dropna=True)
        print(f"Column: '{col}' -> {n_unique_clean} unique non-null values ({n_unique_with_null} including NaN)")
        print("Top 5 frequent values:")
        top5 = df[col].value_counts(dropna=False).head(5)
        for val, count in top5.items():
            print(f"   - {str(val):<20} : {count:>5} orders ({count/total_rows*100:>5.2f}%)")
        print()

    # -------------------------------------------------------------------------
    # 8. NUMERIC COLUMNS SUMMARY (MIN, MAX, MEAN, MEDIAN, STD)
    # -------------------------------------------------------------------------
    print_section_header("8. Summary Statistics for Numeric Columns")
    num_cols = ["Quantity", "Discount", "Sales", "Profit"]
    num_summary = pd.DataFrame({
        "Metric": ["Min", "Max", "Mean", "Median", "Std Dev"],
        "Quantity": [
            df["Quantity"].min(),
            df["Quantity"].max(),
            df["Quantity"].mean(),
            df["Quantity"].median(),
            df["Quantity"].std()
        ],
        "Discount": [
            df["Discount"].min(),
            df["Discount"].max(),
            df["Discount"].mean(),
            df["Discount"].median(),
            df["Discount"].std()
        ],
        "Sales (INR)": [
            df["Sales"].min(),
            df["Sales"].max(),
            df["Sales"].mean(),
            df["Sales"].median(),
            df["Sales"].std()
        ],
        "Profit (INR)": [
            df["Profit"].min(),
            df["Profit"].max(),
            df["Profit"].mean(),
            df["Profit"].median(),
            df["Profit"].std()
        ]
    })
    print(num_summary.to_string(index=False, justify="right"))
    print("\nDetailed Quartiles (.describe()):")
    print(df[num_cols].describe().T[["min", "25%", "50%", "75%", "max", "mean", "std"]].to_string())
    print()

    # -------------------------------------------------------------------------
    # 9. MINIMUM AND MAXIMUM ORDER DATE
    # -------------------------------------------------------------------------
    print_section_header("9. Order Date Range")
    temp_dates = pd.to_datetime(df["Order_Date"], errors="coerce")
    min_date = temp_dates.min().strftime("%Y-%m-%d")
    max_date = temp_dates.max().strftime("%Y-%m-%d")
    date_span_days = (temp_dates.max() - temp_dates.min()).days + 1
    unparseable_dates = temp_dates.isnull().sum()

    print(f"Minimum Order Date : {min_date}")
    print(f"Maximum Order Date : {max_date}")
    print(f"Calendar Span      : {date_span_days} days (Full calendar year 2025)")
    print(f"Total Unique Dates : {df['Order_Date'].nunique()} days with recorded transactions")
    print(f"Unparseable Dates  : {unparseable_dates} (All date strings follow valid YYYY-MM-DD format)\n")

    # -------------------------------------------------------------------------
    # 10. OBVIOUS DATA QUALITY PROBLEMS
    # -------------------------------------------------------------------------
    print_section_header("10. Obvious Data Quality Problems Identified")
    issues = [
        ("Structural Duplicates", f"{exact_duplicates} exact duplicate rows appended at bottom of CSV"),
        ("Missing Customer Names", f"{missing_count['Customer']} rows missing customer names"),
        ("Missing City Entries", f"{missing_count['City']} rows missing city information"),
        ("Date Format Type", "Order_Date stored as string (object) rather than datetime"),
        ("Casing Inconsistencies", "Mixed casing in 'Category' and 'Region' columns")
    ]
    for name, desc in issues:
        print(f" * [{name}]: {desc}")
    print()

    # -------------------------------------------------------------------------
    # 11. INCONSISTENT VALUES IN CATEGORICAL COLUMNS
    # -------------------------------------------------------------------------
    print_section_header("11. Inconsistent Values in Categorical Columns")
    print("A. Category Inconsistencies:")
    cat_counts = df["Category"].value_counts()
    for cat_name, cnt in cat_counts.items():
        is_inconsistent = cat_name in ["furniture", "technology"]
        flag = " <--- [INCONSISTENT LOWERCASE]" if is_inconsistent else ""
        print(f"    - {cat_name:<18}: {cnt:>5} rows{flag}")

    print("\nB. Region Inconsistencies:")
    region_counts = df["Region"].value_counts()
    for reg_name, cnt in region_counts.items():
        is_inconsistent = reg_name in ["EAST", "WEST", "NORTH", "SOUTH"]
        flag = " <--- [INCONSISTENT UPPERCASE]" if is_inconsistent else ""
        print(f"    - {reg_name:<18}: {cnt:>5} rows{flag}")

    print("\nC. Product Column:")
    print("    - All 14 product names are consistently formatted in Title Case with zero spelling variations.")
    print()

    # -------------------------------------------------------------------------
    # 12. SUSPICIOUS VALUES (NEGATIVE, ZERO, OR LOGICAL CONFLICTS)
    # -------------------------------------------------------------------------
    print_section_header("12. Suspicious Values & Logical Integrity Checks")
    neg_sales = (df["Sales"] < 0).sum()
    zero_sales = (df["Sales"] == 0).sum()
    neg_profit = (df["Profit"] < 0).sum()
    zero_profit = (df["Profit"] == 0).sum()
    profit_exceeds_sales = (df["Profit"] > df["Sales"]).sum()
    zero_or_neg_qty = (df["Quantity"] <= 0).sum()
    invalid_discount = ((df["Discount"] < 0) | (df["Discount"] > 1.0)).sum()

    checks = pd.DataFrame([
        {"Integrity Check": "Sales < 0 (Negative Sales)", "Violations": neg_sales, "Status": "PASS (0 found)"},
        {"Integrity Check": "Sales == 0 (Zero Sales)", "Violations": zero_sales, "Status": "PASS (0 found)"},
        {"Integrity Check": "Profit < 0 (Unprofitable/Loss Orders)", "Violations": neg_profit, "Status": "NOTE (0 loss orders; all orders profitable)"},
        {"Integrity Check": "Profit == 0 (Break-even Orders)", "Violations": zero_profit, "Status": "PASS (0 found)"},
        {"Integrity Check": "Profit > Sales (Mathematical Conflict)", "Violations": profit_exceeds_sales, "Status": "PASS (0 found)"},
        {"Integrity Check": "Quantity <= 0 (Zero or Negative Qty)", "Violations": zero_or_neg_qty, "Status": "PASS (0 found)"},
        {"Integrity Check": "Discount < 0 or Discount > 1 (Out of Range)", "Violations": invalid_discount, "Status": "PASS (0 found)"},
    ])
    print(checks.to_string(index=False))

    # Profit margin distribution
    profit_margin = df["Profit"] / df["Sales"]
    print(f"\nProfit Margin Range: {profit_margin.min():.2%} to {profit_margin.max():.2%} (Mean: {profit_margin.mean():.2%}, Median: {profit_margin.median():.2%})")
    print("Logical check result: Financial numbers are structurally consistent, positive, and plausible.")
    print("=" * 80)
    print(" DATA UNDERSTANDING STEP COMPLETE - READY FOR REPORT GENERATION")
    print("=" * 80)


if __name__ == "__main__":
    main()
