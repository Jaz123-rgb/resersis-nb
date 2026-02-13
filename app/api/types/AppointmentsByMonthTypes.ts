interface AppointmentByMonth {
  date: string;
  time: string;
}

interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface AppointmentsByMonthResponse {
  content: AppointmentByMonth[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
