import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as TicketsActions from './tickets.actions';
import { TicketsEntity } from './tickets.models';

export const TICKETS_FEATURE_KEY = 'tickets';

export interface State extends EntityState<TicketsEntity> {
  loaded: boolean; // has the Tickets list been loaded
  selectedId?: number | null; // which Tickets record has been selected
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
});
ticketsAdapter.setOne
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
  on(TicketsActions.loadTicketsFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(TicketsActions.enterPage, (state) => ({
    ...state,
    selectedId: null,
  })),
  on(TicketsActions.createTicket, (state, { ticket }) => ticketsAdapter.addOne(ticket, state)),
  on(TicketsActions.viewTicketDetails, (state, { ticketId }) => ({
    ...state,
    selectedId: ticketId
  }))

  );

export function reducer(state: State | undefined, action: Action) {
  return ticketsReducer(state, action);
}
