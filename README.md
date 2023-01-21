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

## App Debug Mode

Debug mode will provide verbose status messages and payload data in the browser's console after API calls and other functions have been executed. Any errors will be routed to the console as well. When debug mode is disabled, errors will be displayed using alerts instead.

When the **Get List Status** button is clicked, the app will check a hidden input field for the flag that is set upload HTML load/reload. This flag is usually set to 1. 

Debug mode can be changed at *any time* by calling these functions from the browser's console. Please note that if you do this, the setting **will** persist through page loads. This is because browsers will populate form fields with their previous values.

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

Once you have selected your CSV file, you can then click the **Submit CSV Data and Send Request** button.

----

### Step 2. Wait for geocod.io to process data and fetch results

1. The app will process the CSV file and build its internal collection of addresses, preparing them to send to geocod.io.
2. The hidden **#appDebugMode** input will be checked. If its value == 1, the app's debug mode will be enabled (displaying a message in the footer).
3. The app will call geocode.io's LISTS endpoint and supply all of the loaded addresses as a single list for processing. geocod.io will return a List ID.
4. These addresses will also be displayed in a table for reference.

You can now click the **Get List Status and Display Results** button.

----

### Step 3. View geocoded address results

1. The LISTS endpoint is queried using the stored List ID to check on its processing status.
2. If processing has not yet completed, the button's text will be updated with the approximate remaining time, and can be clicked again.
3. When processing is complete, the app will download all of the processed results from geocod.io.
4. These results are then parsed, saving the new latitude/longitude/accuracy data into the original collection of addresses.
5. The final results table is then displayed. Geocoding errors (if any) will be marked with a red error icon in the Label column. This table also provides links to view the lat/lng coordinates in Google Maps.

If debug mode is enabled, the full appData object will be dumped to the console, allowing you to view config fields and each address record in its entirety.

*Created by Lenora Chase*