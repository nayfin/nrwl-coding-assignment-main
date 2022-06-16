import { Ticket, User } from '@acme/shared-models';
import { TicketsFacade, StatusOptions } from '@acme/tickets/data-access';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlType, FormConfig } from '@tft/crispr-forms';
import { BehaviorSubject, combineLatest, map, Observable, tap } from 'rxjs';
import { ApiService } from '../api.service';

type TicketUI = Ticket & { assigneeName: string | null};

@Component({
  selector: 'acme-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent implements OnInit {

  users$ = this.api.users();

  tickets$: Observable<TicketUI[]> = combineLatest([
    this.ticketsFacade.allTickets$,
    this.users$
  ]).pipe(
    // map assignee name to ticket to make it easier to grab from the template
    map(([apiTickets, users ]) => apiTickets.map(ticket => {
      const assigneeName = ticket.assigneeId ? this.getNameForUserId(ticket.assigneeId, users) : null
      return {
        ...ticket,
        assigneeName
      }
    }))
  );

  filteredTickets$: Observable<Ticket[]> = this.ticketsFacade.filteredTickets$
  filterValue$: Observable<{statusFilter: StatusOptions[]}> = this.ticketsFacade.ticketsFilter$.pipe(
    map(statusOptions => ({statusFilter: statusOptions}))
  );
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
  creatingTicket$: Observable<boolean> = this.ticketsFacade.creatingTicket$;

  constructor(
    private api: ApiService,
    private ticketsFacade: TicketsFacade,
    private router: Router,
    route: ActivatedRoute
  ) {
    route.queryParamMap.subscribe(params => {
      const filter = params.getAll('filter') as StatusOptions[];
      console.log({filter})
      this.updateFilter(filter)
    });
  }

  ngOnInit() {
    this.ticketsFacade.enterTicketsPage();
  }

  setFilterParams(event: {statusFilter: StatusOptions[]}) {
    this.router.navigate([''], {queryParams: {filter: event.statusFilter}} )
  }

  updateFilter(statusFilter: StatusOptions[]) {
    this.ticketsFacade.filterTickets(statusFilter)
  }

  createNewTicket(ticketForm: FormGroup) {
    if(ticketForm.valid) {
      const ticketValue: {description: string} = ticketForm.value;
      this.ticketsFacade.createTicket(ticketValue);
    }
  }

  getNameForUserId(userId: number, users: User[]) {
    return users.find(user => user.id === userId)?.name || null
  }
}
