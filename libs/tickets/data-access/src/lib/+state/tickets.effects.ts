import { Ticket } from '@acme/shared-models';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
// import { Injectable } from '@angular/';

import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { map, tap } from 'rxjs/operators';

import * as TicketsActions from './tickets.actions';
import * as TicketsFeature from './tickets.reducer';

@Injectable()
export class TicketsEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketsActions.enterPage),
      fetch({
        run: () => {
          return this.httpClient.get<Ticket[]>('/api/tickets').pipe(
            map((tickets) => TicketsActions.loadTicketsSuccess({ tickets }))
          );
        },
        onError: (action, error) => {
          console.error('Error', error);
          return TicketsActions.loadTicketsFailure({ error });
        },
      })
    )
  );

  constructor(
    private readonly actions$: Actions,
    private httpClient: HttpClient
  ) {}
}
