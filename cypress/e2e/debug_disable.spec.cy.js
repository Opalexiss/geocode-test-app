describe('Disable debug mode', () => {
    it('Disables debug mode through the console', () => {
        cy.visit(Cypress.env('test_url'))
        cy.contains('Geocode Test App')
        cy.window().then(win => win.disableDebuggingMode())
        cy.get('[data-cy="debugModeStatus"]').should('not.be.visible')
    })
})