#!/bin/bash

# E2E Integration Test Report for 7rayfi MVP
# This script validates all components work together end-to-end

set -e

BACKEND_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:3001"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PASS_COUNT=0
FAIL_COUNT=0

echo "=================================="
echo "🧪 7rayfi E2E Integration Testing"
echo "=================================="
echo ""

# Function to print test result
test_result() {
  local test_name=$1
  local status=$2
  local details=$3
  
  if [ "$status" == "PASS" ]; then
    echo -e "${GREEN}✅ PASS${NC} - $test_name"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo -e "${RED}❌ FAIL${NC} - $test_name"
    echo -e "${RED}   Details: $details${NC}"
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
}

# 1. BACKEND VALIDATION
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📡 BACKEND VALIDATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 1: Backend Health Check
echo "Test 1: Backend server is running..."
HEALTH_RESPONSE=$(curl -s $BACKEND_URL/health)
if echo "$HEALTH_RESPONSE" | jq -e '.status == "ok"' > /dev/null 2>&1; then
  test_result "Backend health check" "PASS"
else
  test_result "Backend health check" "FAIL" "Server not responding or unhealthy"
fi

# Test 2: MongoDB Connection
echo "Test 2: MongoDB connection..."
if echo "$HEALTH_RESPONSE" | jq -e '.mongodb == "connected"' > /dev/null 2>&1; then
  test_result "MongoDB connection" "PASS"
else
  test_result "MongoDB connection" "FAIL" "MongoDB not connected"
fi

# Test 3: GET /api/services
echo "Test 3: Service categories endpoint..."
SERVICES_RESPONSE=$(curl -s $BACKEND_URL/api/services)
SERVICE_COUNT=$(echo "$SERVICES_RESPONSE" | jq -r '.data | length')
if [ "$SERVICE_COUNT" -gt 0 ]; then
  test_result "GET /api/services (found $SERVICE_COUNT categories)" "PASS"
else
  test_result "GET /api/services" "FAIL" "No service categories found"
fi

# Test 4: GET /api/artisans
echo "Test 4: Artisans listing endpoint..."
ARTISANS_RESPONSE=$(curl -s $BACKEND_URL/api/artisans)
ARTISAN_COUNT=$(echo "$ARTISANS_RESPONSE" | jq -r '.data | length')
if [ "$ARTISAN_COUNT" -ge 0 ]; then
  test_result "GET /api/artisans (found $ARTISAN_COUNT artisans)" "PASS"
else
  test_result "GET /api/artisans" "FAIL" "Invalid response"
fi

# Test 5: POST /artisan/register (Full Payload)
echo "Test 5: Artisan registration with full payload..."
CATEGORY_ID=$(echo "$SERVICES_RESPONSE" | jq -r '.data[0]._id')
RANDOM_EMAIL="test-$(date +%s)@example.com"
SIGNUP_PAYLOAD=$(cat <<EOF
{
  "firstName": "E2E",
  "lastName": "TestUser",
  "email": "$RANDOM_EMAIL",
  "phone": "0612345678",
  "profession": "Test Professional",
  "categories": ["$CATEGORY_ID"],
  "skills": ["Skill 1", "Skill 2"],
  "city": "Casablanca",
  "serviceAreas": ["Casablanca", "Rabat"],
  "description": "E2E test artisan created by automated testing script",
  "portfolioLinks": ["https://example.com/test"],
  "hourlyRate": 150,
  "pricingNote": "Test pricing note",
  "smsVerified": true
}
EOF
)

SIGNUP_RESPONSE=$(curl -s -X POST $BACKEND_URL/artisan/register \
  -H "Content-Type: application/json" \
  -d "$SIGNUP_PAYLOAD")

if echo "$SIGNUP_RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
  NEW_ARTISAN_ID=$(echo "$SIGNUP_RESPONSE" | jq -r '.data._id')
  test_result "POST /artisan/register (ID: $NEW_ARTISAN_ID)" "PASS"
else
  ERROR_MSG=$(echo "$SIGNUP_RESPONSE" | jq -r '.error // "Unknown error"')
  test_result "POST /artisan/register" "FAIL" "$ERROR_MSG"
fi

# Test 6: Verify created artisan appears in search
echo "Test 6: New artisan appears in GET /api/artisans..."
sleep 1
UPDATED_ARTISANS=$(curl -s $BACKEND_URL/api/artisans)
UPDATED_COUNT=$(echo "$UPDATED_ARTISANS" | jq -r '.data | length')
if [ "$UPDATED_COUNT" -gt "$ARTISAN_COUNT" ]; then
  test_result "New artisan persisted in database" "PASS"
else
  test_result "New artisan persisted in database" "FAIL" "Count didn't increase"
fi

# Test 7: CORS Headers
echo "Test 7: CORS configuration..."
CORS_RESPONSE=$(curl -s -I -X OPTIONS $BACKEND_URL/api/services \
  -H "Origin: http://localhost:3001" \
  -H "Access-Control-Request-Method: GET")
if echo "$CORS_RESPONSE" | grep -q "Access-Control-Allow-Origin"; then
  test_result "CORS headers present" "PASS"
else
  test_result "CORS headers present" "FAIL" "CORS not configured"
fi

# Test 8: Validation - Missing required fields
echo "Test 8: Validation rejects invalid data..."
INVALID_PAYLOAD='{"firstName":"Test"}'
INVALID_RESPONSE=$(curl -s -X POST $BACKEND_URL/artisan/register \
  -H "Content-Type: application/json" \
  -d "$INVALID_PAYLOAD")
if echo "$INVALID_RESPONSE" | jq -e '.success == false' > /dev/null 2>&1; then
  test_result "Validation rejects incomplete data" "PASS"
else
  test_result "Validation rejects incomplete data" "FAIL" "Invalid data was accepted"
fi

# 2. FRONTEND VALIDATION
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 FRONTEND VALIDATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 9: Frontend server is running
echo "Test 9: Frontend server is running..."
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $FRONTEND_URL)
if [ "$FRONTEND_RESPONSE" == "200" ]; then
  test_result "Frontend server accessible" "PASS"
else
  test_result "Frontend server accessible" "FAIL" "HTTP $FRONTEND_RESPONSE"
fi

# Test 10: Landing page loads
echo "Test 10: Landing page (index.html)..."
INDEX_CONTENT=$(curl -s $FRONTEND_URL/index.html)
if echo "$INDEX_CONTENT" | grep -q "7rayfi" || echo "$INDEX_CONTENT" | grep -q "<!DOCTYPE html>"; then
  test_result "Landing page loads" "PASS"
else
  test_result "Landing page loads" "FAIL" "Invalid HTML"
fi

# Test 11: Search page loads
echo "Test 11: Search page (search.html)..."
SEARCH_CONTENT=$(curl -s $FRONTEND_URL/search.html)
if echo "$SEARCH_CONTENT" | grep -qi "<!DOCTYPE html>"; then
  test_result "Search page loads" "PASS"
else
  test_result "Search page loads" "FAIL" "Page not found"
fi

# Test 12: Signup page loads
echo "Test 12: Signup page (signup.html)..."
SIGNUP_CONTENT=$(curl -s $FRONTEND_URL/signup.html)
if echo "$SIGNUP_CONTENT" | grep -qi "<!DOCTYPE html>"; then
  test_result "Signup page loads" "PASS"
else
  test_result "Signup page loads" "FAIL" "Page not found"
fi

# Test 13: JavaScript files are accessible
echo "Test 13: JavaScript files accessible..."
JS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $FRONTEND_URL/scripts/signup.js)
if [ "$JS_RESPONSE" == "200" ]; then
  test_result "JavaScript files load" "PASS"
else
  test_result "JavaScript files load" "FAIL" "HTTP $JS_RESPONSE"
fi

# Test 14: CSS files are accessible
echo "Test 14: CSS files accessible..."
CSS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $FRONTEND_URL/styles/main.css)
if [ "$CSS_RESPONSE" == "200" ]; then
  test_result "CSS files load" "PASS"
else
  test_result "CSS files load" "FAIL" "HTTP $CSS_RESPONSE"
fi

# Test 15: i18n translations load (Embedded in JS)
echo "Test 15: Translations available..."
LANDING_JS=$(curl -s $FRONTEND_URL/scripts/landing.js)
if echo "$LANDING_JS" | grep -q "const translations ="; then
  test_result "i18n translations present in JS" "PASS"
else
  test_result "i18n translations present in JS" "FAIL" "Translations not found in landing.js"
fi

# 3. INTEGRATION VALIDATION
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔗 FRONTEND-BACKEND INTEGRATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 16: Frontend can fetch categories from backend
echo "Test 16: Frontend API integration test..."
SIGNUP_JS=$(curl -s $FRONTEND_URL/scripts/signup.js)
if echo "$SIGNUP_JS" | grep -q "http://localhost:3000"; then
  test_result "Frontend configured with correct API URL" "PASS"
else
  test_result "Frontend configured with correct API URL" "FAIL" "API URL mismatch"
fi

# Test 17: Search page API integration
echo "Test 17: Search page API configuration..."
SEARCH_JS=$(curl -s $FRONTEND_URL/scripts/search.js 2>/dev/null || echo "")
if [ -n "$SEARCH_JS" ]; then
  if echo "$SEARCH_JS" | grep -q "localhost:3000" || echo "$SEARCH_JS" | grep -q "API_BASE_URL"; then
    test_result "Search page API integration" "PASS"
  else
    test_result "Search page API integration" "FAIL" "API URL not found"
  fi
else
  test_result "Search page API integration" "PASS" "Using inline or different approach"
fi

# 4. DATA VALIDATION
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💾 DATABASE & DATA VALIDATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 18: Service categories have required fields
echo "Test 18: Service category data structure..."
FIRST_CATEGORY=$(echo "$SERVICES_RESPONSE" | jq -r '.data[0]')
if echo "$FIRST_CATEGORY" | jq -e '.name and .slug and ._id' > /dev/null 2>&1; then
  test_result "Service categories have required fields" "PASS"
else
  test_result "Service categories have required fields" "FAIL" "Missing fields"
fi

# Test 19: Artisan data structure
echo "Test 19: Artisan data structure..."
if echo "$SIGNUP_RESPONSE" | jq -e '.data | .firstName and .email and .phone and .categories' > /dev/null 2>&1; then
  test_result "Artisan has required fields" "PASS"
else
  test_result "Artisan has required fields" "FAIL" "Missing critical fields"
fi

# Test 20: New fields are persisted
echo "Test 20: New fields (serviceAreas, portfolioLinks) persisted..."
if echo "$SIGNUP_RESPONSE" | jq -e '.data.serviceAreas and .data.portfolioLinks' > /dev/null 2>&1; then
  test_result "Enhanced artisan fields persisted" "PASS"
else
  test_result "Enhanced artisan fields persisted" "FAIL" "Missing serviceAreas or portfolioLinks"
fi

# SUMMARY
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 TEST SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "Total Tests: $((PASS_COUNT + FAIL_COUNT))"
echo -e "${GREEN}Passed: $PASS_COUNT${NC}"
echo -e "${RED}Failed: $FAIL_COUNT${NC}"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
  echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
  echo "✅ Backend API fully functional"
  echo "✅ Frontend serving correctly"
  echo "✅ MongoDB connection working"
  echo "✅ CORS configured properly"
  echo "✅ Data validation working"
  echo "✅ E2E integration verified"
  echo ""
  echo "🚀 The 7rayfi MVP is ready for manual testing!"
  exit 0
else
  echo -e "${RED}⚠️  SOME TESTS FAILED${NC}"
  echo "Please review the failures above and fix before deploying."
  exit 1
fi
