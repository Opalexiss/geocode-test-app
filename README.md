# Geocode Test App

A client-side JS app for testing geocod.io API functionality and automation with Cypress.

## Flow

```mermaid
flowchart TD;
A[Load CSV]-->B[Send List to geocod.io];
B[Send List to geocode.io]-->C[Check processing status];
C[Check processing status]-->D[Download completed data];
D[Download completed data]-->E[Process results];
E[Process results]-->F[Display results in a table]
```
*Pro tip: All of the JS code in index.html is very well-documented!*

## geocod.io API Key

For demonstration purposes, the app is set to use an API key belonging to Lenora Chase.

The API key **can** be set at runtime by the user, and by automated tests. Your geocod.io API key needs to have the POST and GET permissions enabled for the LISTS endpoint.

If you manually set the API key, it *should* persist through page refreshes, although that isn't guaranteed since it is based on your browser's handling of form input caching. If you do not want to manually set the key for every app instance, simply edit the index.html file and locate the geoAPIKey input on line #31. Then, replace the value with your own key and the app will default to using it instead.

In your browser's developer console, use the following command to manually set an API key:
```
setGeoAPIKey(api_key)
```

This is an exposed function so it can be called from tests as well.


## App Debug Mode

Debug mode will provide verbose status messages and payload data in the browser's console after API calls and other functions have been executed. Any errors will be routed to the console as well. When debug mode is disabled, errors will be displayed using alerts instead.

When the **Get List Status** button is clicked, the app will check a hidden input field for the flag that is set upload HTML load/reload. This flag is usually set to 1. 

Debug mode can be changed at *any time* by calling these functions from the browser's console. If you manually enable/disable debugging, then that setting will persist through page reloads. Otherwise, the default setting will follow what is set in the hidden input.

```
enableDebuggingMode();
```
and
```
disableDebuggingMode();
```

Regardless of whether debug mode is enabled or not, you can have the app dump its full appData configuration object and address collection data into the console at any time by calling this function:
```
displayAppData();
```

----

### Step 1. Load addresses from CSV and send to geocod.io

Start with a .csv containing some locations to check. The csv must comma-delimited, without any of the fields wrapped in quotes. Quotes will not be stripped from the data and will cause problems with the data that is returned from geocod.io. Do not include a header row, only the addresses to be looked up.

Use this format for your CSV file:
```
Label,Address 1,Address 2,City,State,Zip
```

| Field | Description |
|-------|-------------|
| Label | This is a nickname for the location, such as **Home** or **Work**. This field is optional and may be left blank. |
| Address 1 | This is a combination of street name and number, ie **123 Anywhere St.** or **3129 S. Douglas Fir Drive**. |
| Address 2 | Suites, office numbers, spaces, and apartment numbers are optional and do not affect geocoding. |
| City | The city name must be spelled out and not abbreviated. Use **Salt Lake City** instead of **SLC**. |
| State | Both the app and geocode.io expect a two-character abbreviated state, such as **NM** or **MD**. |
| Zip | At the very minimum, a standard zip/postal code must be supplied. Zip+4 codes are supported and optional. |

Example rows:
```
Home,123 Anywhere St.,,Nowheresville,CA,94123
,3129 S. Douglas Fir Drive,Ste 456,Salt Lake City,UT,84116
```
*Remember: Do **not** include a header row in your CSV file!*

Once you have browsed for and selected the file, you can then click the **Submit CSV Data and Send Request** button.

----

### Step 2. Wait for geocod.io to process data and fetch results

1. The app will process the CSV file and build its internal collection of addresses, preparing them to send to geocod.io.
2. The hidden **#appDebugMode** input will be checked. If its value == 1, the app's debug mode will be enabled (displaying a message in the footer).
3. If an API key has not been manually set through the console, the default key stored on line #31 of index.html file be used.
4. The app will call geocode.io's LISTS endpoint and supply all of the loaded addresses as a single list for processing. geocod.io will return a List ID.
5. These addresses will be displayed in a table for reference.

You can now click the **Get List Status and Display Results** button.

----

### Step 3. View geocoded address results

1. The LISTS endpoint is queried using the stored List ID to check on its processing status.
2. If processing has not yet completed, the button's text will be updated with the approximate remaining time, and can be clicked again.
3. When processing is complete, the app will download all of the processed results from geocod.io.
4. These results are then parsed, saving the new latitude/longitude/accuracy data into the original collection of addresses.
5. The final results table is then displayed. Geocoding errors (if any) will be marked with a red error icon in the Label column. This table also provides links to view the lat/lng coordinates in Google Maps.

If debug mode is enabled, the full appData object will be dumped to the console, allowing you to view config fields and each address record in its entirety.

----

### Dependencies

While the core logic is written in pure JS/HTML (no templating or frameworks), several libraries are used for enhnaced viewing and QoL improvements.

* **jQuery** - Used to simplify ajax calls/error handling, array iteration, and tidy up strings. The code can be refactored to omit its usage and would still work in the same way.
* **DataTables** - For prettier tables with extra functionality such as pagination, search, and column sorting. The app's code handles writing data to the tables before they are rendered by this library.
* **Modernizr** - This can be used to detect browser support for the native HTML 5 file input/upload control, and was added for this reason. However, the app is currently performing this check on its own to reduce dependencies for demonstration purposes.
* **FontAwesome** - Icons and button loading animations.
* **Google Fonts** - For the Roboto, Arial, sans-serif font family.

----

## Test Automation with Cypress

![Cypress Testing](https://lenoradev.com/img/cypress_run.png)

Eight tests were written and included in the repo. Because this is a very simple application without much interaction, most of the tests are to ensure the app's exposed functions are working correctly.

The most important test is **full_app_cycle.spec.cy.js** which tests everything from start to finish and validates the geocod.io API calls. In a real world use case, much more detailed assertions would be made against the data itself, not just the API calls and data transfers.

To run these tests locally, there a few steps. The primary one, which you may already be familiar with, is installing Cypress and all of its dependencies. Node_modules is not included in the repository.

After cloning/downloading the repo to your local machine, navigate to the root project directory in a terminal window and execute:
```
npm install
```

Next, you will need to create your local Cypress environment variables file. This is also not included in the repo because it will be used to store your geocod.io api key for testing, so the contents of this file could be different for everyone.

In your terminal window, execute:
```
touch cypress.env.json
```
Then, open the newly created cypress.env.json file and add the following content before saving and closing:
```
{
    "api_key": "your_api_key_goes_here_in_the_quotes"
}
```
Your geocod.io api key must have POST and GET permissions enabled for the LISTS endpoint. If you do not have a key, you can <a href="https://dash.geocod.io/apikey" target="_blank">get one here</a>. If you are in a hurry, you can *borrow* my key, which is on line #31 of index.html.

Now you are ready to run the tests! You can do that using the Cypress desktop app, or by using the following in your terminal:
```
npx cypress run
```

By default, these tests will be run against a temporary production environment I have set up at https://lenoradev.com, which will eventually be taken offline. You can change the url to another installation, or your local environment, by modifying the cy.visit command at the beginning of each test.

Next, I will go over some manual test cases.

----

*Geocode Test App created by Lenora Chase on Jan 20th, 2023. Cypress test suite added Jan 21st.*