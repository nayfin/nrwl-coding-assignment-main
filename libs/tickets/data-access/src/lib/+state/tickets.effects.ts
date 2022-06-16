import { Ticket } from '@acme/shared-models';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
// import { Injectable } from '@angular/';

import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { filter, map, withLatestFrom } from 'rxjs/operators';

import * as TicketsActions from './tickets.actions';
import * as TicketsFeature from './tickets.reducer';
import { Store } from '@ngrx/store';
import * as TicketSelectors from './tickets.selectors';

@Injectable()
export class TicketsEffects {
  enterTicketPages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketsActions.enterTicketsPage, TicketsActions.enterDetailsPage),
      withLatestFrom(this.store.select(TicketSelectors.getTicketsLoaded)),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      filter(([_payload, isLoaded]) => !isLoaded),
      map(() => TicketsActions.init())
    )
  );

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketsActions.init),
      fetch({
        run: () => {
          return this.httpClient.get<Ticket[]>('/api/tickets').pipe(
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

  constructor(
    private readonly actions$: Actions,
    private httpClient: HttpClient,
    private store: Store
  ) {}
}
