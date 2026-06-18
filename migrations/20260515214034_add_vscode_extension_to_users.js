export async function up(knex) {
    await knex.schema.alterTable("users", (table) => {
        table.text('vscode_extensions');
    });
};

export async function down(knex) {
    await knex.schema.alterTable("users", (table) => {
        table.dropColumn('vscode_extensions');
    });
};
