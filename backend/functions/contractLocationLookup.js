const isUuid = (value) => typeof value === 'string' && /^[0-9a-fA-F-]{36}$/.test(value);

export async function getContractLocationByContractNo(db, repId, contractNo) {
  const numericContractNo = Number(contractNo);
  if (!isUuid(repId)) {
    throw new Error('Invalid representative id');
  }
  if (!Number.isInteger(numericContractNo)) {
    throw new Error('Invalid contract number');
  }

  const result = await db.query(
    `SELECT
        contract_no,
        location AS contract_locations_no,
        description AS contract_locations_desc,
        start_date,
        end_date
     FROM missions
     WHERE rep = $1
       AND contract_no = $2
     LIMIT 1`,
    [repId, numericContractNo]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    contractNo: String(row.contract_no ?? ''),
    contractLocationsNo: String(row.contract_locations_no ?? ''),
    contractLocationsDesc: String(row.contract_locations_desc ?? ''),
    startDate: row.start_date == null ? '' : String(row.start_date),
    endDate: row.end_date == null ? '' : String(row.end_date)
  };
}
