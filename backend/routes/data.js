import { Router } from 'express';
import { getCompanyName, verifyCompanyOwnership } from '../utils/db.js';
import { requireAuth } from '../middleware/auth.js';

export default function(pool) {
  const router = Router();

  router.post('/person', requireAuth, async (req, res) => {
    const client = await pool.connect();
    
    try {
      const userId = req.user.id;

      const companyName = await getCompanyName(pool, req.body.companyId);
      if (!companyName) {
        return res.status(400).json({ error: 'Invalid company ID' });
      }

      await client.query('BEGIN');

      const insertResult = await client.query(
        `INSERT INTO person_permits (
          user_id, company_name, representative, permit_type, transaction_type,
          unified_no, name_arabic, nationality, religion_den,
          passport_no, full_residence_no, occupation, emirates_id_no,
          mobile_no, permission_no, dob, expiry_date1, expiry_date2,
          email, instagram, twitter, facebook, others, remarks, permitted_locations
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)
        RETURNING *`,
        [
          userId, companyName, req.body.representative, req.body.permitType,
          req.body.transactionType, req.body.unifiedNo, req.body.nameArabic,
          req.body.nationality, req.body.religionDen, req.body.passportNo,
          req.body.fullResidenceNo, req.body.occupation, req.body.emiratesIdNo,
          req.body.mobileNo, req.body.permissionNo, req.body.dob,
          req.body.expiryDate1, req.body.expiryDate2, req.body.email,
          req.body.instagram, req.body.twitter, req.body.facebook,
          req.body.others, req.body.remarks, JSON.stringify(req.body.permittedLocations || [])
        ]
      );

      const permit = insertResult.rows[0];

      await client.query(
        `INSERT INTO permit_representative_index (permit_type, rep, company_id, permit_id, is_draft)
         VALUES ($1, $2, $3, $4, $5)`,
        [1, userId, req.body.companyId, permit.id, req.body.isDraft]
      );

      await client.query('COMMIT');

      res.status(201).json({ success: true, message: "saved to database", data: permit });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("Error in /api/data/person:", error);
      res.status(500).json({ success: false, error: error.message });
    } finally {
      client.release();
    }
  });

  router.post('/ship', requireAuth, async (req, res) => {
    const client = await pool.connect();
    
    try {
      const userId = req.user.id;

      const companyName = await getCompanyName(pool, req.body.companyId);
      if (!companyName) {
        return res.status(400).json({ error: 'Invalid company ID' });
      }

      await client.query('BEGIN');

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
          userId, companyName, req.body.representative, req.body.permitType,
          req.body.transactionType, req.body.shipPrmNo, req.body.shipNumber,
          req.body.shipName, req.body.crewCount, req.body.totalWeight,
          req.body.callSignChannel, req.body.navigLicValidity, req.body.shipsOwner,
          req.body.shipsCategory, req.body.shipsNationality, req.body.registrationPort,
          req.body.permanentHarbor, req.body.assignedActivity, req.body.remarks,
          JSON.stringify(req.body.crew || []), JSON.stringify(req.body.permittedLocations || [])
        ]
      );

      const permit = insertResult.rows[0];

      await client.query(
        `INSERT INTO permit_representative_index (permit_type, rep, company_id, permit_id, is_draft)
         VALUES ($1, $2, $3, $4, $5)`,
        [3, userId, req.body.companyId, permit.id, req.body.isDraft]
      );

      await client.query('COMMIT');

      res.status(201).json({ success: true, message: "saved to database", data: permit });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("Error in /api/data/ship:", error);
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