import { Router } from 'express';
import { getCompanyName, verifyCompanyOwnership } from '../utils/db.js';
import { requireAuth } from '../middleware/auth.js';
import { PersonFormFiller } from '../form/PersonFormFiller.js';
import { VehicleFormFiller } from '../form/VehicleFormFiller.js';
import { PhotographyFormFiller } from '../form/PhotographyFormFiller.js';
import { ShipFormFiller } from '../form/ShipFormFiller.js';

async function insertPersonPermit(client, userId, body) {
  const companyResult = await client.query(
    `SELECT name, code FROM company WHERE company_id = $1`,
    [body.companyId]
  );
  const companyName = companyResult.rows[0]?.name;
  const companyCode = companyResult.rows[0]?.code ?? '';
  if (!companyName) {
    throw new Error('Invalid company ID');
  }

  const lookupLabel = async (table, code) => {
    if (!code) return '';
    const result = await client.query(
      `SELECT arabic FROM ${table} WHERE code = $1`,
      [code]
    );
    return result.rows[0]?.arabic ?? '';
  };

  const [nationalityName, occupationName, religionName] = await Promise.all([
    lookupLabel('nationalities', body.nationality),
    lookupLabel('occupations', body.occupation),
    lookupLabel('religions', body.religionDen)
  ]);

  const insertResult = await client.query(
    `INSERT INTO person_permits (
      user_id, company_name, representative, permit_type, transaction_type,
      unified_no, name_arabic, nationality, religion_den,
      passport_no, passportexpirydate, full_residence_no, occupation, emirates_id_no, mol_no,
      mobile_no, permission_no, dob, expiry_date1, expiry_date2,
      email, instagram, twitter, facebook, others, remarks, permitted_locations
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27)
    RETURNING *`,
    [
      userId, companyName, body.representative, body.permitType,
      body.transactionType, body.unifiedNo, body.nameArabic,
      body.nationality, body.religionDen, body.passportNo,
      body.passportExpiryDate, body.fullResidenceNo, body.occupation, body.emiratesIdNo,
      body.molNo, body.mobileNo, body.permissionNo, body.dob,
      body.expiryDate1, body.expiryDate2, body.email,
      body.instagram, body.twitter, body.facebook,
      body.others, body.remarks, JSON.stringify(body.permittedLocations || [])
    ]
  );

  return {
    permit: insertResult.rows[0],
    companyCode,
    nationalityName,
    occupationName,
    religionName
  };
}

async function insertVehiclePermit(client, userId, body) {
  const companyResult = await client.query(
    `SELECT name, code FROM company WHERE company_id = $1`,
    [body.companyId]
  );
  const companyName = companyResult.rows[0]?.name;
  const companyCode = companyResult.rows[0]?.code ?? '';
  if (!companyName) {
    throw new Error('Invalid company ID');
  }

  const lookupLabel = async (table, code) => {
    if (!code) return '';
    const result = await client.query(
      `SELECT arabic FROM ${table} WHERE code = $1`,
      [code]
    );
    return result.rows[0]?.arabic ?? '';
  };

  const [nationalityName, occupationName, religionName] = await Promise.all([
    lookupLabel('nationalities', body.nationality),
    lookupLabel('occupations', body.occupation),
    lookupLabel('religions', body.religionDen)
  ]);

  const insertResult = await client.query(
    `INSERT INTO vehicle_permits (
      user_id, company_name, representative, permit_type, transaction_type,
      unified_no, name_arabic, nationality, religion_den,
      passport_no, full_residence_no, occupation, emirates_id_no,
      mobile_no, dob, expiry_date1, expiry_date2,
      email, instagram, twitter, facebook, others, remarks, permitted_locations,
      vehicle_prm_no, vehicle_number, plate_kind, owner_name, vehicle_category,
      engine_number, corres_no, place_of_issue, vehicle_type, plate_color,
      chassis_number, regist_expiry, corres_expiry, vehicle_color
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
      $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
      $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,
      $31,$32,$33,$34,$35,$36,$37,$38
    )
    RETURNING *`,
    [
      userId, companyName, body.representative, body.permitType,
      body.transactionType, body.unifiedNo, body.nameArabic,
      body.nationality, body.religionDen, body.passportNo,
      body.fullResidenceNo, body.occupation, body.emiratesIdNo,
      body.mobileNo, body.dob, body.expiryDate1, body.expiryDate2,
      body.email, body.instagram, body.twitter, body.facebook,
      body.others, body.remarks, JSON.stringify(body.permittedLocations || []),
      body.vehiclePrmNo, body.vehicleNumber, body.plateKind1, body.ownerName, body.vehicleCategory,
      body.engineNo, body.corresNo, body.placeOfIssue, body.vehicleType, body.plateKind2,
      body.chassisNumber, body.registExpiry, body.corresExpiry, body.vehicleColor
    ]
  );

  return {
    permit: insertResult.rows[0],
    companyCode,
    nationalityName,
    occupationName,
    religionName
  };
}

async function insertPhotographyPermit(client, userId, body) {
  const companyResult = await client.query(
    `SELECT name, code FROM company WHERE company_id = $1`,
    [body.companyId]
  );
  const companyName = companyResult.rows[0]?.name;
  const companyCode = companyResult.rows[0]?.code ?? '';
  if (!companyName) {
    throw new Error('Invalid company ID');
  }

  const lookupLabel = async (table, code) => {
    if (!code) return '';
    const result = await client.query(
      `SELECT arabic FROM ${table} WHERE code = $1`,
      [code]
    );
    return result.rows[0]?.arabic ?? '';
  };

  const [nationalityName, occupationName, religionName] = await Promise.all([
    lookupLabel('nationalities', body.nationality),
    lookupLabel('occupations', body.occupation),
    lookupLabel('religions', body.religionDen)
  ]);

  const insertResult = await client.query(
    `INSERT INTO photography_permits (
      user_id, company_name, representative, permit_type, transaction_type,
      unified_no, name_arabic, nationality, religion_den,
      passport_no, full_residence_no, occupation, emirates_id_no,
      mobile_no, permission_no, dob, expiry_date1, expiry_date2,
      remarks, cameras, permitted_locations
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
    RETURNING *`,
    [
      userId, companyName, body.representative, body.permitType,
      body.transactionType, body.unifiedNo, body.nameArabic,
      body.nationality, body.religionDen, body.passportNo,
      body.fullResidenceNo, body.occupation, body.emiratesIdNo,
      body.mobileNo, body.permissionNo, body.dob,
      body.expiryDate1, body.expiryDate2, body.remarks,
      JSON.stringify(body.cameras || []), JSON.stringify(body.permittedLocations || [])
    ]
  );

  return {
    permit: insertResult.rows[0],
    companyCode,
    nationalityName,
    occupationName,
    religionName
  };
}

async function insertShipPermit(client, userId, body) {
  const companyResult = await client.query(
    `SELECT name, code FROM company WHERE company_id = $1`,
    [body.companyId]
  );
  const companyName = companyResult.rows[0]?.name;
  const companyCode = companyResult.rows[0]?.code ?? '';
  if (!companyName) {
    throw new Error('Invalid company ID');
  }

  const insertResult = await client.query(
    `INSERT INTO ship_permits (
      user_id, company_name, representative, permit_type, transaction_type,
      ship_prm_no, ship_number, ship_name, crew_count, total_weight,
      call_sign_channel, navig_lic_validity, ships_owner, ships_category,
      ships_nationality, registration_port, permanent_harbor, assigned_activity,
      remarks, crew, permitted_locations
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
    RETURNING *`,
    [
      userId, companyName, body.representative, body.permitType,
      body.transactionType, body.shipPrmNo, body.shipNumber,
      body.shipName, body.crewCount, body.totalWeight,
      body.callSignChannel, body.navigLicValidity, body.shipsOwner,
      body.shipsCategory, body.shipsNationality, body.registrationPort,
      body.permanentHarbor, body.assignedActivity, body.remarks,
      JSON.stringify(body.crew || []), JSON.stringify(body.permittedLocations || [])
    ]
  );

  return {
    permit: insertResult.rows[0],
    companyCode
  };
}

export default function(pool) {
  const router = Router();

  router.post('/person', requireAuth, async (req, res) => {
    const client = await pool.connect();
    
    try {
      const userId = req.user.id;

      await client.query('BEGIN');

      const {
        permit,
        companyCode,
        nationalityName,
        occupationName,
        religionName
      } = await insertPersonPermit(client, userId, req.body);

      await client.query(
        `INSERT INTO permit_representative_index (permit_type, rep, company_id, permit_id, is_draft)
         VALUES ($1, $2, $3, $4, $5)`,
        [1, userId, req.body.companyId, permit.id, req.body.isDraft]
      );

      await client.query('COMMIT');

      console.log('Inserted person_permits row:', permit);
      if (req.body.isDraft === false) {
        const pdfBuffer = Buffer.from(
          await PersonFormFiller({
            ...req.body,
            companyName: permit.company_name,
            companyNameCode: companyCode,
            nationalityCode: req.body.nationality,
            religionCode: req.body.religionDen,
            occupationCode: req.body.occupation,
            nationality: nationalityName,
            religionDen: religionName,
            occupation: occupationName
          })
        );
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
        res.status(201).send(pdfBuffer);
        return;
      }

      res.status(201).json({ success: true, message: "saved to database", data: permit });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("Error in /api/data/person:", error);
      console.error("Request body:", req.body);
      res.status(500).json({ success: false, error: error.message });
    } finally {
      client.release();
    }
  });

  router.post('/vehicle', requireAuth, async (req, res) => {
    const client = await pool.connect();

    try {
      const userId = req.user.id;

      await client.query('BEGIN');

      const {
        permit,
        companyCode,
        nationalityName,
        occupationName,
        religionName
      } = await insertVehiclePermit(client, userId, req.body);

      await client.query(
        `INSERT INTO permit_representative_index (permit_type, rep, company_id, permit_id, is_draft)
         VALUES ($1, $2, $3, $4, $5)`,
        [2, userId, req.body.companyId, permit.id, req.body.isDraft]
      );

      await client.query('COMMIT');

      console.log('Inserted vehicle_permits row:', permit);
      if (req.body.isDraft === false) {
        const permittedLocations = req.body.permittedLocations || [];
        const locationFields = permittedLocations.reduce((acc, location, index) => {
          if (index >= 6) return acc;
          const slot = index + 1;
          acc[`ContractNo${slot}`] = location?.contractNo ?? '';
          acc[`permittedLocationCode${slot}`] = location?.contractLocationsNo ?? '';
          acc[`permittedLocationName${slot}`] = location?.contractLocationsDesc ?? '';
          return acc;
        }, {});

        const pdfBuffer = Buffer.from(
          await VehicleFormFiller({
            ...req.body,
            companyName: permit.company_name,
            companyNameCode: companyCode,
            permitNo: req.body.vehiclePrmNo,
            vehicleNo: req.body.vehicleNumber,
            plateKind: req.body.plateKind1,
            plateColor: req.body.plateKind2,
            vehicleNationality: req.body.nationalityVehicle,
            vehicleKind: req.body.vehicleType,
            vehicleCateg: req.body.vehicleCategory,
            chasisNo: req.body.chassisNumber,
            corresDate: req.body.corresExpiry,
            unifiedId: req.body.unifiedNo,
            name: req.body.nameArabic,
            secPermitNo: req.body.personPrmNo,
            nationalityCode: req.body.nationality,
            nationality: nationalityName,
            religionCode: req.body.religionDen,
            religion: religionName,
            occupationCode: req.body.occupation,
            occupation: occupationName,
            residenceNo: req.body.fullResidenceNo,
            dateOfBirth: req.body.dob,
            passportExpiryDate: req.body.expiryDate1,
            residenceExpiryDate: req.body.expiryDate2,
            ...locationFields
          })
        );
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
        res.status(201).send(pdfBuffer);
        return;
      }

      res.status(201).json({ success: true, message: "saved to database", data: permit });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("Error in /api/data/vehicle:", error);
      console.error("Request body:", req.body);
      res.status(500).json({ success: false, error: error.message });
    } finally {
      client.release();
    }
  });

  router.post('/photography', requireAuth, async (req, res) => {
    const client = await pool.connect();

    try {
      const userId = req.user.id;

      await client.query('BEGIN');

      const {
        permit,
        companyCode,
        nationalityName,
        occupationName,
        religionName
      } = await insertPhotographyPermit(client, userId, req.body);

      await client.query(
        `INSERT INTO permit_representative_index (permit_type, rep, company_id, permit_id, is_draft)
         VALUES ($1, $2, $3, $4, $5)`,
        [4, userId, req.body.companyId, permit.id, req.body.isDraft]
      );

      await client.query('COMMIT');

      console.log('Inserted photography_permits row:', permit);
      if (req.body.isDraft === false) {
        const cameras = req.body.cameras || [];
        const cameraFields = cameras.reduce((acc, camera, index) => {
          if (index >= 6) return acc;
          const slot = index + 1;
          acc[`cameraNo${slot}`] = camera?.cameraNo ?? '';
          acc[`cameraBrand${slot}`] = camera?.cameraBrand ?? '';
          return acc;
        }, {});

        const permittedLocations = req.body.permittedLocations || [];
        const locationFields = permittedLocations.reduce((acc, location, index) => {
          if (index >= 6) return acc;
          const slot = index + 1;
          acc[`contractNo${slot}`] = location?.contractNo ?? '';
          acc[`permittedLocationCode${slot}`] = location?.contractLocationsNo ?? '';
          acc[`permittedLocationName${slot}`] = location?.contractLocationsDesc ?? '';
          return acc;
        }, {});

        const pdfBuffer = Buffer.from(
          await PhotographyFormFiller({
            ...req.body,
            companyName: permit.company_name,
            companyNameCode: companyCode,
            permitNo: req.body.permissionNo,
            unifiedId: req.body.unifiedNo,
            name: req.body.nameArabic,
            secPermitNo: req.body.permissionNo,
            nationalityCode: req.body.nationality,
            nationality: nationalityName,
            religionCode: req.body.religionDen,
            religion: religionName,
            occupationCode: req.body.occupation,
            occupation: occupationName,
            residenceNo: req.body.fullResidenceNo,
            dateOfBirth: req.body.dob,
            passportExpiryDate: req.body.expiryDate1,
            residenceExpiryDate: req.body.expiryDate2,
            ...cameraFields,
            ...locationFields
          })
        );
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
        res.status(201).send(pdfBuffer);
        return;
      }

      res.status(201).json({ success: true, message: "saved to database", data: permit });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("Error in /api/data/photography:", error);
      console.error("Request body:", req.body);
      res.status(500).json({ success: false, error: error.message });
    } finally {
      client.release();
    }
  });

  router.post('/ship', requireAuth, async (req, res) => {
    const client = await pool.connect();

    try {
      const userId = req.user.id;

      await client.query('BEGIN');

      const {
        permit,
        companyCode
      } = await insertShipPermit(client, userId, req.body);

      await client.query(
        `INSERT INTO permit_representative_index (permit_type, rep, company_id, permit_id, is_draft)
         VALUES ($1, $2, $3, $4, $5)`,
        [3, userId, req.body.companyId, permit.id, req.body.isDraft]
      );

      await client.query('COMMIT');

      console.log('Inserted ship_permits row:', permit);
      if (req.body.isDraft === false) {
        const crew = req.body.crew || [];
        const crewFields = crew.reduce((acc, member, index) => {
          if (index >= 10) return acc;
          const slot = index + 1;
          acc[`name${slot}`] = member?.name ?? '';
          acc[`applicantPermissionNo${slot}`] = member?.permissionNo ?? '';
          return acc;
        }, {});

        const permittedLocations = req.body.permittedLocations || [];
        const locationFields = permittedLocations.reduce((acc, location, index) => {
          if (index >= 6) return acc;
          const slot = index + 1;
          acc[`contractNo${slot}`] = location?.contractNo ?? '';
          acc[`permittedLocationCode${slot}`] = location?.contractLocationsNo ?? '';
          acc[`permittedLocation${slot}`] = location?.contractLocationsDesc ?? '';
          return acc;
        }, {});

        const pdfBuffer = Buffer.from(
          await ShipFormFiller({
            ...req.body,
            companyName: permit.company_name,
            companyNameCode: companyCode,
            permitNo: req.body.shipPrmNo,
            shipNo: req.body.shipNumber,
            callSignChannelLeft: req.body.callSignChannel,
            callSignChannelRight: req.body.callSignChannel,
            licenseExpiry: req.body.navigLicValidity,
            ownerName: req.body.shipsOwner,
            category: req.body.shipsCategory,
            shipNationality: req.body.shipsNationality,
            assignedWork: req.body.assignedActivity,
            ...crewFields,
            ...locationFields
          })
        );
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
        res.status(201).send(pdfBuffer);
        return;
      }

      res.status(201).json({ success: true, message: "saved to database", data: permit });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("Error in /api/data/ship:", error);
      console.error("Request body:", req.body);
      res.status(500).json({ success: false, error: error.message });
    } finally {
      client.release();
    }
  });

  router.post('/photography', requireAuth, async (req, res) => {
    const client = await pool.connect();
    
    try {
      const userId = req.user.id;

      const companyName = await getCompanyName(pool, req.body.companyId);
      if (!companyName) {
        return res.status(400).json({ error: 'Invalid company ID' });
      }

      await client.query('BEGIN');

      const insertResult = await client.query(
        `INSERT INTO photography_permits (
          user_id, company_name, representative, permit_type, transaction_type,
          unified_no, name_arabic, nationality, religion_den,
          passport_no, full_residence_no, occupation, emirates_id_no,
          mobile_no, permission_no, dob, expiry_date1, expiry_date2,
          remarks, cameras, permitted_locations
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
        RETURNING *`,
        [
          userId, companyName, req.body.representative, req.body.permitType,
          req.body.transactionType, req.body.unifiedNo, req.body.nameArabic,
          req.body.nationality, req.body.religionDen, req.body.passportNo,
          req.body.fullResidenceNo, req.body.occupation, req.body.emiratesIdNo,
          req.body.mobileNo, req.body.permissionNo, req.body.dob,
          req.body.expiryDate1, req.body.expiryDate2, req.body.remarks,
          JSON.stringify(req.body.cameras || []), JSON.stringify(req.body.permittedLocations || [])
        ]
      );

      const permit = insertResult.rows[0];

      await client.query(
        `INSERT INTO permit_representative_index (permit_type, rep, company_id, permit_id, is_draft)
         VALUES ($1, $2, $3, $4, $5)`,
        [4, userId, req.body.companyId, permit.id, req.body.isDraft]
      );

      await client.query('COMMIT');

      res.status(201).json({ success: true, message: "saved to database", data: permit });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("Error in /api/data/photography:", error);
      res.status(500).json({ success: false, error: error.message });
    } finally {
      client.release();
    }
  });

  return router;
}
