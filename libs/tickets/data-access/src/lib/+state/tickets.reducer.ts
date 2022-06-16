import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as TicketsActions from './tickets.actions';
import { TicketsEntity, StatusOptions } from './tickets.models';

export const TICKETS_FEATURE_KEY = 'tickets';

export interface State extends EntityState<TicketsEntity> {
  selectedId?: number | null; // which Tickets record has been selected
  filter: StatusOptions[];
  loaded: boolean; // has the Tickets list been loaded
  creatingTicket: boolean;
  error?: string | null; // last known error (if any)
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
  filter: []
});

const ticketsReducer = createReducer(
  initialState,
  on(TicketsActions.init, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(TicketsActions.loadTicketsSuccess, (state, { tickets }) =>
    ticketsAdapter.setAll(tickets, { ...state, loaded: true })
  ),
  on(TicketsActions.filterTickets, (state, { filter }) =>({ ...state, filter })
  ),
  on(TicketsActions.assignTicketSuccess, (state, {ticketId, assigneeId}) =>
    ticketsAdapter.updateOne( {id: ticketId, changes: {assigneeId} }, state)
  ),
  on(TicketsActions.completeTicketSuccess, (state, {ticketId, completed}) =>
    ticketsAdapter.updateOne( {id: ticketId, changes: {completed} }, state)
  ),
  on(
    TicketsActions.loadTicketsFailure,
    TicketsActions.assignTicketFailure,
    TicketsActions.completeTicketFailure,
    (state, { error }) => ({
    ...state,
    error,
  })),
  on(TicketsActions.enterTicketsPage, (state) => ({
    ...state,
    selectedId: null,
  })),
  on(TicketsActions.createTicket, (state) => ({...state, creatingTicket: true})),
  on(TicketsActions.createTicketSuccess, (state, { ticket }) => ticketsAdapter.addOne(ticket, {...state, creatingTicket: false})),
  on(TicketsActions.createTicketFailure, (state, {error}) => ({...state, error, creatingTicket: false})),
  on(TicketsActions.enterDetailsPage, (state, { ticketId }) => ({
    ...state,
    selectedId: ticketId
  }))

  );

export function reducer(state: State | undefined, action: Action) {
  return ticketsReducer(state, action);
}
