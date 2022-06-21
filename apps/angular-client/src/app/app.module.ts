import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ApiService } from './api.service';
import { TicketsComponent } from './tickets/tickets.component';
import { CrisprFormsModule } from '@tft/crispr-forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';
import { MatIconModule } from '@angular/material/icon';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromTickets from './+state/tickets.reducer';
import { TicketsEffects } from './+state/tickets.effects';
import { NxModule } from '@nrwl/angular';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
@NgModule({
  declarations: [AppComponent, TicketsComponent, TicketDetailsComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    CrisprFormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    RouterModule.forRoot(
      [
        { path: '', component: TicketsComponent },
        { path: 'ticket/:id', component: TicketDetailsComponent },
        { path: '**', redirectTo: '/' },
      ],
      {
        initialNavigation: 'enabledBlocking',
      }
    ),
    NxModule.forRoot(),
    StoreModule.forRoot(
      {},
      {
        metaReducers: !environment.production ? [] : [],
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true,
        },
      }
    ),
    EffectsModule.forRoot([TicketsEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreRouterConnectingModule.forRoot(),
    StoreModule.forFeature(
      fromTickets.TICKETS_FEATURE_KEY,
      fromTickets.reducer
    ),
  ],
  providers: [ApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
