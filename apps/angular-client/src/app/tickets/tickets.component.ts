import { Ticket } from '@acme/shared-models';
import { Component, OnInit } from '@angular/core';
import { ControlType, FormConfig } from '@tft/crispr-forms';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { ApiService } from '../api.service';

type StatusOptions = 'complete' | 'incomplete'

@Component({
  selector: 'acme-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css'],
})
export class TicketsComponent {
  tickets$ = this.api.tickets();
  users$ = this.api.users();
  filterSubject = new BehaviorSubject<StatusOptions[]>([]);

  filteredTickets$: Observable<Ticket[]> = combineLatest([
    this.tickets$,
    this.filterSubject
  ]).pipe(
    map(([unfilteredTickets, filter]) => {
      // return all tickets if not filtering
      if (filter?.length === 0) return unfilteredTickets;
      // else filter them by status
      return unfilteredTickets.filter((ticket) => {
        return (filter.includes('complete') && ticket.completed)
        || (filter.includes('incomplete') && !ticket.completed)
      })
    })
  )

  filterConfig: FormConfig = {
    fields: [
      {
        controlType: ControlType.SELECT,
        controlName: 'statusFilter',
        label: 'Filter By Status',
        multiple: true,
        options: [
          {
            label: 'Completed Issues',
            value: 'complete'
          },
          {
            label: 'Incomplete Issues',
            value: 'incomplete'
          },
        ]
      }
    ]
  }
  constructor(private api: ApiService) {}

  updateFilter(event: {statusFilter: StatusOptions[]}) {
    this.filterSubject.next(event.statusFilter || [])
  }
}
