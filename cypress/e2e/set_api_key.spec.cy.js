describe('Set geocod.io API key', () => {
    it('Sets the API key through the console and checks it', () => {
        cy.visit(Cypress.env('test_url'))
        cy.contains('Geocode Test App')
        cy.window().then(win => win.setGeoAPIKey(Cypress.env('api_key')))
        cy.get('[data-cy="geoAPIKey"]')
            .should('have.value', Cypress.env('api_key'))
    })
})