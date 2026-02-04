export interface Appointment {
  id: number;
  date: string;
  time: string;
  reason: string;
  status: string;
  guestName: string;
  guestEmail: string;
  user?: any;
  createdAt?: string;
  updatedAt?: string;
  cancelledReason?: string;
  cancelledAt?: string;
  managementToken?: string;
  active?: boolean;
  pending?: boolean;
  confirmed?: boolean;
}

export interface PageableSort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: PageableSort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface AppointmentsResponse {
  content: Appointment[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface GetAppointmentsByMonthParams {
  year: number;
  month: number;
  page?: number;
  size?: number;
}
