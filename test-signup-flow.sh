#!/bin/bash

# Script to test the artisan signup flow end-to-end

echo "🧪 Testing Artisan Signup API Flow"
echo "===================================="
echo ""

API_URL="http://localhost:3000/artisan/register"

# Get a valid category ID
echo "📂 Step 1: Getting valid category ID..."
CATEGORY_ID=$(curl -s http://localhost:3000/api/services | jq -r '.data[0]._id')
echo "✅ Category ID: $CATEGORY_ID"
echo ""

# Test 1: Validation Error
echo "🧪 Test 1: Validation Error (missing required fields)"
echo "------------------------------------------------------"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "T",
    "lastName": "U"
  }')

SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
ERROR=$(echo "$RESPONSE" | jq -r '.error')
DETAILS_COUNT=$(echo "$RESPONSE" | jq '.details | length')

if [ "$SUCCESS" = "false" ] && [ "$ERROR" = "Données invalides" ]; then
  echo "✅ PASS: Returns validation error with $DETAILS_COUNT validation issues"
else
  echo "❌ FAIL: Expected validation error"
fi
echo ""

# Test 2: Invalid Category
echo "🧪 Test 2: Invalid Category ID"
echo "-------------------------------"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test-invalid-cat@example.com",
    "phone": "0612345679",
    "profession": "Plombier",
    "categories": ["000000000000000000000001"],
    "city": "Casablanca",
    "skills": ["test"],
    "description": "Test"
  }')

ERROR=$(echo "$RESPONSE" | jq -r '.error')

if echo "$ERROR" | grep -q "catégories sont invalides"; then
  echo "✅ PASS: Returns invalid category error"
else
  echo "❌ FAIL: Expected invalid category error, got: $ERROR"
fi
echo ""

# Test 3: Successful Registration
echo "🧪 Test 3: Successful Registration"
echo "-----------------------------------"
RANDOM_EMAIL="test$(date +%s)@example.com"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"firstName\": \"Test\",
    \"lastName\": \"User\",
    \"email\": \"$RANDOM_EMAIL\",
    \"phone\": \"0612345679\",
    \"profession\": \"Plombier\",
    \"categories\": [\"$CATEGORY_ID\"],
    \"city\": \"Casablanca\",
    \"skills\": [\"test1\", \"test2\"],
    \"description\": \"Test description\",
    \"hourlyRate\": 150,
    \"smsVerified\": true
  }")

SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
ARTISAN_ID=$(echo "$RESPONSE" | jq -r '.data._id')
MESSAGE=$(echo "$RESPONSE" | jq -r '.message')

if [ "$SUCCESS" = "true" ] && [ ! -z "$ARTISAN_ID" ] && [ "$ARTISAN_ID" != "null" ]; then
  echo "✅ PASS: Artisan created successfully with ID: $ARTISAN_ID"
  echo "   Message: $MESSAGE"
else
  echo "❌ FAIL: Expected successful registration"
  echo "   Response: $RESPONSE"
fi
echo ""

# Test 4: Duplicate Email
echo "🧪 Test 4: Duplicate Email"
echo "--------------------------"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"firstName\": \"Test\",
    \"lastName\": \"User\",
    \"email\": \"$RANDOM_EMAIL\",
    \"phone\": \"0612345671\",
    \"profession\": \"Plombier\",
    \"categories\": [\"$CATEGORY_ID\"],
    \"city\": \"Casablanca\",
    \"skills\": [\"test\"],
    \"description\": \"Test\"
  }")

ERROR=$(echo "$RESPONSE" | jq -r '.error')

if echo "$ERROR" | grep -q "email existe déjà"; then
  echo "✅ PASS: Returns duplicate email error"
else
  echo "❌ FAIL: Expected duplicate email error, got: $ERROR"
fi
echo ""

# Test 5: CORS Headers
echo "🧪 Test 5: CORS Headers"
echo "-----------------------"
CORS_RESPONSE=$(curl -s -I -X OPTIONS "$API_URL" \
  -H "Origin: http://localhost:3001" \
  -H "Access-Control-Request-Method: POST")

if echo "$CORS_RESPONSE" | grep -q "Access-Control-Allow-Origin"; then
  echo "✅ PASS: CORS headers present"
else
  echo "⚠️  WARNING: CORS headers might not be configured"
fi
echo ""

echo "===================================="
echo "✅ Test suite completed!"
echo "===================================="
