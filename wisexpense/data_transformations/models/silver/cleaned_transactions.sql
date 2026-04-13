{{ config(materialized='table') }}

WITH raw AS (
    SELECT *
    FROM bronze_layer.raw_transactions
)
SELECT 
    transaction_id,
    COALESCE(merchant_name, name) AS merchant,
    name AS original_name,
    CAST(amount AS DOUBLE) AS amount,
    CAST(date AS DATE) AS transaction_date,
    CAST(authorized_date AS DATE) AS authorized_date,
    payment_channel,
    iso_currency_code,
    CAST(pending AS BOOLEAN) AS is_pending,
    
    -- Extract category from the stringified dict.
    -- Python dictionary is stringified using `str()`, so it looks like `{'primary': 'FOOD_AND_DRINK', 'detailed': '...'}`
    -- We'll use regex to extract the primary category value.
    COALESCE(
        regexp_extract(personal_finance_category, '''primary'[^'"]+['"]([^'"]+)['"]', 1),
        'UNCATEGORIZED'
    ) AS category
    
FROM raw
WHERE transaction_id IS NOT NULL
