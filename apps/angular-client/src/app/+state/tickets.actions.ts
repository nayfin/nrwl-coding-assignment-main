import { Ticket } from '@acme/shared-models';
import { createAction, props } from '@ngrx/store';
import { TicketsEntity, TicketsFilter } from './tickets.models';

export const ticketsPageInit = createAction('[Tickets Page] Init');
export const submitTicket = createAction('[Tickets Page] Submit Ticket', props<{ updateTicket: Pick<Ticket, 'description'> }>() );
export const filterTickets = createAction('[Tickets Page] Filter Tickets', props<{filter: TicketsFilter}>());
export const ticketDetailsPageInit = createAction('[Tickets Details Page] Init');
export const submitTicketUpdate = createAction('[Tickets Details Page] Submit Ticket Update');

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
  props<{ tickets: TicketsEntity }>()
);

export const createTicketFailure = createAction(
  '[Tickets/API] Create Ticket Failure',
  props<{ error: any }>()
);

export const updateTicketSuccess = createAction(
  '[Tickets/API] Update Ticket Success',
  props<{ tickets: TicketsEntity[] }>()
);

export const updateTicketFailure = createAction(
  '[Tickets/API] Update Ticket Failure',
  props<{ error: any }>()
);