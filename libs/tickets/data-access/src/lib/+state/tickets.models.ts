import { Ticket } from "@acme/shared-models";

/**
 * Interface for the 'Tickets' data
 */
export type TicketsEntity = Ticket;


/**
 * Used when filtering tickets by status, if more filter options are added an interface
 * should be created to represent properties
 */
export type StatusOptions = 'complete' | 'incomplete'
