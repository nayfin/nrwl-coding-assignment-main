import { TicketsFacade, StatusOptions } from '@acme/tickets/data-access';
import { UsersFacade } from '@acme/users/data-access';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlType, FormConfig } from '@tft/crispr-forms';
import { map, Observable } from 'rxjs';


@Component({
  selector: 'acme-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent implements OnInit {

  filteredTickets$ = this.ticketsFacade.filteredTickets$
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
    private ticketsFacade: TicketsFacade,
    private router: Router,
    route: ActivatedRoute
  ) {
    route.queryParamMap.subscribe(params => {
      const filter = params.getAll('filter') as StatusOptions[];
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
}
