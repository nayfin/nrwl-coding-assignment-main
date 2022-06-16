import { createAction, props } from '@ngrx/store';
import { TicketsEntity } from './tickets.models';

export const init = createAction('[Tickets Page] Init');

export const loadTicketsSuccess = createAction(
  '[Tickets/API] Load Tickets Success',
  props<{ tickets: TicketsEntity[] }>()
);

export const loadTicketsFailure = createAction(
  '[Tickets/API] Load Tickets Failure',
  props<{ error: any }>()
);

export const enterTicketsPage = createAction('[Tickets Page] Enter');
export const createTicket = createAction('[Tickets Page] Create Ticket', props<{ticket: TicketsEntity}>());
export const enterDetailsPage = createAction('[Ticket Details Page] Enter', props<{ticketId: number}>());
export const filterTickets = createAction('[Tickets Page] Filter Tickets', props<{ticketId: number}>());