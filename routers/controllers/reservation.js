const reservationModel = require("../../db/db");

const createNewReservation = (req, res) => {
  const users_id = req.token.user_id;
  const { returnDate, PickUpDate, amount, car_id } = req.body;
  const query = `INSERT INTO reservations (returnDate,PickUpDate,amount, users_id, car_id)VALUES(?,?,?,?,?)`;
  const data = [returnDate, PickUpDate, amount, users_id, car_id];

  reservationModel.query(query, data, (err, result) => {
    if (!result) {
      return res.status(500).json({
        success: false,
        message: `backend Server Error`,
      });
    }

    return res.status(201).json({
      success: true,
      message: `created Reservation `,
      Reservations: result,
    });
  });
};

const getAllReservationsByUserId = (req, res) => {
  const userId = req.token.user_id;
  const query = `SELECT * FROM reservations INNER JOIN users ON reservations.users_id= users.user_id
  INNER JOIN cars ON reservations.car_id=cars.car_id 
  INNER JOIN car_brands ON car_brand_id=car_brands.brand_id 
   INNER JOIN  car_types ON car_types_id = car_types.typeCar_id
  WHERE reservations.users_id=?`;
  

  const data = [userId];

  reservationModel.query(query, data, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: `Server Error`,
        key: err,
      });
    } else if (result.length) {
      return res.status(201).json({
        success: true,
        message: `All Reservation `,
        Reservations: result,
      });
    }
    return res.status(400).json({
      success: false,
      message: `No result `,
    });
  });
};

const updateReservationById = (req, res) => {
  const id = req.params.id;
  const { returnDate, PickUpDate, amount } = req.body;
  const query = `UPDATE reservations SET returnDate=?,PickUpDate=?,amount=? WHERE res_id=${id}`;
  const data = [returnDate, PickUpDate, amount];

  reservationModel.query(query, data, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: `The Reservation => ${id} not found`,
      });
    } else if (result.affectedRows) {
      return res.status(202).json({
        success: true,
        message: ` Success updated`,
        reservation: result,
      });
    }
    return res.status(404).json({
      success: false,
      message: ` Not found`,
    });
  });
};

const deleteReservationById = (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM reservations WHERE res_id=${id}`;
  reservationModel.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: `The  Reservation => ${id} not found`,
      });
    } else if (result.affectedRows) {
      return res.status(202).json({
        success: true,
        message: ` Success Deleted`,
        reservation: result,
      });
    }
    return res.status(404).json({
      success: false,
      message: ` Not found`,
    });
  });
};

const checkprofile = (req, res) => {
  const id = req.token.user_id;
  const query = `SELECT  license_img  FROM users where user_id=${id}`;

  reservationModel.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: `Server Error`,
        key: err,
      });
    } else if (result.length) {
      const status = result[0].license_img ? true : false;
      return res.status(201).json({
        success: true,
        message: `All Reservation `,
        status: status,
      });
    } else if (!result.length) {
      return res.status(404).json({
        success: true,
        message: `All Reservation `,
        status: false,
      });
    }
  });
};

module.exports = {
  createNewReservation,
  getAllReservationsByUserId,
  updateReservationById,
  deleteReservationById,
  checkprofile,
};
