import { Ticket } from '@acme/shared-models';
import { TicketsFacade } from '@acme/tickets/data-access';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlType, FormConfig } from '@tft/crispr-forms';
import { catchError, combineLatest, distinctUntilChanged, map, Observable, of, pipe, switchMap, take, tap } from 'rxjs';
import { ApiService } from '../api.service';

@Component({
  selector: 'acme-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss'],
})
export class TicketDetailsComponent implements OnInit {

  ticket$: Observable<Ticket | undefined>;

  assignUserConfig: FormConfig = {
    fields: [
      {
        controlType: ControlType.SELECT,
        controlName: 'assigneeId',
        label: 'Assign User',
        validators: [Validators.required],
        // disable if completed
        disabledCallback: (group: FormGroup) => {
          const completedControl = group.get('completed') as FormControl;
          return completedControl.valueChanges.pipe(
            distinctUntilChanged(),
            map(completed => completed)
          )
        },
        options: this.api.users().pipe(
          map((users) => {
            const userOptions = users.map(user => {
              return {label: user.name,
              value: user.id}
            })
            return [
              {
                label: 'Unassigned',
                value: null
              },
              ...userOptions
            ]
          })
        )
      },
      {
        controlType: ControlType.CHECKBOX,
        controlName: 'completed',
        label: 'Ticket Completed',
        // disable if not assigned
        disabledCallback: (group: FormGroup) => {
          const assigneeIdControl = group.get('assigneeId') as FormControl;
          return assigneeIdControl.valueChanges.pipe(
            map(id => !id)
          )
        }
      },
      {
        controlType: ControlType.BUTTON,
        label: 'SUBMIT'
      },
      {
        controlType: ControlType.BUTTON,
        label: 'BACK',
        type: 'button',
        callback: () => {
          this.router.navigate([''])
        }
      }
    ]
  }
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private ticketsFacade: TicketsFacade,
  ) {
    this.ticket$ = ticketsFacade.selectedTicket$;
  }

  ngOnInit(): void {

    this.route.paramMap.pipe(
      take(1)
    ).subscribe((params) => {
      const stringId = params?.get('id') || '';
      // if we don't have the id parameter, route back to root route
      if (!stringId) this.router.navigate(['']);
      const ticketId = parseFloat(stringId);
      this.ticketsFacade.enterDetailsPage(ticketId)
    });
  }

  assignUser(form: FormGroup, ticketId: number) {
    if (form.valid) {
      const {assigneeId, completed} = form.getRawValue();
      combineLatest([
        this.api.assign(ticketId, assigneeId),
        this.api.complete(ticketId, completed || false),
      ]).pipe(
        catchError((err) => {
          console.error(err);
          return of(err)
        })
      ).subscribe(() => {
        this.router.navigate([''])
      })
    }
  }
}
