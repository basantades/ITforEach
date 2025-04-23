
describe('ITforEach - Home Page', () => {
  it('debería cargar la página principal y mostrar el título', () => {
    cy.visit('/');
    cy.contains('Únete a ITforEach y comparte tus proyectos').should('be.visible');
  });
});
