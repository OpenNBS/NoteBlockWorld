export class PageResultDTO<T> {
  data: T[];
  page: number = 1;
  total: number;

  limit: number;

  constructor(data: PageResultDTO<T>) {
    Object.assign(this, data);
  }
}
