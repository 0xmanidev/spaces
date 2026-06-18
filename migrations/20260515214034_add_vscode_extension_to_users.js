export async function up(knex) {
    const hasColumn = await knex.schema.hasColumn('users', 'vscode_extensions');

    if (!hasColumn) {
        await knex.schema.alterTable("users", (table) => {
            table.text('vscode_extensions');
        });
    }
};

export async function down(knex) {
    await knex.schema.alterTable("users", (table) => {
        table.dropColumn('vscode_extensions');
    });
};
