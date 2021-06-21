# Uptime_Monitoring
Node App to check if the website is up or down
##How to use
1. SignUp with real Email through http://localhost:3000/signup Endpoint
2. Open Email and click link sent to You to Verify the Account.
3. Login through http://localhost:3000/login Endpoint and Get the bearer Token.
4. Create new Check through Post request to localhost:3000/check Endpoint (Use Auth Token from Login).
  - Edit Check throuh Put request to localhost:3000/check (Use Auth Token from Login).
  - Delete Check through Delete request to localhost:3000/check (Use Auth Token from Login).
5. Run Check through localhost:3000/check/(checkName) (Use Auth Token from Login).
6. Run Group of Check with the same Tag through localhost:3000/check/bulk/(TagName) (Use Auth Token from Login).
##Models
1- ###Users
  - **name** : The name of the User (Optional).
  - **email** : Email of the User.
  - **password** : Password for the User.
2- ###Check
  - **name** : the Name of The Check.
  - **url** : The URL to be monitored.
  - **tag** : A list of the check tags (optional).
  - **ignoreSSL** : A flag to ignore broken/expired SSL certificates in case of using the HTTPS protocol (optional).
  - **port** : The server port number (optional).
  - **webhook** :  (defaults to https://webhook.site/e8224a85-21d6-4aff-889c-21dae8a6d548) A webhook URL to receive a notification on (optional).
  - **interval** : (defaults to 15 mins) The time interval for polling requests (optional).
  - **config.intervalUnits** : time unit you want your Monitor to use. milliseconds, seconds, minutes (default), and hours.
