import { SelectedFields, SQL, sql } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";
/**
 * It should be used with group by
 * @param object - The object to be converted to JSON
 *
 * @returns - A SQL expression that represents the JSON object construction
 */
export function jsonBuildObject(object: Record<string, PgColumn<any>> | SelectedFields<any, any>) {
  const chunks: SQL[] = [];
  for (const [key, value] of Object.entries(object)) {
    if (chunks.length > 0) {
      chunks.push(sql.raw(`,`));
    }
    chunks.push(sql.raw(`'${key}',`));
    chunks.push(sql`${value}`);
  }
  return sql`
    json_build_object(
        ${sql.join(chunks)}
    )
`;
}
