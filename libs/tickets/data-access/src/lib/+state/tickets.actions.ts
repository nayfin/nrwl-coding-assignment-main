import { Ticket } from '@acme/shared-models';
import { createAction, props } from '@ngrx/store';
import { NewTicketForm, TicketsEntity } from './tickets.models';

export const init = createAction('[Tickets/API] Init');

export const loadTicketsSuccess = createAction(
  '[Tickets/API] Load Tickets Success',
  props<{ tickets: TicketsEntity[] }>()
);

export const loadTicketsFailure = createAction(
  '[Tickets/API] Load Tickets Failure',
  props<{ error: any }>()
);

export const createTicketSuccess = createAction(
  '[Tickets/API] Create Ticket Success',
  props<{ ticket: Ticket }>()
);

export const createTicketFailure = createAction(
  '[Tickets/API] Create Ticket Failure',
  props<{ error: any }>()
);

export const assignTicketSuccess = createAction(
  '[Tickets/API] Assign Ticket Success',
  props<{ ticketId: number, assigneeId: number }>()
);

export const assignTicketFailure = createAction(
  '[Tickets/API] Assign Ticket Failure',
  props<{ error: any }>()
);

export const completeTicketSuccess = createAction(
  '[Tickets/API] Complete Tickets Success',
  props<{ ticketId: number, completed: boolean }>()
);

export const completeTicketFailure = createAction(
  '[Tickets/API] Complete Tickets Failure',
  props<{ error: any }>()
);

export const enterTicketsPage = createAction('[Tickets Page] Enter');
export const createTicket = createAction('[Tickets Page] Create Ticket', props<{ticket: NewTicketForm}>());
export const filterTickets = createAction('[Tickets Page] Filter Tickets', props<{ticketId: number}>());
export const enterDetailsPage = createAction('[Ticket Details Page] Enter', props<{ticketId: number}>());
export const assignTicket = createAction('[Ticket Details Page] Assign Ticket', props<{ticketId: number, assigneeId: number}>());
export const completeTicket = createAction('[Ticket Details Page] Complete Ticket', props<{ticketId: number, completed: boolean}>());
