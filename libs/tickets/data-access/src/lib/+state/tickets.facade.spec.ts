import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { NxModule } from '@nrwl/angular';
import { readFirst } from '@nrwl/angular/testing';

import * as TicketsActions from './tickets.actions';
import { TicketsEffects } from './tickets.effects';
import { TicketsFacade } from './tickets.facade';
import { TicketsEntity } from './tickets.models';
import {
  TICKETS_FEATURE_KEY,
  State,
  initialState,
  reducer,
} from './tickets.reducer';
import * as TicketsSelectors from './tickets.selectors';

interface TestSchema {
  tickets: State;
}

describe('TicketsFacade', () => {
  let facade: TicketsFacade;
  let store: Store<TestSchema>;
  const createTicketsEntity = (id: string, name = ''): TicketsEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(TICKETS_FEATURE_KEY, reducer),
          EffectsModule.forFeature([TicketsEffects]),
        ],
        providers: [TicketsFacade],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [
          NxModule.forRoot(),
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule,
        ],
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.inject(Store);
      facade = TestBed.inject(TicketsFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allTickets$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allTickets$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadTicketsSuccess` to manually update list
     */
    it('allTickets$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allTickets$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        TicketsActions.loadTicketsSuccess({
          tickets: [createTicketsEntity('AAA'), createTicketsEntity('BBB')],
        })
      );

      list = await readFirst(facade.allTickets$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
