import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { fetch } from '@nrwl/angular';
import { filter, map, withLatestFrom } from 'rxjs';
import { ApiService } from '../api.service';

import * as TicketsActions from './tickets.actions';
import * as TicketsFeature from './tickets.reducer';
import { getTicketsLoaded } from './tickets.selectors';

@Injectable()
export class TicketsEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketsActions.ticketsPageInit),
      withLatestFrom(this.store.select(getTicketsLoaded)),
      filter(([, isLoaded]) => !isLoaded),
      map(([action]) => action),
      fetch({
        run: () => {
          return this.api.tickets().pipe(
            map(tickets => TicketsActions.loadTicketsSuccess({ tickets}))
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
    private store: Store,
    private api: ApiService
    ) {}
}
