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
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
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

const getBookings = async (role: string, customerId: number) => {
  if (role === "admin") {
    const result = await pool.query(
      `SELECT 
        b.*,
        u.name AS customer_name,
        u.email AS customer_email,
        v.vehicle_name,
        v.registration_number
      FROM bookings b
      JOIN users u ON u.id = b.customer_id
      JOIN vehicles v ON v.id = b.vehicle_id
      ORDER BY b.id DESC`
    );
    return result;
  }

  const result = await pool.query(
    `SELECT 
      b.id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      v.vehicle_name,
      v.registration_number,
      v.type
    FROM bookings b
    JOIN vehicles v ON v.id = b.vehicle_id
    WHERE b.customer_id = $1
    ORDER BY b.id DESC`,
    [customerId]
  );
  return result;
};

const updateBookingStatus = async (
  bookingId: string,
  status: string,
  user: any
) => {
  const bookingRes = await pool.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [bookingId]
  );

  if (bookingRes.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingRes.rows[0];

  const today = new Date();
  const startDate = new Date(booking.rent_start_date);
  const endDate = new Date(booking.rent_end_date);

  if (user.role === "customer") {
    if (booking.customer_id !== user.id) {
      throw new Error("You are not allowed to update this booking");
    }
    if (status !== "cancelled") {
      throw new Error("Customers can only cancel bookings");
    }
    if (today >= startDate) {
      throw new Error("You can only cancel before the start date");
    }
  }

  if (user.role === "admin") {
    if (!["cancelled", "returned"].includes(status)) {
      throw new Error("Admins can only set: returned or cancelled");
    }
  }

  const updatedBooking = await pool.query(
    `UPDATE bookings 
     SET status = $1, updated_at = NOW() 
     WHERE id = $2 
     RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status`,
    [status, bookingId]
  );

  if (status === "cancelled" || status === "returned") {
    await pool.query(
      `UPDATE vehicles SET availability_status = 'available', updated_at = NOW() WHERE id = $1`,
      [booking.vehicle_id]
    );
  }

  const vehicleRes = await pool.query(
    `SELECT availability_status FROM vehicles WHERE id = $1`,
    [booking.vehicle_id]
  );

  return {
    booking: updatedBooking.rows[0],
    vehicle: vehicleRes.rows[0],
  };
};

export const bookingService = {
  createBooking,
  getBookings,
  updateBookingStatus,
};
