describe('Full App Cycle', () => {
    it('Uploads a csv file, sends a list to geocod.io, then downloads and processes the results', () => {
        cy.visit('https://lenoradev.com')
            // Set the geocod.io api key with the one in cypress.env.json
        cy.window().then(win => win.setGeoAPIKey(Cypress.env('api_key')))
            // Enable the app's debugging mode
        cy.window().then(win => win.enableDebuggingMode())
            // Save the csv results table info div as a var to reference later
        cy.get('#csvResultsTable_info').as('csvTableInfo')
            // Save the geo results table info div as a var to reference later
        cy.get('#geoResultsTable_info').as('resultsTableInfo')
            // Attach the test_addresses.csv from the fixtures folder to file input control
        cy.get('[data-cy="csvUpload"]').attachFile('test_addresses.csv')
            // Submit the CSV file and begin processing the addresses
        cy.get('[data-cy="btnListSubmit"]').click()
            // Once processing is complete, the results table should be displaying exactly 3 rows
        cy.get('@csvTableInfo').should('have.text', "Showing 1 to 3 of 3 entries")
            // Wait 5 seconds to give geocod.io enough time to process the list, then click the Get Status button
        cy.wait(5000).get('[data-cy="btnListStatus"]').click()
            // Confirm that geocod.io returned 3 results and they are displayed in the final table
        cy.get('@resultsTableInfo').should('have.text', "Showing 1 to 3 of 3 entries")
            // Make sure the app's finalState() function was fired and the final table is now visible
        cy.get('#blockStep3').should('be.visible')
    })
})