import { Ticket } from "@acme/shared-models";
import { ticketItem } from '../support/app.po';

const ticketsUrl = '/api/tickets'

// TODO: this should be a fixture
const testTicket: Ticket = {
  id: 12,
  description: 'A Best Ticket',
  assigneeId: null,
  completed: false
}

describe('angular-client', () => {
  beforeEach(() => cy.visit('/'));

  it('create a new ticket', () => {
    cy.get('.mat-input-element').type('A Test Ticket');
    cy.intercept({method: 'POST', url: ticketsUrl}, testTicket).as('createTicket');
    cy.get('button.mat-button').click();
    cy.wait('@createTicket').then(() => {
      ticketItem().last().should('contain', testTicket.description);
    });
  });

  it('should got to a tickets details when the details button is clicked', () => {
    cy.intercept({method: 'GET', url: `${ticketsUrl}/1`}).as('goToDetails');

    ticketItem().first().find('a').click();
    cy.wait('@goToDetails').then(() => {
      cy.url().should('contain', '/ticket/1');
    });
  });
});
