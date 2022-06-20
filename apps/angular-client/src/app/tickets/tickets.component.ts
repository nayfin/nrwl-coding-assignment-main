import { Ticket, User } from '@acme/shared-models';
import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ControlType, FormConfig } from '@tft/crispr-forms';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { submitTicket, ticketsPageInit, updateTicketsFilter } from '../+state/tickets.actions';
import { StatusOptions } from '../+state/tickets.models';
import { getCreatingTicket, getFilteredTickets } from '../+state/tickets.selectors';
import { ApiService } from '../api.service';

type TicketUI = Ticket & { assigneeName: string | null};

@Component({
  selector: 'acme-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent {
  // This is a funky way of doing this, normally this would be handled by updating a store

  users$ = this.api.users();

  tickets$: Observable<TicketUI[]> = combineLatest([
    this.store.select(getFilteredTickets),
    this.users$
  ]).pipe(
    // map assignee name to ticket to make it easier to grab from the template
    map(([tickets, users ]) => tickets.map(ticket => {
      const assigneeName = ticket.assigneeId ? this.getNameForUserId(ticket.assigneeId, users) : null
      return {
        ...ticket,
        assigneeName
      }
    }))
  );

  creatingTicket$ = this.store.select(getCreatingTicket);
  filterSubject = new BehaviorSubject<StatusOptions[]>([]);

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

  constructor(
    private api: ApiService,
    private store: Store,
    private router: Router,
    route: ActivatedRoute
  ) {
    store.dispatch(ticketsPageInit());
    route.queryParamMap.subscribe((params) => {
      const status = params.getAll('statusFilter') as StatusOptions[];
      this.store.dispatch(updateTicketsFilter({status}))
    })
  }

  updateFilter(event: {statusFilter: StatusOptions[]}) {
    this.router.navigate(['./'], {queryParams: {statusFilter: event.statusFilter}})
  }

  createNewTicket(ticketForm: FormGroup) {
    if(ticketForm.valid) {
      const ticketValue: {description: string} = ticketForm.value;
      this.store.dispatch(submitTicket(ticketValue))
    }
  }

  getNameForUserId(userId: number, users: User[]) {
    return users.find(user => user.id === userId)?.name || null
  }
}
