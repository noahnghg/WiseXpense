{{ config(materialized='table') }}

WITH cleaned AS (
    SELECT *
    FROM {{ ref('cleaned_transactions') }}
)
SELECT 
    transaction_date AS spend_date,
    SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) AS total_expenses,
    SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) AS total_income,
    COUNT(*) AS transaction_count
FROM cleaned
GROUP BY 1
ORDER BY 1 DESC
