import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { map, tap } from 'rxjs';
import { ApiService } from '../api.service';

import * as TicketsActions from './tickets.actions';
import * as TicketsFeature from './tickets.reducer';

@Injectable()
export class TicketsEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketsActions.ticketsPageInit),
      fetch({
        run: (action) => {
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
    private api: ApiService
  ) {}
}
