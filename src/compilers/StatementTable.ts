import type { IExportStatement } from '#/compilers/interfaces/IExportStatement';
import type { IReason } from '#/compilers/interfaces/IReason';
import chalk from 'chalk';
import pathe from 'pathe';

export class StatementTable {
  static key(statement: string | IExportStatement): string {
    if (typeof statement === 'string') {
      return statement;
    }

    const tableKey = statement.isDefault ? statement.identifier.alias : statement.identifier.name;
    return tableKey;
  }

  #table: Map<string, IExportStatement[]>;

  constructor() {
    this.#table = new Map<string, IExportStatement[]>();
  }

  select(key: string | IExportStatement) {
    return this.#table.get(StatementTable.key(key)) ?? [];
  }

  selects() {
    return Array.from(this.#table.values());
  }

  insert(statement: IExportStatement) {
    const key = StatementTable.key(statement);
    const prev = this.#table.get(key);

    if (prev == null) {
      this.#table.set(key, [statement]);
    } else {
      this.#table.set(key, [...prev, statement]);
    }
  }

  inserts(statements: IExportStatement[]) {
    statements.forEach((statement) => this.insert(statement));
  }

  isDuplicate(statement: IExportStatement) {
    const prev = this.#table.get(StatementTable.key(statement));

    if (prev == null) {
      return false;
    }

    return prev.length > 1;
  }

  isDuplicateFromSecond(statement: IExportStatement) {
    const prev = this.#table.get(StatementTable.key(statement));
    const first = prev?.at(0);

    if (prev == null || first == null) {
      return false;
    }

    const prevStatementKey = `${pathe.join(first.path.dirPath, first.path.filename)}::${
      first.identifier.alias
    }`;
    const nextStatementKey = `${pathe.join(statement.path.dirPath, statement.path.filename)}::${
      statement.identifier.alias
    }`;

    if (prevStatementKey === nextStatementKey) {
      return false;
    }

    return prev.length > 1;
  }

  getDuplicateReason() {
    const reasons = Array.from(this.#table.entries())
      .map(([identifier, statements]) => ({
        identifier,
        statements,
      }))
      .filter((symbols) => symbols.statements.length > 1)
      .map((symbols) => {
        return symbols.statements.map((statement) => {
          if (statement.isDefault) {
            const reason: IReason = {
              type: 'warn',
              lineAndCharacter: { line: statement.pos.line, character: statement.pos.column },
              filePath: pathe.join(statement.path.dirPath, statement.path.filename),
              message: `detect same name of default export statement: "${chalk.yellow(
                StatementTable.key(statement),
              )}"`,
            };

            return reason;
          }

          const reason: IReason = {
            type: 'warn',
            lineAndCharacter: { line: statement.pos.line, character: statement.pos.column },
            filePath: pathe.join(statement.path.dirPath, statement.path.filename),
            message: `detect same name of export statement: "${chalk.yellow(
              StatementTable.key(statement),
            )}"`,
          };

          return reason;
        });
      })
      .flat();

    return reasons;
  }
}
