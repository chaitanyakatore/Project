/**
 * Base Repository Interface
 * 
 * By defining this interface, we establish the Repository Pattern for our
 * PostgreSQL tables. This abstracts database logic away from our services,
 * decoupling them from the specific 'pg' implementation.
 * 
 * T: The Entity type (e.g. User, Exam)
 * ID: The type of the primary key (typically string or number)
 */
export interface BaseRepository<T, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Omit<T, 'id'>): Promise<T>;
  update(id: ID, entity: Partial<T>): Promise<T | null>;
  delete(id: ID): Promise<boolean>;
}
