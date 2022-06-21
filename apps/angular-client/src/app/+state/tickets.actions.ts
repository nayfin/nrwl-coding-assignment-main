import { Ticket } from '@acme/shared-models';
import { createAction, props } from '@ngrx/store';
import { TicketsEntity, TicketsFilter } from './tickets.models';

/**
 * Page Actions
 */
export const ticketsPageInit = createAction('[Tickets Page] Init');
export const submitTicket = createAction('[Tickets Page] Submit Ticket', props<Pick<TicketsEntity, 'description'>>());
export const updateTicketsFilter = createAction('[Tickets Page] Update Tickets Filter', props<TicketsFilter>());
export const ticketDetailsPageInit = createAction('[Ticket Details Page] Init', props<{ticketId: number}>() );
export const submitTicketUpdate = createAction('[Ticket Details Page] Submit Ticket Update',  props<{ticketId: number, assigneeId: number, completed: boolean}>());

/**
 * API Actions
 */
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

export const updateTicketSuccess = createAction(
  '[Tickets/API] Update Ticket Success',
  props<{ ticketId: number, assigneeId: number, completed: boolean }>()
);

export const updateTicketFailure = createAction(
  '[Tickets/API] Update Ticket Failure',
  props<{ error: any }>()
);

