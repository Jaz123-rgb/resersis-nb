export interface Appointment {
    id: number;
    date: string;
    time: string;
    reason: string;
    status: string;
    user: any;
    createdAt: string;
    updatedAt: string;
    cancelledReason: string | null;
    cancelledAt: string | null;
    guestName: string;
    guestEmail: string;
    managementToken: string;
    active: boolean;
    pending: boolean;
    confirmed: boolean;
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
    pageable: Pageable;
    totalElements: number;
    totalPages: number;
    last: boolean;
    size: number;
    number: number;
    sort: PageableSort;
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
  