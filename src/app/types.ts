export interface PopupParams {
  columnName: string;
  columnFilterData: ColumnFilterStateArray;
  top: string;
  left: string;
}

interface Row {
  Продукт: string;
  Марка: string;
  Продавец: string;
  Регион: string;
  Покупатель: string;
}

export interface ColumnFilterState {
  name: string;
  isForbidden: boolean;
  hide?: boolean;
}

export type ColumnFilterStateMap = Map<string, boolean>;

export type FilterStateMap = Map<string, ColumnFilterStateMap>;

export type ColumnFilterStateArray = Array<ColumnFilterState>;

export type CountState = Map<string, number>;

export type Rows = Array<Row>;

export type Headers = Array<string>;
