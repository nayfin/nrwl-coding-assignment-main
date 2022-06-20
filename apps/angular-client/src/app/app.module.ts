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
import * as fromUsers from './+state/users.reducer';
import { UsersEffects } from './+state/users.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

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
    StoreModule.forFeature(
      fromTickets.TICKETS_FEATURE_KEY,
      fromTickets.reducer
    ),
    EffectsModule.forFeature([TicketsEffects]),
    StoreModule.forFeature(fromUsers.USERS_FEATURE_KEY, fromUsers.reducer),
    EffectsModule.forFeature([UsersEffects]),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
    }),
  ],
  providers: [ApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
