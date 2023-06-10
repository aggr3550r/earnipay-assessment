import { PageOptionsDTO } from '../../../../paging/page-option.dto';
import { FilterTaskDTO } from '../../dtos/filter-tasks.dto';

export const pageOptionsDTOMock: PageOptionsDTO = {
  page: 1,
  take: 20,
  get skip(): number {
    return (this.page - 1) * this.take;
  },
};

export const filterTaskDTOMock: FilterTaskDTO = {
  page: 1,
  take: 20,
  get skip(): number {
    return (this.page - 1) * this.take;
  },
};
