describe('Disable debug mode', () => {
    it('Disables debug mode through the console', () => {
        cy.visit('https://lenoradev.com')
        cy.window().then(win => win.disableDebuggingMode())
        cy.get('[data-cy="debugModeStatus"]').should('not.be.visible')
    })
})