import { Migration } from "../scripts/dbMigrate";

export const up: Migration = async (params) => {
  params.context.query(`RAISE EXCEPTION 'up migration not implemented'`);
};
export const down: Migration = async (params) => {
  params.context.query(`RAISE EXCEPTION 'down migration not implemented'`);
};