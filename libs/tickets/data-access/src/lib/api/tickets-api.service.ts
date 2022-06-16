import { Ticket } from '@acme/shared-models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TicketsApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  tickets() {
    return this.httpClient.get<Ticket[]>('/api/tickets');
  }

  ticket(id: number) {
    return this.httpClient.get<Ticket>(`/api/tickets/${id}`);
  }


  newTicket(payload: { description: string }) {
    return this.httpClient.post<Ticket>('/api/tickets', payload);
  }

  assign(ticketId: number, userId: number) {
    return this.httpClient.put<void>(
      `/api/tickets/${ticketId}/assign/${userId}`,
      {}
    );
  }

  complete(ticketId: number, completed: boolean) {
    if (completed) {
      return this.httpClient.put<void>(`/api/tickets/${ticketId}/complete`, {});
    } else {
      return this.httpClient.delete<void>(`/api/tickets/${ticketId}/complete`);
    }
  }
}
