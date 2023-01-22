describe('Manual debug mode enable', () => {
    it('Enables debug mode through the form input and checks the result', () => {
        cy.visit('https://lenoradev.com')
            // Set the debugMode flag to 0 using the hidden input
        cy.get('[data-cy="appDebugMode"]')
            .invoke('val', '1')
            // Click the submit button. We are only interested in the debug message visibility, not any errors
        cy.get('[data-cy="btnListSubmit"]').click()
        cy.get('[data-cy="debugModeStatus"]').should('be.visible')
    })
})