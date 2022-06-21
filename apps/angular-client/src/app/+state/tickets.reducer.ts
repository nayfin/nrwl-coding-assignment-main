import { state } from '@angular/animations';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as TicketsActions from './tickets.actions';
import { StatusOptions, TicketsEntity } from './tickets.models';

export const TICKETS_FEATURE_KEY = 'tickets';

export interface State extends EntityState<TicketsEntity> {
  selectedId?: string | number; // which Tickets record has been selected
  creatingTicket: boolean;
  loaded: boolean; // has the Tickets list been loaded
  error?: string | null; // last known error (if any)
  filter: {
    status: StatusOptions[];
  }
}

export interface TicketsPartialState {
  readonly [TICKETS_FEATURE_KEY]: State;
}

export const ticketsAdapter: EntityAdapter<TicketsEntity> =
  createEntityAdapter<TicketsEntity>();

export const initialState: State = ticketsAdapter.getInitialState({
  // set initial required properties
  loaded: false,
  creatingTicket: false,
  filter: {
    status: []
  }
});

const ticketsReducer = createReducer(
  initialState,
  on(TicketsActions.ticketsPageInit, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(TicketsActions.ticketDetailsPageInit, (state, {ticketId}) => ({...state, selectedId: ticketId })),
  on(TicketsActions.loadTicketsSuccess, (state, { tickets }) =>
    ticketsAdapter.setAll(tickets, { ...state, loaded: true })
  ),
  on(TicketsActions.submitTicket, (state) => ({...state, creatingTicket: true})),
  on(TicketsActions.updateTicketsFilter, (state, {status}) => ({...state, filter: {status}})),
  on(TicketsActions.createTicketSuccess, (state, { ticket }) => ticketsAdapter.addOne(ticket, {...state, creatingTicket: false})),
  on(TicketsActions.assignTicketSuccess, (state, { ticketId, userId}) => ticketsAdapter.updateOne({id: ticketId, changes: {assigneeId: userId}}, state)),
  on(TicketsActions.completeTicketSuccess, (state, { ticketId, completed}) => ticketsAdapter.updateOne({id: ticketId, changes: {completed}}, state)),
  on(
    TicketsActions.loadTicketsFailure,
    TicketsActions.assignTicketFailure,
    TicketsActions.completeTicketFailure,
    TicketsActions.createTicketFailure,
    (state, { error }) => ({
      ...state,
      error,
    })
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return ticketsReducer(state, action);
}
