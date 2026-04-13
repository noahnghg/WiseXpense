{{ config(materialized='table') }}

WITH cleaned AS (
    SELECT *
    FROM {{ ref('cleaned_transactions') }}
    WHERE is_pending = false AND amount > 0
)
SELECT 
    DATE_TRUNC('month', transaction_date) AS spend_month,
    personal_finance_category,
    COUNT(transaction_id) AS transaction_count,
    SUM(amount) AS total_spend
FROM cleaned
GROUP BY 1, 2
ORDER BY 1 DESC, total_spend DESC
