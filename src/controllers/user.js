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

    const result = await cloudinary.uploader.upload(req.files.image[0].path, {
      folder: "literatures",
      use_filename: true,
      unique_filename: true,
    });

    console.log(result);

    await users.update(
      {
        ...userData,
        profile_pic: result.public_id,
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
    console.log(req.files.image[0].path);

    res.status(500).send({
      status: "failed",
      message: "edit user failed",
    });
  }
};
