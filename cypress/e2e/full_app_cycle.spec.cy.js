describe('Full App Cycle', () => {
    it('Uploads a csv file, sends a list to geocod.io, then downloads and processes the results', () => {
        /*
         * Load and verify the Test URL
         */
        cy.visit(Cypress.env('test_url'))
        cy.contains('Geocode Test App')

        /*
         * Enable and verify debugging mode, set the geocode.io API key, then ensure
         * the app is using the supplied key instead of the default one
         */
        cy.window().then(win => win.enableDebuggingMode())
        cy.window().then(win => win.setGeoAPIKey(Cypress.env('api_key')))
        cy.get('[data-cy="geoAPIKey"]').should('have.value', Cypress.env('api_key'))
        cy.get('[data-cy="debugModeStatus"]').should('be.visible')

        /*
         * Store the table info divs for later use
         */
        cy.get('#csvResultsTable_info').as('csvTableInfo')
        cy.get('#geoResultsTable_info').as('resultsTableInfo')

        /*
         * Attach the specified CSV file from the fixtures folder to the file input control
         */
        cy.get('[data-cy="csvUpload"]').attachFile(Cypress.env('csv_file'))

        /*
         * Submit the CSV file. This does several things:
         *
         * First, the app will process the CSV results, storing them in an internal array.
         * If a problem is encountered during processing, the app's error message will be sent
         * directly to the Cypress command log (via spy), and the API call will not be made, which
         * will cause the next assertion to fail.
         * 
         * If the CSV processing is successful, the app will construct a list and initiate the
         * call to geocod.io's LISTS endpoint and send it. If that API call fails, the next 
         * assertion will fail, but the error in the command log will state what went wrong, and where.
         */
        cy.get('[data-cy="btnListSubmit"]').click()

        /*
         * This is the next assertion mentioned above. If this passes, that guarantees both
         * the internal CSV processing and the initial API call to send the list were successful.
         * 
         * The app will only display this table once those two things happen. We will make our assertion
         * on the specified number of expected entries against how many are actually in the table
         */
        cy.get('@csvTableInfo').should('contain.text', "of " + Cypress.env('expected_entries') + " entries")

        /*
         * At this point, geocode.io has the list and will be geocoding the addresses.
         * That process is done pretty quickly, but the test allows changing the wait time to allot for CSV
         * files with a large number of addresses.
         * 
         * We want to give geocod.io enough time to process the list before querying the endpoint, because
         * the test must make the assumption that it is ready for download, since we do not control
         * their API and cannot handle varied wait times. Especially when we are dealing with milliseconds for
         * just 2 or 3 addresses.
         * 
         * Therefore, we'll wait a sufficient amount of time before clicking the button to Check Status, which
         * will also begin the download process. The app could have a separate button for downloading that only
         * becomes enabled once geocod.io gives the Completed message, but that would be a little tedious
         * for the user experience, which is also being considered for this demo.
         */
        cy.wait(Cypress.env('list_wait_time')).get('[data-cy="btnListStatus"]').click()

        /*
         * Clicking the button above will cause the app to download the finished results from geocod.io and
         * begin processing them. The lat/lng/accuracy fields will be added to the corresponding addresses
         * in the existing array. Once that is complete, a new table will be displayed that shows the final
         * results.
         * 
         * The assertion will check that the results in the table match the expected_entries
         */
        cy.get('@resultsTableInfo').should('have.text', "Showing 1 to 3 of 3 entries")

        /*
         * Lastly, we will check to make sure the app has put itself in its finished state, which means no
         * other errors have been encountered.
         */
        cy.get('#blockStep3').should('be.visible')
    })
})