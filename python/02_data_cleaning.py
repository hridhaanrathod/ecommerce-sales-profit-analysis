"""
================================================================================
PROJECT: Retail Sales Analysis - Portfolio Project
STEP 02: Data Cleaning & Preprocessing Pipeline
FILE: python/02_data_cleaning.py
================================================================================
Description:
    This beginner-friendly Python script performs the complete data cleaning
    pipeline on 'sales_analysis_raw.csv' and exports the sanitized dataset
    to 'data/sales_analysis_cleaned.csv'.

Key Guidelines Followed:
    * The original dataset 'sales_analysis_raw.csv' is NEVER modified or overwritten.
    * Only genuine duplicates are removed; no other rows are dropped.
    * Missing Customer (20) and City (15) entries are imputed with 'Unknown'
      to preserve transaction integrity without fabricating data.
    * Text and categorical columns are normalized (casing, whitespace).
    * Numerical columns and primary keys are strictly validated.
    * The code is structured and heavily commented for interview explanation.

Author: Data Analyst Portfolio
================================================================================
"""

import os
import pandas as pd


def get_file_paths():
    """
    Locates the input raw CSV and defines the destination path for cleaned CSV,
    supporting execution from both project root and the python/ directory.
    """
    candidate_inputs = [
        "sales_analysis_raw.csv",
        os.path.join("..", "sales_analysis_raw.csv"),
        os.path.join(os.path.dirname(__file__), "..", "sales_analysis_raw.csv")
    ]
    raw_path = None
    for path in candidate_inputs:
        if os.path.exists(path):
            raw_path = os.path.abspath(path)
            break

    if not raw_path:
        raise FileNotFoundError(
            "Could not locate 'sales_analysis_raw.csv'. Please check file placement."
        )

    # Determine project root directory from raw file location
    project_root = os.path.dirname(raw_path)
    data_dir = os.path.join(project_root, "data")
    cleaned_path = os.path.join(data_dir, "sales_analysis_cleaned.csv")

    return raw_path, data_dir, cleaned_path


def print_step_header(step_num, title):
    """Utility to print distinct, professional section headers."""
    print("=" * 80)
    print(f" STEP {step_num}: {title.upper()}")
    print("=" * 80)


def main():
    raw_csv_path, data_dir, cleaned_csv_path = get_file_paths()

    # -------------------------------------------------------------------------
    # 1. LOAD RAW DATA
    # -------------------------------------------------------------------------
    print_step_header(1, "Load Raw Data")
    print(f"Loading raw dataset from:\n  {raw_csv_path}")
    df_raw = pd.read_csv(raw_csv_path)
    
    # Keep an untampered copy for before/after comparison
    df = df_raw.copy()
    raw_rows, raw_cols = df.shape
    print(f"Raw Dataset Loaded Successfully: {raw_rows:,} rows, {raw_cols} columns\n")

    # -------------------------------------------------------------------------
    # 2. REMOVE EXACT DUPLICATE ROWS
    # -------------------------------------------------------------------------
    print_step_header(2, "Remove Exact Duplicate Rows")
    duplicates_before = df.duplicated().sum()
    print(f"Duplicate rows detected in raw dataset: {duplicates_before}")
    
    # Remove exact duplicate rows (keeps the first occurrence)
    df = df.drop_duplicates().copy()
    
    cleaned_rows = len(df)
    duplicates_after = df.duplicated().sum()
    print(f"Rows after removing duplicates        : {cleaned_rows:,}")
    print(f"Remaining duplicate rows              : {duplicates_after}")
    
    # Verification assertions
    assert raw_rows == 5010, f"Expected 5,010 raw rows, got {raw_rows}"
    assert cleaned_rows == 5000, f"Expected 5,000 cleaned rows, got {cleaned_rows}"
    assert duplicates_after == 0, f"Expected 0 duplicate rows remaining, got {duplicates_after}"
    print("[VERIFIED] Exact duplicate removal validated: 5,010 -> 5,000 rows (0 duplicates remaining).\n")

    # -------------------------------------------------------------------------
    # 3. CONVERT ORDER_DATE TO DATETIME
    # -------------------------------------------------------------------------
    print_step_header(3, "Convert Order_Date to Datetime Datatype")
    raw_date_dtype = str(df["Order_Date"].dtype)
    print(f"Original Order_Date data type: {raw_date_dtype}")
    
    # Convert string dates to pandas datetime objects
    df["Order_Date"] = pd.to_datetime(df["Order_Date"], format="%Y-%m-%d", errors="coerce")
    
    invalid_dates_count = df["Order_Date"].isnull().sum()
    print(f"Converted Order_Date data type : {df['Order_Date'].dtype}")
    print(f"Invalid / Unparseable dates     : {invalid_dates_count}")
    assert invalid_dates_count == 0, f"Detected {invalid_dates_count} invalid dates!"
    print(f"Date Span Verified             : {df['Order_Date'].min().strftime('%Y-%m-%d')} to {df['Order_Date'].max().strftime('%Y-%m-%d')}")
    print("[VERIFIED] Order_Date successfully converted with 0 invalid records.\n")

    # -------------------------------------------------------------------------
    # 4. STANDARDIZE CATEGORY
    # -------------------------------------------------------------------------
    print_step_header(4, "Standardize Category Capitalization")
    print("Category distribution before standardization:")
    print(df["Category"].value_counts().to_string())
    
    # Map lowercase entries to standardized Title Case
    category_mapping = {
        "furniture": "Furniture",
        "technology": "Technology"
    }
    df["Category"] = df["Category"].replace(category_mapping)
    
    # Verify expected categories
    expected_categories = {"Technology", "Office Supplies", "Furniture"}
    actual_categories = set(df["Category"].unique())
    print("\nCategory distribution after standardization:")
    print(df["Category"].value_counts().to_string())
    assert actual_categories == expected_categories, f"Unexpected categories: {actual_categories}"
    print(f"[VERIFIED] Category standardized to exactly {len(actual_categories)} departments: {sorted(list(actual_categories))}\n")

    # -------------------------------------------------------------------------
    # 5. STANDARDIZE REGION
    # -------------------------------------------------------------------------
    print_step_header(5, "Standardize Region Capitalization")
    print("Region distribution before standardization:")
    print(df["Region"].value_counts().to_string())
    
    # Map uppercase entries to standard Title Case
    region_mapping = {
        "EAST": "East",
        "WEST": "West",
        "NORTH": "North",
        "SOUTH": "South"
    }
    df["Region"] = df["Region"].replace(region_mapping)
    
    # Verify expected regions
    expected_regions = {"East", "West", "North", "South"}
    actual_regions = set(df["Region"].unique())
    print("\nRegion distribution after standardization:")
    print(df["Region"].value_counts().to_string())
    assert actual_regions == expected_regions, f"Unexpected regions: {actual_regions}"
    print(f"[VERIFIED] Region standardized to exactly {len(actual_regions)} zones: {sorted(list(actual_regions))}\n")

    # -------------------------------------------------------------------------
    # 6. HANDLE MISSING CUSTOMER VALUES
    # -------------------------------------------------------------------------
    print_step_header(6, "Handle Missing Customer Values")
    missing_customers_before = df["Customer"].isnull().sum()
    print(f"Missing Customer count before treatment: {missing_customers_before}")
    
    # Impute missing customers with 'Unknown'
    # Rationale: Preserves order revenue & product stats without inventing false identities
    df["Customer"] = df["Customer"].fillna("Unknown")
    missing_customers_after = df["Customer"].isnull().sum()
    unknown_customer_records = (df["Customer"] == "Unknown").sum()
    
    print(f"Missing Customer count after treatment : {missing_customers_after}")
    print(f"Records labeled 'Unknown'             : {unknown_customer_records}")
    assert missing_customers_after == 0, "Customer column still has nulls!"
    assert unknown_customer_records == missing_customers_before, "Unknown count mismatch!"
    print("[VERIFIED] Missing customer values safely imputed as 'Unknown'.\n")

    # -------------------------------------------------------------------------
    # 7. HANDLE MISSING CITY VALUES
    # -------------------------------------------------------------------------
    print_step_header(7, "Handle Missing City Values")
    missing_cities_before = df["City"].isnull().sum()
    print(f"Missing City count before treatment   : {missing_cities_before}")
    
    # Impute missing cities with 'Unknown'
    # Rationale: Customer purchases span multiple cities; guessing would distort geographic analysis
    df["City"] = df["City"].fillna("Unknown")
    missing_cities_after = df["City"].isnull().sum()
    unknown_city_records = (df["City"] == "Unknown").sum()
    
    print(f"Missing City count after treatment    : {missing_cities_after}")
    print(f"Records labeled 'Unknown'             : {unknown_city_records}")
    assert missing_cities_after == 0, "City column still has nulls!"
    assert unknown_city_records == missing_cities_before, "Unknown count mismatch!"
    print("[VERIFIED] Missing city values safely imputed as 'Unknown'.\n")

    # -------------------------------------------------------------------------
    # 8. CLEAN TEXT FIELDS (WHITESPACE & EMPTY STRINGS)
    # -------------------------------------------------------------------------
    print_step_header(8, "Clean Text Fields (Whitespace & Empty Strings)")
    text_columns = ["Customer", "Category", "Product", "Region", "City"]
    for col in text_columns:
        # Strip leading and trailing whitespace
        df[col] = df[col].astype(str).str.strip()
        
        # Check for accidental empty strings
        empty_count = (df[col] == "").sum()
        assert empty_count == 0, f"Found {empty_count} empty strings in column '{col}'!"
        print(f"  - '{col:<10}': Whitespace stripped, 0 empty strings found.")
    print("[VERIFIED] All text attributes cleaned of whitespace anomalies.\n")

    # -------------------------------------------------------------------------
    # 9. VALIDATE NUMERIC COLUMNS
    # -------------------------------------------------------------------------
    print_step_header(9, "Validate Numeric Columns")
    print("Verifying business logic constraints:")
    
    # 1. Quantity >= 1
    qty_valid = (df["Quantity"] >= 1).all()
    print(f"  1. Quantity >= 1               : {qty_valid} (Min: {df['Quantity'].min()}, Max: {df['Quantity'].max()})")
    assert qty_valid, "Quantity validation failed!"
    
    # 2. Discount between 0 and 0.30
    disc_valid = ((df["Discount"] >= 0.0) & (df["Discount"] <= 0.30)).all()
    print(f"  2. Discount between 0 and 0.30 : {disc_valid} (Min: {df['Discount'].min()}, Max: {df['Discount'].max()})")
    assert disc_valid, "Discount validation failed!"
    
    # 3. Sales > 0
    sales_valid = (df["Sales"] > 0).all()
    print(f"  3. Sales > 0 (Gross Revenue)   : {sales_valid} (Min: INR {df['Sales'].min():.2f}, Max: INR {df['Sales'].max():,.2f})")
    assert sales_valid, "Sales validation failed!"
    
    # 4. Profit > 0
    profit_valid = (df["Profit"] > 0).all()
    print(f"  4. Profit > 0 (Positive Return): {profit_valid} (Min: INR {df['Profit'].min():.2f}, Max: INR {df['Profit'].max():,.2f})")
    assert profit_valid, "Profit validation failed!"
    
    # 5. Profit <= Sales
    profit_bound_valid = (df["Profit"] <= df["Sales"]).all()
    print(f"  5. Profit <= Sales             : {profit_bound_valid}")
    assert profit_bound_valid, "Profit exceeds sales!"
    print("[VERIFIED] All numeric columns strictly adhere to expected business constraints.\n")

    # -------------------------------------------------------------------------
    # 10. VALIDATE ORDER_ID INTEGRITY
    # -------------------------------------------------------------------------
    print_step_header(10, "Validate Order_ID Integrity")
    total_order_ids = len(df["Order_ID"])
    unique_order_ids = df["Order_ID"].nunique()
    duplicate_order_ids = df["Order_ID"].duplicated().sum()
    
    print(f"Total Order_ID entries : {total_order_ids:,}")
    print(f"Unique Order_ID count  : {unique_order_ids:,}")
    print(f"Duplicate Order_IDs    : {duplicate_order_ids}")
    
    assert total_order_ids == 5000, f"Expected 5,000 order IDs, got {total_order_ids}"
    assert unique_order_ids == 5000, f"Expected 5,000 unique order IDs, got {unique_order_ids}"
    assert duplicate_order_ids == 0, f"Expected 0 duplicate order IDs, got {duplicate_order_ids}"
    print("[VERIFIED] Primary key 'Order_ID' is 100% unique across all 5,000 orders.\n")

    # -------------------------------------------------------------------------
    # SAVE CLEANED DATASET
    # -------------------------------------------------------------------------
    print_step_header(11, "Save Cleaned Dataset to CSV")
    # Ensure target directory exists
    os.makedirs(data_dir, exist_ok=True)
    
    # Format Order_Date cleanly as YYYY-MM-DD string for CSV persistence
    df_to_save = df.copy()
    df_to_save["Order_Date"] = df_to_save["Order_Date"].dt.strftime("%Y-%m-%d")
    
    df_to_save.to_csv(cleaned_csv_path, index=False)
    print(f"Cleaned dataset successfully written to:\n  {cleaned_csv_path}")
    print(f"Saved file dimensions: {df_to_save.shape[0]:,} rows x {df_to_save.shape[1]} columns\n")

    # -------------------------------------------------------------------------
    # BEFORE VS AFTER COMPARISON SUMMARY
    # -------------------------------------------------------------------------
    print("=" * 80)
    print(" DATA CLEANING AUDIT: BEFORE vs AFTER COMPARISON")
    print("=" * 80)
    audit_table = pd.DataFrame([
        {"Metric": "Rows", "Before": f"{raw_rows:,}", "After": f"{len(df):,}"},
        {"Metric": "Duplicate rows", "Before": f"{duplicates_before}", "After": f"{duplicates_after}"},
        {"Metric": "Missing Customer", "Before": f"{missing_customers_before}", "After": "0 (20 labeled 'Unknown')"},
        {"Metric": "Missing City", "Before": f"{missing_cities_before}", "After": "0 (15 labeled 'Unknown')"},
        {"Metric": "Category unique values", "Before": f"{df_raw['Category'].nunique()} raw", "After": f"{df['Category'].nunique()}"},
        {"Metric": "Region unique values", "Before": f"{df_raw['Region'].nunique()} raw", "After": f"{df['Region'].nunique()}"},
        {"Metric": "Order_Date data type", "Before": "object (string)", "After": "datetime64[ns]"},
        {"Metric": "Invalid dates", "Before": "0", "After": "0"},
        {"Metric": "Unique Order_IDs", "Before": f"{df_raw['Order_ID'].nunique():,}", "After": f"{df['Order_ID'].nunique():,}"},
    ])
    print(audit_table.to_string(index=False))
    print("=" * 80)
    print(" CLEANING PIPELINE COMPLETED SUCCESSFULLY")
    print(f" Cleaned CSV Path: {cleaned_csv_path}")
    print("=" * 80)


if __name__ == "__main__":
    main()
