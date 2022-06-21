import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { fetch } from '@nrwl/angular';
import { filter, map, tap, withLatestFrom } from 'rxjs';
import { ApiService } from '../api.service';

import * as TicketsActions from './tickets.actions';
import * as TicketsFeature from './tickets.reducer';
import { getTicketsLoaded } from './tickets.selectors';

@Injectable()
export class TicketsEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketsActions.ticketsPageInit, TicketsActions.ticketDetailsPageInit),
      withLatestFrom(this.store.select(getTicketsLoaded)),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      filter(([_action, isLoaded]) => !isLoaded),
      map(([action]) => action),
      fetch({
        run: () => {
          return this.api.tickets().pipe(
            map(tickets => TicketsActions.loadTicketsSuccess({ tickets}))
          )
        },
        onError: (action, error) => {
          console.error('Error', error);
          return TicketsActions.loadTicketsFailure({ error });
        },
      })
    )
  );

  submitTicket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketsActions.submitTicket),
      fetch({
        run: (action) => {
          // Your custom service 'load' logic goes here. For now just return a success action...
          return this.api.newTicket(action).pipe(
            map(ticket => TicketsActions.createTicketSuccess ({ ticket }))
          )
        },
        onError: (action, error) => {
          console.error('Error', error);
          return TicketsActions.createTicketFailure({ error });
        },
      })
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private api: ApiService
  ) {}
}
