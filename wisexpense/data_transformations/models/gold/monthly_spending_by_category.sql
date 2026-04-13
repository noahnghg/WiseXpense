{{ config(materialized='table') }}

WITH cleaned AS (
    SELECT *
    FROM {{ ref('cleaned_transactions') }}
)
SELECT 
    date_trunc('month', transaction_date) AS spend_month,
    category,
    SUM(amount) AS total_amount,
    COUNT(*) AS transaction_count
FROM cleaned
-- Only include expenses (positive amounts in Plaid represent money leaving account, but depend on setup. Usually positive is expense, negative is refund/income)
WHERE amount > 0 
GROUP BY 1, 2
ORDER BY 1 DESC, 3 DESC
