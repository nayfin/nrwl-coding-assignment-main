import { Injectable } from '@angular/core';
import { createSelector, select, Store } from '@ngrx/store';

import * as TicketsActions from './tickets.actions';
import { NewTicketForm, StatusOptions, TicketUI } from './tickets.models';
import * as TicketsFeature from './tickets.reducer';
import * as TicketsSelectors from './tickets.selectors';

// import * as UsersSelectors from '@acme/users/data-access';
import { getUsersEntities, UsersFacade } from '@acme/users/data-access';
import { Observable } from 'rxjs';


export const getTicketsUI = createSelector(
  TicketsSelectors.getAllTickets,
  getUsersEntities,
  (tickets, users) => {
    return tickets.map(ticket => {
      const assigneeName = ticket.assigneeId && users[ticket.assigneeId]?.name || null
      return {
      ...ticket,
      assigneeName
      }
    })
  }
);

export const getFilteredTickets = createSelector(getTicketsUI, TicketsSelectors.getTicketsFilter, (tickets, filter) => {
  if (!filter?.length) return tickets;
  // else filter them by status
  return tickets.filter((ticket) => {
    return (filter.includes('complete') && ticket.completed)
    || (filter.includes('incomplete') && !ticket.completed)
  })
});



@Injectable()
export class TicketsFacade {
  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(TicketsSelectors.getTicketsLoaded));
  allTickets$ = this.store.pipe(select(TicketsSelectors.getAllTickets));
  ticketsFilter$ = this.store.pipe(select(TicketsSelectors.getTicketsFilter));
  filteredTickets$: Observable<TicketUI[]> = this.store.pipe(select(getFilteredTickets));

  selectedTicket$ = this.store.pipe(select(TicketsSelectors.getSelected));
  creatingTicket$ = this.store.pipe(select(TicketsSelectors.getCreatingTicket));

  constructor(
    private readonly store: Store,
    usersFacade: UsersFacade
  ) {
    this.init();
    usersFacade.init();
  }

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(TicketsActions.init());
  }

  enterTicketsPage() {
    this.store.dispatch(TicketsActions.enterTicketsPage())
  }

  enterDetailsPage(ticketId: number) {
    this.store.dispatch(TicketsActions.enterDetailsPage({ticketId}))
  }

  assignTicket(ticketId: number, assigneeId: number) {
    this.store.dispatch(TicketsActions.assignTicket({ticketId, assigneeId}))
  }

  completeTicket(ticketId: number, completed: boolean) {
    this.store.dispatch(TicketsActions.completeTicket({ticketId, completed}))
  }

  createTicket(ticket: NewTicketForm) {
    this.store.dispatch(TicketsActions.createTicket({ticket}));
  }

  filterTickets(filter: StatusOptions[]) {
    this.store.dispatch(TicketsActions.filterTickets({filter}));
  }

}
