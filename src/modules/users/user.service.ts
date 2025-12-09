import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

const getUser = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );
  return result;
};

const getSingleUser = async (id: string) => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users WHERE id = $1`,
    [id]
  );

  return result;
};

const updateUser = async (
  name: string,
  email: string,
  phone: string,
  role: string | undefined,
  id: string
) => {
  let result;
  if (role) {
    result = await pool.query(
      `UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *`,
      [name, email, phone, role, id]
    );
  } else {
    result = await pool.query(
      `UPDATE users SET name=$1, email=$2, phone=$3 WHERE id=$4 
       RETURNING *`,
      [name, email, phone, id]
    );
  }
  return result;
};

const deleteUser = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);

  return result;
};

export const userServices = {
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
