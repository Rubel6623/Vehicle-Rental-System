import { pool } from "../../config/db";

const createBooking = async (
  customer_id: number,
  vehicle_id: number,
  rent_start_date: string,
  rent_end_date: string,
  total_price: number
) => {
  const result = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
    ]
  );

  const booking = result.rows[0];

  const vehicleData = await pool.query(
    `SELECT vehicle_name, daily_rent_price FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );

  delete result.rows[0].created_at;
  delete result.rows[0].updated_at;

  return {
    ...booking,
    vehicle: vehicleData.rows[0],
  };
};

const getBookings = async () => {
  const result = await pool.query(
    `SELECT id,customer_id, vehicle_id,rent_start_date,rent_end_date,total_price,status,user FROM bookings`
  );
  return result;
};



export const bookingService = {
  createBooking,
  getBookings,
};
