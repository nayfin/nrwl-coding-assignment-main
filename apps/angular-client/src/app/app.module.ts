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
@NgModule({
  declarations: [AppComponent, TicketsComponent, TicketDetailsComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    CrisprFormsModule,
    BrowserAnimationsModule,
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
  ],
  providers: [ApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
