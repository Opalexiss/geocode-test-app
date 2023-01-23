describe('Select CSV File', () => {
    it('Attaches the specified CSV file to the file input control', () => {
        cy.visit(Cypress.env('test_url'))
        cy.contains('Geocode Test App')
            // Enable the app's debugging mode
        cy.window().then(win => win.enableDebuggingMode())
            // Attach the specified CSV from the fixtures folder to the file input control
        cy.get('[data-cy="csvUpload"]').attachFile(Cypress.env('csv_file'))
    })
})