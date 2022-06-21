import { Ticket, User } from '@acme/shared-models';
import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ControlType, FormConfig } from '@tft/crispr-forms';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { ticketsPageInit } from '../+state/tickets.actions';
import { StatusOptions, TicketsFilter } from '../+state/tickets.models';
import { getAllTickets } from '../+state/tickets.selectors';
import { ApiService } from '../api.service';

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
    this.store.select(getAllTickets),
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

  filterSubject = new BehaviorSubject<TicketsFilter>({status: [], fullText: ''});

  filteredTickets$: Observable<TicketUI[]> = combineLatest([
    this.tickets$,
    this.filterSubject,
  ]).pipe(
    map(([unfilteredTickets, filter]) => {
      const { status, fullText} = filter;
      // return all tickets if not filtering
      if (!status?.length && fullText === '') return unfilteredTickets;
      // else filter them by status
      return unfilteredTickets.filter((ticket) => {
        const isPassingFullText = ticket.description.includes(filter.fullText)
        const isPassingStatus = !status?.length ||(status.includes('complete') && ticket.completed)
          || (status.includes('incomplete') && !ticket.completed);
        return isPassingStatus && isPassingFullText;
      })
    })
  )
  // the configuration for the filter form
  filterConfig: FormConfig = {
    fields: [
      {
        controlType: ControlType.INPUT,
        controlName: 'fullText',
        inputType: 'text',
        label: 'Search by name',
      },
      {
        controlType: ControlType.SELECT,
        controlName: 'status',
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
    private api: ApiService,
    private store: Store
  ) {
    this.store.dispatch(ticketsPageInit())
  }

  updateFilter(event: TicketsFilter) {
    this.filterSubject.next({fullText: event.fullText || '', status: event.status || []})
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
