require 'watir'
require 'webdrivers'

# Configure the test URL (adjust if your dev server runs on a different port)
BASE_URL = 'http://localhost:3000'
LOGIN_PATH = '/login'

# Test credentials (replace with valid test user credentials)
TEST_EMAIL = 'testuser@example.com'
TEST_PASSWORD = 'Password123!'

browser = Watir::Browser.new :chrome, headless: true
begin
  # Navigate to the login page
  browser.goto "#{BASE_URL}#{LOGIN_PATH}"

  # Wait for the email input to be present
  browser.text_field(type: 'email').wait_until(&:present?)

  # Fill in credentials
  browser.text_field(type: 'email').set TEST_EMAIL
  browser.text_field(type: 'password').set TEST_PASSWORD

  # Submit the form
  browser.button(type: 'submit').click

  # Wait for navigation after login (adjust selector based on post-login UI)
  # Here we assume a heading with text 'Dashboard' appears after successful login
  browser.h1(text: /Dashboard/i).wait_until(timeout: 10, &:present?)

  puts 'Login test passed: Dashboard loaded.'
rescue => e
  puts "Login test failed: #{e.message}"
ensure
  browser.close
end
