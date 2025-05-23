import { and, count, eq, ilike, or, SelectedFields, SQL, sql, Table } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PgColumn, PgSelect, PgTable } from "drizzle-orm/pg-core";
import { Pool } from "pg";
import * as schema from "./../../modules/drizzle/schema";

/**
 * Determines if a given value is of a string type that is neither numeric nor a valid date.
 *
 * This function checks if the input value is not a numeric value and cannot be parsed as a valid date.
 * If the value is either numeric or a valid date, it returns `false`. Otherwise, it returns `true`.
 *
 * @param value - The string value to evaluate.
 * @returns `true` if the value is a non-numeric, non-date string; otherwise, `false`.
 */
const isStringValueType = (value: string): boolean => {
  const isNumeric = !isNaN(Number(value)) && value.trim() !== "";
  const isDate = !isNaN(new Date(value).getTime());

  if (isNumeric || isDate) return false;
  return true;
};

/**
 *
 * @param value - The value to check.
 * @returns
 */
const getValueType = (value: string | number | boolean): string => {
  if (typeof value === "boolean") return "boolean";
  if (isStringValueType(value.toString())) return "string";
  return "other";
};

/**
 * Generates a filtered list of column names based on the provided conditions.
 *
 * @param columns - A record of column names mapped to their corresponding `PgColumn` objects.
 * @param removeColumnsWithID - A boolean flag indicating whether to exclude columns
 *                              whose names end with "ID". Defaults to `true`.
 * @returns An array of column names that satisfy the filtering conditions.
 */
export function generateGlobalFilterColumns(
  columns: Record<string, PgColumn<any>> | SelectedFields<PgColumn<any>, Table<any>>,
  removeColumnsWithID: boolean = true
) {
  return Object.keys(columns).filter((column) => {
    return removeColumnsWithID ? !column.endsWith("ID") : true;
  });
}

interface WhereFilterConditionsParams {
  columnFilters?: string;
  filter?: string;
  columns: Record<string, PgColumn<any>> | SelectedFields<any, any>;
  globalFilterRemoveColumnsWithID?: boolean;
  globalFilterColumns?: string[];
}

/**
 * Generates an array of SQL filter conditions based on the provided parameters.
 *
 * @param columnFilters - A JSON-encoded string representing an array of column filter objects.
 * Each object contains an `id` (column identifier) and a `value` (filter value).
 * @param filter - A global filter string used to filter across multiple columns.
 * @param columns - An object mapping column identifiers to their corresponding SQL column definitions.
 * @param globalFilterRemoveColumnsWithID - A boolean indicating whether to exclude columns with IDs
 * when generating global filter columns. Defaults to `true` if not provided.
 * @param globalFilterColumns - An optional array of column identifiers to use for global filtering.
 * If not provided, it will be generated automatically.
 *
 * @returns An array of SQL filter conditions to be used in a query.
 *
 * @remarks
 * - The function decodes and parses the `columnFilters` parameter to generate column-specific filter conditions.
 * - If the `filter` parameter is provided, it generates global filter conditions for the specified or generated columns.
 * - Supports filtering for boolean values, string-like values, and other types by casting them to text.
 * - Uses helper functions like `eq`, `ilike`, `like`, and `or` to construct SQL conditions.
 *
 * @example
 * ```typescript
 * const filters = generateWhereFilterConditions({
 *   columnFilters: '[{"id":"name","value":"John"}]',
 *   filter: "Doe",
 *   columns: { name: table.name, age: table.age },
 *   globalFilterRemoveColumnsWithID: false
 * });
 * ```
 */
export function generateWhereFilterConditions(params: WhereFilterConditionsParams) {
  let { columnFilters, filter, columns, globalFilterRemoveColumnsWithID } = params;
  columnFilters = columnFilters || "[]";
  filter = filter || "";

  const decodedColumnFilters = JSON.parse(decodeURIComponent(columnFilters)) as {
    id: string;
    value: string | number | boolean;
  }[];

  const where = decodedColumnFilters.map((columnFilter) => {
    const column = columns[columnFilter.id];
    switch (getValueType(columnFilter.value)) {
      case "boolean":
        return eq(column.getSQL(), columnFilter.value);
      case "string":
        return ilike(column.getSQL(), `%${columnFilter.value}%`);
      default:
        return eq(column.getSQL(), columnFilter.value);
    }
  }) as (SQL<unknown> | undefined)[];

  if (filter !== "") {
    const globalFilterColumns =
      params.globalFilterColumns ??
      generateGlobalFilterColumns(columns, globalFilterRemoveColumnsWithID ?? true);
    const filterWhere = globalFilterColumns.map((column) => {
      const col = columns[column];
      return ilike(sql`CAST(${col.getSQL()} AS TEXT)`, `%${filter}%`);
    });
    where.push(or(...filterWhere));
  }

  return where;
}

interface PaginatedFilteredDataParams extends WhereFilterConditionsParams {
  qb: NodePgDatabase<typeof schema> & { $client: Pool };
  fromTable: PgTable<any>;
  limit: number;
  offset: number;
  aggregateFunction?: (qb: PgSelect) => any;
}

/**
 * Generates paginated and filtered data along with the total count of items
 * based on the provided query builder and parameters.
 *
 * @param qb - The query builder instance used to construct the database query.
 * @param columns - The columns to select in the query.
 * @param fromTable - The table to query data from.
 * @param limit - The maximum number of items to retrieve (pagination limit).
 * @param offset - The number of items to skip (pagination offset).
 * @param aggregateFunction - An optional function to apply inner joins to the query.
 * @param columnFilters - A JSON-encoded string representing an array of column filter objects.
 * Each object contains an `id` (column identifier) and a `value` (filter value).
 * @param filter - A global filter string used to filter across multiple columns.
 * @param columns - An object mapping column identifiers to their corresponding SQL column definitions.
 * @param globalFilterRemoveColumnsWithID - A boolean indicating whether to exclude columns with IDs
 * when generating global filter columns. Defaults to `true` if not provided.
 * @param globalFilterColumns - An optional array of column identifiers to use for global filtering.
 * If not provided, it will be generated automatically.
 *
 * @returns A promise that resolves to an array containing two elements:
 * - The first element is the paginated and filtered data.
 * - The second element is the total count of items matching the conditions.
 */
export function generatePaginatedFilteredData(p: PaginatedFilteredDataParams) {
  let items = p.qb
    .select(p.columns)
    .from(p.fromTable)
    .where(and(...generateWhereFilterConditions(p)))
    .limit(p.limit)
    .offset(p.offset);
  let totalCount = p.qb
    .select({ count: count() })
    .from(p.fromTable)
    .where(and(...generateWhereFilterConditions(p)));
  if (p.aggregateFunction) {
    items = p.aggregateFunction(items.$dynamic());
    totalCount = p.aggregateFunction(totalCount.$dynamic());
  }
  return Promise.all([items, totalCount]);
}
