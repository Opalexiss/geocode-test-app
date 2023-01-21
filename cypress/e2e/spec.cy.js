describe('App is online', () => {
    it('Loads the app and locates the header', () => {
        cy.visit('https://lenoradev.com')
        cy.contains('Geocode Test App')
    })
})