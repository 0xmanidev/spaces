const createTableIfMissing = async (knex, tableName, callback) => {
  const hasTable = await knex.schema.hasTable(tableName);

  if (!hasTable) {
    await knex.schema.createTable(tableName, callback);
  }
};

const addColumnIfMissing = async (knex, tableName, columnName, callback) => {
  const hasColumn = await knex.schema.hasColumn(tableName, columnName);

  if (!hasColumn) {
    await knex.schema.alterTable(tableName, (table) => {
      callback(table);
    });
  }
};

export async function up(knex) {
  await createTableIfMissing(knex, 'users', (table) => {
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
  });

  await addColumnIfMissing(knex, 'users', 'password_hash', (table) => table.string('password_hash'));
  await addColumnIfMissing(knex, 'users', 'authorization', (table) => table.string('authorization'));
  await addColumnIfMissing(knex, 'users', 'max_spaces', (table) => table.integer('max_spaces').defaultTo(3));
  await addColumnIfMissing(knex, 'users', 'is_admin', (table) => table.boolean('is_admin').defaultTo(false));
  await addColumnIfMissing(knex, 'users', 'hackatime_api_key', (table) => table.string('hackatime_api_key'));
  await addColumnIfMissing(knex, 'users', 'hackclub_id', (table) => table.string('hackclub_id'));
  await addColumnIfMissing(knex, 'users', 'hackclub_verification_status', (table) => table.string('hackclub_verification_status'));
  await addColumnIfMissing(knex, 'users', 'hackclub_linked_at', (table) => table.timestamp('hackclub_linked_at'));
  await addColumnIfMissing(knex, 'users', 'hackclub_last_checked_at', (table) => table.timestamp('hackclub_last_checked_at'));

  await createTableIfMissing(knex, 'spaces', (table) => {
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
  });

  await addColumnIfMissing(knex, 'spaces', 'user_id', (table) => table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE'));
  await addColumnIfMissing(knex, 'spaces', 'container_id', (table) => table.string('container_id'));
  await addColumnIfMissing(knex, 'spaces', 'type', (table) => table.string('type'));
  await addColumnIfMissing(knex, 'spaces', 'description', (table) => table.string('description'));
  await addColumnIfMissing(knex, 'spaces', 'image', (table) => table.string('image'));
  await addColumnIfMissing(knex, 'spaces', 'port', (table) => table.integer('port'));
  await addColumnIfMissing(knex, 'spaces', 'access_url', (table) => table.string('access_url'));
  await addColumnIfMissing(knex, 'spaces', 'password', (table) => table.string('password'));
  await addColumnIfMissing(knex, 'spaces', 'running', (table) => table.boolean('running').defaultTo(false));
  await addColumnIfMissing(knex, 'spaces', 'started_at', (table) => table.timestamp('started_at'));
  await addColumnIfMissing(knex, 'spaces', 'volume_path', (table) => table.string('volume_path'));

  await createTableIfMissing(knex, 'clubs', (table) => {
    table.increments('id').primary();
    table.string('club_name').unique().notNullable();
    table.string('display_name');
    table.string('country');
    table.text('metadata');
    table.timestamp('last_synced_at');
    table.timestamps(true, true);
  });

  await addColumnIfMissing(knex, 'clubs', 'display_name', (table) => table.string('display_name'));
  await addColumnIfMissing(knex, 'clubs', 'country', (table) => table.string('country'));
  await addColumnIfMissing(knex, 'clubs', 'metadata', (table) => table.text('metadata'));
  await addColumnIfMissing(knex, 'clubs', 'last_synced_at', (table) => table.timestamp('last_synced_at'));

  await createTableIfMissing(knex, 'user_club_memberships', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('club_id').unsigned().references('id').inTable('clubs').onDelete('CASCADE');
    table.string('role').notNullable();
    table.string('source');
    table.boolean('is_primary').defaultTo(false);
    table.timestamp('last_verified_at');
    table.timestamps(true, true);
  });

  await addColumnIfMissing(knex, 'user_club_memberships', 'user_id', (table) => table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE'));
  await addColumnIfMissing(knex, 'user_club_memberships', 'club_id', (table) => table.integer('club_id').unsigned().references('id').inTable('clubs').onDelete('CASCADE'));
  await addColumnIfMissing(knex, 'user_club_memberships', 'role', (table) => table.string('role'));
  await addColumnIfMissing(knex, 'user_club_memberships', 'source', (table) => table.string('source'));
  await addColumnIfMissing(knex, 'user_club_memberships', 'is_primary', (table) => table.boolean('is_primary').defaultTo(false));
  await addColumnIfMissing(knex, 'user_club_memberships', 'last_verified_at', (table) => table.timestamp('last_verified_at'));

  await createTableIfMissing(knex, 'space_club_shares', (table) => {
    table.increments('id').primary();
    table.integer('space_id').unsigned().references('id').inTable('spaces').onDelete('CASCADE');
    table.integer('club_id').unsigned().references('id').inTable('clubs').onDelete('CASCADE');
    table.integer('shared_by_user_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.string('permission').defaultTo('read');
    table.timestamp('revoked_at');
    table.timestamps(true, true);
  });

  await addColumnIfMissing(knex, 'space_club_shares', 'space_id', (table) => table.integer('space_id').unsigned().references('id').inTable('spaces').onDelete('CASCADE'));
  await addColumnIfMissing(knex, 'space_club_shares', 'club_id', (table) => table.integer('club_id').unsigned().references('id').inTable('clubs').onDelete('CASCADE'));
  await addColumnIfMissing(knex, 'space_club_shares', 'shared_by_user_id', (table) => table.integer('shared_by_user_id').unsigned().references('id').inTable('users').onDelete('SET NULL'));
  await addColumnIfMissing(knex, 'space_club_shares', 'permission', (table) => table.string('permission').defaultTo('read'));
  await addColumnIfMissing(knex, 'space_club_shares', 'revoked_at', (table) => table.timestamp('revoked_at'));

  await createTableIfMissing(knex, 'oauth_states', (table) => {
    table.increments('id').primary();
    table.string('state').notNullable();
    table.string('mode');
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await addColumnIfMissing(knex, 'oauth_states', 'mode', (table) => table.string('mode'));
  await addColumnIfMissing(knex, 'oauth_states', 'user_id', (table) => table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE'));
  await addColumnIfMissing(knex, 'oauth_states', 'created_at', (table) => table.timestamp('created_at').defaultTo(knex.fn.now()));
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
