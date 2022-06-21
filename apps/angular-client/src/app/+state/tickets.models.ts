import { Ticket } from "@acme/shared-models";

/**
 * Interface for the 'Tickets' data
 */
export type TicketsEntity = Ticket;

export type StatusOptions = 'complete' | 'incomplete'

export interface TicketsFilter {
  fullText: string;
  status: StatusOptions[];
}
