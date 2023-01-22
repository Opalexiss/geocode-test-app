describe('Set geocod.io API key', () => {
    it('Sets the API key through the console and checks it', () => {
        cy.visit('https://lenoradev.com')
        cy.window().then(win => win.setGeoAPIKey(Cypress.env('api_key')))
        cy.get('[data-cy="geoAPIKey"]')
            .should('have.value', Cypress.env('api_key'))
    })
})