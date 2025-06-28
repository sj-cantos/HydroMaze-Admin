const url = "http://localhost:4000/"


Cypress.Commands.add('login', (username, password) => {
  cy.visit('http://localhost:4000/login'); // Adjust if your login route is different
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});
describe('Admin Login', () => {
  
  it('should show error on invalid credentials', () => {
    cy.visit(url + 'login');
    cy.get('input[name="username"]').type('wronguser');
    cy.get('input[name="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();
    cy.contains('Username or password incorrect').should('be.visible');
  });

  it('should sign in with valid credentials', () => {
    cy.login('admin', 'password'); // Use the custom command
    cy.url().should('not.include', '/login');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('authToken')).to.exist;
    });
  });
});

describe('Dashboard Page', () => {
  beforeEach(() => {
    cy.login('admin', 'password');
    // Wait for redirect after login
    cy.url().should('not.include', '/login');
  });

  it('should load the dashboard and display key elements', () => {
    // If your dashboard is at /dashboard, use:
    // cy.visit(url + 'dashboard');
    // If it's at /, use:
    cy.visit(url);

    // Wait for the dashboard heading to appear
    cy.contains('DASHBOARD', { timeout: 10000 }).should('exist');
    cy.get('[data-testid="orders-today"]', { timeout: 10000 }).should('exist');
  });
});