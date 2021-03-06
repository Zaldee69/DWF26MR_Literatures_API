const { literatures, users } = require("../../models");
const cloudinary = require("../thirdparty/cloudinary");

exports.addLiteratures = async (req, res) => {
  try {
    const results = await cloudinary.uploader.upload(req.files.image[0].path, {
      folder: "literatures",
      use_filename: true,
    });

    const literaturesData = await literatures.create({
      ...req.body,
      isbn: Date.now(),
      status: "Waiting Approve",
      attachment: results.public_id,
      user: req.user.id,
      pages: parseInt(req.body.pages),
    });

    res.status(200).send({
      status: "success",
      message: "add literature success",
      literaturesData,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "add literature failed",
    });
  }
};

exports.getLiteratures = async (req, res) => {
  try {
    const data = await literatures.findAll({
      order: [["id", "DESC"]],
      include: [
        {
          model: users,
          as: "users",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "password",
              "gender",
              "role",
              "profile_pic",
            ],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "user"],
      },
    });

    const literaturesData = {
      data,
      attachment: cloudinary.url(data.profile_pic),
    };

    res.status(200).send({
      status: "success",
      message: "get literatures success",

      ...literaturesData,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "get literatures failed",
    });
  }
};

exports.getDetailLiteratures = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await literatures.findOne({
      where: {
        id,
      },
      include: [
        {
          model: users,
          as: "users",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "password",
              "gender",
              "role",
              "profile_pic",
            ],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "id", "user"],
      },
    });

    const literaturesData = {
      data,
      attachment: cloudinary.url(data.profile_pic),
    };

    res.status(200).send({
      status: "success",
      message: "get literatures success",
      ...literaturesData,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "get literatures failed",
    });
  }
};

exports.deleteLiteratures = async (req, res) => {
  try {
    const { id } = req.params;

    await literatures.destroy({
      where: {
        id,
      },
    });

    res.status(200).send({
      status: "success",
      message: "delete literatures success",
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "delete literatures failed",
    });
  }
};

exports.getSearchLiteratures = async (req, res) => {
  const titleQuery = req.query.title;

  const { Op } = require("sequelize");

  try {
    let data = await literatures.findAll({
      where: {
        title: {
          [Op.substring]: titleQuery,
        },
        status: "Approve",
      },
      include: [
        {
          model: users,
          as: "users",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "password",
              "gender",
              "role",
              "profile_pic",
            ],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"],
      },
    });

    const literaturesData = {
      data,
      attachment: cloudinary.url(data.profile_pic),
    };

    res.send({
      status: "Success",
      ...literaturesData,
    });
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};

exports.getLiteraturesByUserID = async (req, res) => {
  try {
    const { id } = req.user;
    const data = await literatures.findAll({
      where: {
        user: id,
      },
      include: [
        {
          model: users,
          as: "users",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "password",
              "gender",
              "role",
              "profile_pic",
            ],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "user"],
      },
    });

    const literaturesData = {
      data,
      attachment: cloudinary.url(data.profile_pic),
    };

    res.status(200).send({
      status: "success",
      message: "get literatures success",
      ...literaturesData,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "get literatures failed",
    });
  }
};

exports.literaturesVerifying = async (req, res) => {
  try {
    const { id } = req.params;

    await literatures.update(
      {
        status: req.body.status,
      },
      {
        where: {
          id,
        },
      }
    );

    res.status(200).send({
      status: "success",
      message: "edit liteatures success",
    });
  } catch (error) {
    console.log(error);
    res.send(500).send({
      status: "failed",
      message: "edit liteature success",
    });
  }
};

exports.editLiterature = async (req, res) => {
  try {
    const { id } = req.params;

    await literatures.update(
      {
        ...req.body,
        ...req.files,
      },
      {
        where: {
          id,
        },
      }
    );

    res.status(200).send({
      status: "success",
      message: "edit literatures success",
    });
  } catch (error) {
    res.send(500).send({
      status: "failed",
      message: "edit literature failed",
    });
  }
};
