/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // 1. Create Enums
  pgm.createType('user_role', ['student', 'admin']);
  pgm.createType('question_type', ['mcq', 'subjective']);

  // 2. Create Users Table
  pgm.createTable('users', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    role: { type: 'user_role', notNull: true, default: 'student' },
    created_at: { type: 'timestamptz', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamptz', default: pgm.func('current_timestamp') },
  });

  // 3. Create Exams Table (With soft deletes)
  pgm.createTable('exams', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    title: { type: 'varchar(255)', notNull: true },
    subject: { type: 'varchar(100)', notNull: true },
    total_marks: { type: 'integer', notNull: true },
    duration_minutes: { type: 'integer', notNull: true },
    created_at: { type: 'timestamptz', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamptz', default: pgm.func('current_timestamp') },
    deleted_at: { type: 'timestamptz' },
  });

  // 4. Create Questions Table (With soft deletes)
  pgm.createTable('questions', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    exam_id: {
      type: 'uuid',
      notNull: true,
      references: '"exams"',
      onDelete: 'CASCADE',
    },
    type: { type: 'question_type', notNull: true },
    content: { type: 'text', notNull: true },
    ideal_answer: { type: 'text', notNull: true },
    created_at: { type: 'timestamptz', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamptz', default: pgm.func('current_timestamp') },
    deleted_at: { type: 'timestamptz' },
  });

  // 5. Create B-Tree Indexes
  // Note: The unique index on users.email is automatically created by the 'unique: true' constraint above.
  
  // Standard B-Tree for foreign key lookups
  pgm.createIndex('questions', 'exam_id', { name: 'idx_questions_exam_id' });

  // Partial B-Tree for Active Exams (Optimizes WHERE subject = ? AND deleted_at IS NULL)
  pgm.createIndex('exams', 'subject', {
    name: 'idx_exams_subject_active',
    where: 'deleted_at IS NULL'
  });

  // Partial B-Tree for Active Questions (Optimizes WHERE exam_id = ? AND deleted_at IS NULL)
  pgm.createIndex('questions', 'exam_id', {
    name: 'idx_questions_active',
    where: 'deleted_at IS NULL'
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Drop tables in reverse order of creation to respect foreign key constraints
  pgm.dropTable('questions');
  pgm.dropTable('exams');
  pgm.dropTable('users');

  // Drop enums
  pgm.dropType('question_type');
  pgm.dropType('user_role');
};
