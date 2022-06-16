import { Ticket } from "@acme/shared-models";

/**
 * Interface for the 'Tickets' data
 */
export type TicketsEntity = Ticket;

/** Interface of data that comes out of new ticket form */
export type NewTicketForm = Pick<Ticket, 'description'>;

/**
 * Used when filtering tickets by status, if more filter options are added an interface
 * should be created to represent properties
 */
export type StatusOptions = 'complete' | 'incomplete'
