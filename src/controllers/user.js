const { users } = require("../../models");
const cloudinary = require("../thirdparty/cloudinary");

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

    const results = await cloudinary.uploader.upload(req.files.image[0].path, {
      folder: "literatures",
      use_filename: true,
    });

    console.log(results);

    await users.update(
      {
        ...userData,
        profile_pic: results.public_id,
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
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "edit user failed",
    });
  }
};
