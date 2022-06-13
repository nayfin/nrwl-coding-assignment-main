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

export const enterPage = createAction('[Tickets Page] Enter');
export const createTicket = createAction('[Tickets Page] Create Ticket', props<{ticket: TicketsEntity}>());
export const viewTicketDetails = createAction('[Tickets Page] View Ticket Details', props<{ticketId: number}>());
export const filterTickets = createAction('[Tickets Page] Filter Tickets', props<{ticketId: number}>());