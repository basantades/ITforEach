describe('Flujo público de navegación', () => {
    it('Explorar proyectos y visitar ficha del creador', () => {
      // 1. Ir a la home
      cy.visit('/');
  
      // 2. Hacer clic en "Descubre proyectos" en la navbar
      cy.contains('Descubre proyectos').click();
  
      // 3. Verificar que se está en discover y aparece el texto esperado
      cy.url().should('include', '/discover');
      cy.contains('Descubre nuevos Proyectos');
  
      // 4. Buscar y hacer clic en el proyecto "S7.-StarWars-Angular"
      cy.contains('S7.-StarWars-Angular').click();
  
      // 5. Verificar que estamos en la URL del proyecto
      cy.url().should('include', '/basantades/S7.-StarWars-Angular');
  
      // 6. Hacer clic en el autor "basantades"
      cy.contains('a', 'basantades') // solo <a> que contenga "basantades"
      .should('have.attr', 'href', '/basantades') // verifica el destino
      .click();
        
      // 7. Verificar que estamos en la página del autor
      cy.url().should('include', '/basantades');
    });
  });
  