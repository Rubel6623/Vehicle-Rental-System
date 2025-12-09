import { pool } from "../../config/db";


const createVehicle = async(payload: Record<string, unknown>) =>{
  const {vehicle_name, type,registration_number, daily_rent_price, availability_status} = payload;

  const result = await pool.query(`INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`, [vehicle_name, type,registration_number, daily_rent_price as number, availability_status]);

  return result;
};

const getVehicles = async() =>{
  const result = await pool.query(`SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles`);
  return result;
};

const getSingleVehicle = async(id: string) =>{
  const result = await pool.query(`SELECT id, vehicle_name, type,registration_number, daily_rent_price, availability_status FROM vehicles WHERE id = $1`, [id])
  
  return result;
}

const updateVehicle = async(vehicle_name:string, type:string, registration_number:string, daily_rent_price:number, availability_status:string, id:string) =>{

  const result = await pool.query(`UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`, [vehicle_name, type,registration_number, daily_rent_price, availability_status, id]);

  result.rows[0].daily_rent_price = Number(result.rows[0].daily_rent_price);


  delete result.rows[0].created_at;
  delete result.rows[0].updated_at;

  // console.log(result);

  return result;
}

const deleteVehicle = async(id: string) =>{

  const activeBookings = await pool.query(
    `SELECT id FROM bookings WHERE vehicle_id = $1 AND status = 'active'`,
    [id]
  );

  if (activeBookings.rowCount! > 0) {
    return { booked: true };
  }

  const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);

  return {booked: false, result};
}

export const vehicleService = {
  createVehicle,
  getVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle
}
