
exports.up = function(knex) {
  return knex.schema
  .createTable("users", tbl => {
      tbl.increments('id');
      
      tbl.string("name", 256).notNullable();
      tbl.string("username", 128).notNullable().unique();
      tbl.string("password", 128).notNullable();
  }).createTable('projects', tbl => {
    tbl.increments('id');
    tbl.integer("user_id")
        .unsigned()
        .notNullable()
        .references("users.id")
        .onDelete("RESTRICT")
        .onUpdate("CASCADE");
    tbl.string('name', 255).notNullable().unique();
    tbl.text('description').notNullable();
    tbl.boolean('completed').defaultTo(false);

})    
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("projects")
    .dropTableIfExists("users")
    
};
