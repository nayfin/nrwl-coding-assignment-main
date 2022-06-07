import { Ticket, User } from '@acme/shared-models';
import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ControlType, FormConfig } from '@tft/crispr-forms';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { ApiService } from '../api.service';

type StatusOptions = 'complete' | 'incomplete'
type TicketUI = Ticket & { assigneeName: string | null};

@Component({
  selector: 'acme-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent {
  newTicketsSubject = new BehaviorSubject<Ticket[]>([]);
  // This is a funky way of doing this, normally this would be handled by updating a store

  users$ = this.api.users();

  tickets$: Observable<TicketUI[]> = combineLatest([
    this.api.tickets(),
    this.newTicketsSubject,
    this.users$
  ]).pipe(
    // map assignee name to ticket to make it easier to grab from the template
    map(([apiTickets, newTickets, users ]) => [...apiTickets, ...newTickets].map(ticket => {
      const assigneeName = ticket.assigneeId ? this.getNameForUserId(ticket.assigneeId, users) : null
      return {
        ...ticket,
        assigneeName
      }
    }))
  );

  filterSubject = new BehaviorSubject<StatusOptions[]>([]);

  filteredTickets$: Observable<TicketUI[]> = combineLatest([
    this.tickets$,
    this.filterSubject,
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
  // the configuration for the filter form
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
  // the configuration for the new ticket form
  newTicketConfig: FormConfig = {
    fields: [
      {
        controlType: ControlType.HEADING,
        label: 'New Ticket'
      },
      {
        controlType: ControlType.INPUT,
        controlName: 'description',
        validators: [Validators.required],
        label: 'Description'
      },
      {
        controlType: ControlType.BUTTON,
        label: 'CREATE TICKET'
      }
    ]
  };
  // Used to hide the new ticket form when submitting
  submitting = false;

  constructor(
    private api: ApiService
  ) {}

  updateFilter(event: {statusFilter: StatusOptions[]}) {
    this.filterSubject.next(event.statusFilter || [])
  }

  createNewTicket(ticketForm: FormGroup) {
    if(ticketForm.valid) {
      const ticketValue: {description: string} = ticketForm.value;
      this.submitting = true;
      this.api.newTicket(ticketValue).subscribe((res) => {
        this.newTicketsSubject.next([...this.newTicketsSubject.value, res])
        this.submitting = false;
      });
    }
  }

  getNameForUserId(userId: number, users: User[]) {
    return users.find(user => user.id === userId)?.name || null
  }
}
