import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { filter, map, withLatestFrom } from 'rxjs/operators';

import * as TicketsActions from './tickets.actions';
import * as TicketsFeature from './tickets.reducer';
import { Store } from '@ngrx/store';
import * as TicketSelectors from './tickets.selectors';
import { TicketsApiService } from '../api/tickets-api.service';

@Injectable()
export class TicketsEffects {
  // enterTicketPages$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(TicketsActions.enterTicketsPage, TicketsActions.enterDetailsPage),
  //     withLatestFrom(this.store.select(TicketSelectors.getTicketsLoaded)),
  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     filter(([_payload, isLoaded]) => !isLoaded),
  //     map(() => TicketsActions.init())
  //   )
  // );

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketsActions.init),
      withLatestFrom(this.store.select(TicketSelectors.getTicketsLoaded)),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      filter(([_payload, isLoaded]) => !isLoaded),
      map(([payload]) => payload),
      fetch({
        run: () => {
          return this.ticketsApi.tickets().pipe(
            map((tickets) => TicketsActions.loadTicketsSuccess({ tickets }))
          );
        },
        onError: (_action, error) => {
          console.error('Error', error);
          return TicketsActions.loadTicketsFailure({ error });
        },
      })
    )
  );

  createTicket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketsActions.createTicket),
      fetch({
        run: ({ticket}) => {
          return this.ticketsApi.newTicket(ticket).pipe(
            map((response) => TicketsActions.createTicketSuccess({ ticket: response }))
          );
        },
        onError: (_action, error) => {
          console.error('Error', error);
          return TicketsActions.createTicketFailure({ error });
        },
      })
    )
  );

  assignTicket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketsActions.assignTicket),
      fetch({
        run: ({ticketId, assigneeId}) => {
          return this.ticketsApi.assign(ticketId, assigneeId).pipe(
            map(() => TicketsActions.assignTicketSuccess({ ticketId, assigneeId }))
          );
        },
        onError: (_action, error) => {
          console.error('Error', error);
          return TicketsActions.assignTicketFailure({ error });
        },
      })
    )
  );

  completeTicket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketsActions.completeTicket),
      fetch({
        run: ({ticketId, completed}) => {
          return this.ticketsApi.complete(ticketId, completed).pipe(
            map(() => TicketsActions.completeTicketSuccess({ ticketId, completed }))
          );
        },
        onError: (_action, error) => {
          console.error('Error', error);
          return TicketsActions.completeTicketFailure({ error });
        },
      })
    )
  );


  constructor(
    private readonly actions$: Actions,
    private ticketsApi: TicketsApiService,
    private store: Store
  ) {}
}
