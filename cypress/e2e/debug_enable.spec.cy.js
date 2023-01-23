describe('Enable debug mode', () => {
    it('Enables debug mode through the console', () => {
        cy.visit(Cypress.env('test_url'))
        cy.contains('Geocode Test App')
        cy.window().then(win => win.enableDebuggingMode())
        cy.get('[data-cy="debugModeStatus"]').should('be.visible')
    })
})