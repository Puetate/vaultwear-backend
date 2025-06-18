import { SelectedFields, sql } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";
import { jsonBuildObject } from "./json-build-object.util";
/**
 * It should be used with group by
 * @param object - The object to be converted to JSON
 *
 * @returns - A SQL expression that represents the JSON aggregation of the object
 */
export function jsonAgg(object: Record<string, PgColumn<any>> | SelectedFields<any, any>) {
  return sql`json_agg(
    ${jsonBuildObject(object)}
)`;
}
