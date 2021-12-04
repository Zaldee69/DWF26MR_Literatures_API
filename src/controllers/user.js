const { users } = require("../../models");

exports.editUser = async (req, res) => {
  try {
    const { id } = req.user;
    const userData = await users.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });
    await users.update(
      {
        ...userData,
        profile_pic: process.env.PATH + req.files.image[0].filename,
      },
      {
        where: {
          id,
        },
      }
    );

    res.status(200).send({
      status: "success",
      message: "edit user success",
      userData,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "edit user failed",
    });
  }
};
