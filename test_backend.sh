#!/bin/bash
echo "Testing Register..."
curl -v -X POST http://localhost:8080/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Script User", "email":"script@example.com", "password":"password123"}' > register_output.txt 2>&1

echo "\nTesting Login..."
curl -v -X POST http://localhost:8080/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"script@example.com", "password":"password123"}' > login_output.txt 2>&1

echo "Done."
