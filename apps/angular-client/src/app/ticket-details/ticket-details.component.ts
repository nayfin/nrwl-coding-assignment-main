import { Ticket } from '@acme/shared-models';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlType, FormConfig } from '@tft/crispr-forms';
import { catchError, combineLatest, distinctUntilChanged, map, Observable, of, pipe, switchMap } from 'rxjs';
import { ApiService } from '../api.service';

@Component({
  selector: 'acme-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss'],
})
export class TicketDetailsComponent implements OnInit {

  ticket$: Observable<Ticket> | undefined;

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ticket$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const stringId = params?.get('id') || '';
        // should route back home if there is an issue with id param
        if (!stringId) this.router.navigate(['']);
        const ticketId = parseFloat(stringId);
        return this.api.ticket(ticketId);
      })
    )
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
