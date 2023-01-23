describe('App is online', () => {
    it('Loads the app and locates the header', () => {
        cy.visit(Cypress.env('test_url'))
        cy.contains('Geocode Test App')
    })
})