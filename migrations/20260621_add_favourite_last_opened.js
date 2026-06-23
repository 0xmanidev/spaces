export async function up(knex) {
    const hasFav = await knex.schema.hasColumn('spaces','is_favorite');
    const hasLast = await knex.schema.hasColumn('spaces','last_opened_at');
    await knex.schema.alterTable('spaces',(table)=>{
        if(!hasFav) table.boolean('is_favorite').defaultTo(false);
        if(!hasLast) table.timestamp('last_opened_at');
    });
}
export async function down(knex) {
    const hasFav = await knex.schema.hasColumn('spaces','is_favorite');
    const hasLast = await knex.schema.hasColumn('spaces','last_opened_at');
      await knex.schema.alterTable('spaces', (table) => {
    if (hasFav) table.dropColumn('is_favorite');
    if (hasLast) table.dropColumn('last_opened_at');
  });

    
}