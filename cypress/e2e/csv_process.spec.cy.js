describe('CSV File Process', () => {
    it('Uploads a csv file and checks the results', () => {
        cy.visit('https://lenoradev.com')
            // Set the geocod.io api key with the one in cypress.env.json
        cy.window().then(win => win.setGeoAPIKey(Cypress.env('api_key')))
            // Enable the app's debugging mode
        cy.window().then(win => win.enableDebuggingMode())
            // Save the csv results table info div as a var to reference later
        cy.get('#csvResultsTable_info').as('tableInfo')
            // Attach the test_addresses.csv from the fixtures folder to file input control
        cy.get('[data-cy="csvUpload"]').attachFile('test_addresses.csv')
            // Submit the CSV file and begin processing the addresses
        cy.get('[data-cy="btnListSubmit"]').click()
            // Once processing is complete, the results table should be displaying exactly 3 rows
        cy.get('@tableInfo').should('have.text', "Showing 1 to 3 of 3 entries")
    })
})