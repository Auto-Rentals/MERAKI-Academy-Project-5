const connection = require("../../db/db");
const makeUserAdminById = async (req, res) => {
  let id = req.params.id;
  const query = `UPDATE users SET role="Admin" WHERE user_id=${id}`;

  connection.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: ` Server Error`,
        result: result,
      });
    }
    
    if (result.affectedRows) {
      return res.status(202).json({
        success: true,
        message: ` Success User updated`,
        result: result,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `user => ${id} not found`,
      });
    }
  });
};

const getAllUsers = (req, res) => {
  const query = `SELECT * FROM users WHERE role="user"`;

  connection.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: `Server Error`,
        err: err,
      });
    } else if (!result.length) {
      return res.status(404).json({
        success: false,
        message: `not found any user`,
      });
    }
    return res.status(200).json({
      success: true,
      message: "all users",
      result: result,
    });
  });
};

const toggleBlockUserById = (req, res) => {
  const id = req.params.id;
  const checkQuery = `SELECT is_Blocked FROM users WHERE user_id=${id} and role="user"`;
  let currentState = 0;
  connection.query(checkQuery, async (err, result) => {
    if (err) {
      throw err;
    }

    if (result) {
      currentState = await result[0].is_Blocked;
      let nextState = currentState === 0 ? 1 : 0;
      const query = `UPDATE users SET is_blocked=${nextState} WHERE user_id=${id} and role="user"`;

      connection.query(query, (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: `server error`,
          });
        }
        if (result.affectedRows) {
          return res.status(202).json({
            success: true,
            message: ` Success user blocked`,
            result: result,
          });
        } else {
          return res.status(404).json({
            success: false,
            message: `The result => ${id} not found`,
          });
        }
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `The result => ${id} not found`,
      });
    }
  });
};

module.exports = {
  makeUserAdminById,
  getAllUsers,
  toggleBlockUserById,
};
