import Database from "better-sqlite3";

const db = new Database("./database/employees.sqlite");

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS employees(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT,
    lastname TEXT,
    firstname TEXT,
    position TEXT,
    salary REAL,
    department TEXT,
    gender TEXT,
    holiday_days INTEGER,
    birth_date TEXT
    )
    `,
).run();

export const getAllEmployees = () =>
  db.prepare(`SELECT * FROM employees`).all();

export const getEmployeesById = (id) =>
  db.prepare(`SELECT * FROM employees WHERE id = ?`).get(id);

export const createEmployee = (
  company,
  lastname,
  firstname,
  position,
  salary,
  department,
  gender,
  holiday_days,
  birth_date,
) =>
  db
    .prepare(
      `INSERT INTO employees (company, lastname, firstname, position, salary, department, gender, holiday_days, birth_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      company,
      lastname,
      firstname,
      position,
      salary,
      department,
      gender,
      holiday_days,
      birth_date,
    );

export const updateEmployee = (
  id,
  company,
  lastname,
  firstname,
  position,
  salary,
  department,
  gender,
  holiday_days,
  birth_date,
) =>
  db
    .prepare(
      `UPDATE employees 
       SET company = ?, 
           lastname = ?, 
           firstname = ?, 
           position = ?, 
           salary = ?, 
           department = ?, 
           gender = ?, 
           holiday_days = ?, 
           birth_date = ? 
       WHERE id = ?`,
    )
    .run(
      company,
      lastname,
      firstname,
      position,
      salary,
      department,
      gender,
      holiday_days,
      birth_date,
      id,
    );
export const deleteEmployees = (id) =>
  db.prepare(`DELETE FROM employees WHERE id = ?`).run(id);
export default db;
