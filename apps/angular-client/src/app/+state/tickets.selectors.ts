import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TICKETS_FEATURE_KEY, State, ticketsAdapter } from './tickets.reducer';

// Lookup the 'Tickets' feature state managed by NgRx
export const getTicketsState =
  createFeatureSelector<State>(TICKETS_FEATURE_KEY);

const { selectAll, selectEntities } = ticketsAdapter.getSelectors();

export const getTicketsLoaded = createSelector(
  getTicketsState,
  (state: State) => state.loaded
);

export const getCreatingTicket = createSelector(
  getTicketsState,
  (state: State) => state.creatingTicket
);

export const getTicketsError = createSelector(
  getTicketsState,
  (state: State) => state.error
);

export const getAllTickets = createSelector(getTicketsState, (state: State) =>
  selectAll(state)
);

export const getTicketsEntities = createSelector(
  getTicketsState,
  (state: State) => selectEntities(state)
);

export const getTicketsFilter = createSelector(
  getTicketsState,
  (state: State) => state.filter
);

export const getFilteredTickets = createSelector(
  getAllTickets,
  getTicketsFilter,
  (unfilteredTickets, filter) => {
    // return all tickets if not filtering
    if (!filter.status?.length) return unfilteredTickets;
    // else filter them by status
    return unfilteredTickets.filter((ticket) => {
      return (filter.status.includes('complete') && ticket.completed)
      || (filter.status.includes('incomplete') && !ticket.completed)
    })
  }
);

export const getSelectedId = createSelector(
  getTicketsState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getTicketsEntities,
  getSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
