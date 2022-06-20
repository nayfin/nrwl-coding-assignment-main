import { Ticket } from "@acme/shared-models";

/**
 * Interface for the 'Tickets' data
 */
export type TicketsEntity = Ticket;

export interface TicketsFilter {
  status: StatusOptions[];
}

export type StatusOptions = 'complete' | 'incomplete';
