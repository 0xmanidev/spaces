export function up(knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('email').unique().notNullable();
      table.string('username').unique().notNullable();
      table.string('password_hash');
      table.string('authorization');
      table.integer('max_spaces').defaultTo(3);
      table.boolean('is_admin').defaultTo(false);
      table.string('hackatime_api_key');
      table.string('hackclub_id');
      table.string('hackclub_verification_status');
      table.timestamp('hackclub_linked_at');
      table.timestamp('hackclub_last_checked_at');
      table.timestamps(true, true);
    })
    .createTable('spaces', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('container_id');
      table.string('type');
      table.string('description');
      table.string('image');
      table.integer('port');
      table.string('access_url');
      table.string('password');
      table.boolean('running').defaultTo(false);
      table.timestamp('started_at');
      table.string('volume_path');
      table.timestamps(true, true);
    })
    .createTable('clubs', (table) => {
      table.increments('id').primary();
      table.string('club_name').unique().notNullable();
      table.string('display_name');
      table.string('country');
      table.text('metadata');
      table.timestamp('last_synced_at');
      table.timestamps(true, true);
    })
    .createTable('user_club_memberships', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('club_id').unsigned().references('id').inTable('clubs').onDelete('CASCADE');
      table.string('role').notNullable();
      table.string('source');
      table.boolean('is_primary').defaultTo(false);
      table.timestamp('last_verified_at');
      table.timestamps(true, true);
    })
    .createTable('space_club_shares', (table) => {
      table.increments('id').primary();
      table.integer('space_id').unsigned().references('id').inTable('spaces').onDelete('CASCADE');
      table.integer('club_id').unsigned().references('id').inTable('clubs').onDelete('CASCADE');
      table.integer('shared_by_user_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
      table.string('permission').defaultTo('read');
      table.timestamp('revoked_at');
      table.timestamps(true, true);
    })
    .createTable('oauth_states', (table) => {
      table.increments('id').primary();
      table.string('state').notNullable();
      table.string('mode');
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
}

export function down(knex) {
  return knex.schema
    .dropTableIfExists('oauth_states')
    .dropTableIfExists('space_club_shares')
    .dropTableIfExists('user_club_memberships')
    .dropTableIfExists('clubs')
    .dropTableIfExists('spaces')
    .dropTableIfExists('users');
}
