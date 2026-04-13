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
    
    -- Extract category from the stringified dict. Since it was stringified, we can do a simple extraction if necessary, 
    -- but usually DuckDB's json extract or string parsing is needed. 
    -- Because pandas dicts stringified look like `{'primary': 'FOOD_AND_DRINK', 'detailed': 'FOOD_AND_DRINK_COFFEE'}`
    -- we can use robust regex, or since it's an MVP, let's just grab the whole string for now or do a generic replace.
    personal_finance_category
    
FROM raw
WHERE transaction_id IS NOT NULL
