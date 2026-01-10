import { pool } from '../utils/db.js';

const permitTypeMap = {
  1: 'person_permits',
  2: 'vehicle_permits',
  3: 'ship_permits',
  4: 'photography_permits'
};

async function getPermitIdsByCompany(companyId, permitType) {
  const result = await pool.query(
    `select permit_id, is_draft
     from permit_representative_index
     where company_id = $1 and permit_type = $2`,
    [companyId, permitType]
  );
  return result.rows;
}

export async function getPersonPermitIdsByCompany(companyId) {
  return getPermitIdsByCompany(companyId, 1);
}

export async function getVehiclePermitIdsByCompany(companyId) {
  return getPermitIdsByCompany(companyId, 2);
}

export async function getShipPermitIdsByCompany(companyId) {
  return getPermitIdsByCompany(companyId, 3);
}

export async function getPhotographyPermitIdsByCompany(companyId) {
  return getPermitIdsByCompany(companyId, 4);
}

export async function getPermitRowByType(permitType, permitId) {
  const table = permitTypeMap[permitType];
  if (!table) {
    return null;
  }

  const result = await pool.query(
    `select * from ${table} where id = $1`,
    [permitId]
  );

  return result.rows[0] || null;
}

export async function getPermitIndexById(permitId) {
  const result = await pool.query(
    `select permit_type, permit_id, company_id, is_draft
     from permit_representative_index
     where permit_id = $1
     limit 1`,
    [permitId]
  );

  return result.rows[0] || null;
}
