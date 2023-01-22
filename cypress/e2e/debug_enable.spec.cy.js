describe('Enable debug mode', () => {
    it('Enables debug mode through the console', () => {
        cy.visit('https://lenoradev.com')
        cy.window().then(win => win.enableDebuggingMode())
        cy.get('[data-cy="debugModeStatus"]').should('be.visible')
    })
})