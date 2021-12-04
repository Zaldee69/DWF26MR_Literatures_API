const { collection, users, literatures } = require("../../models");

exports.addCollection = async (req, res) => {
  const collectionExist = await collection.findOne({
    where: {
      literature: req.body.id,
    },
  });

  if (collectionExist && req.user.id === collectionExist.dataValues.user) {
    res.status(400).send({
      status: "failed",
      message: "Collection already exist",
    });
  } else {
    try {
      await collection.create({
        user: req.user.id,
        literature: req.body.id,
      });

      res.status(200).send({
        status: "succes",
        message: "add collections succes",
      });
    } catch (error) {
      res.status(500).send({
        status: "failed",
        message: "add collection failed",
      });
    }
  }
};

exports.getCollection = async (req, res) => {
  try {
    const { id } = req.user;
    const collectionsData = await collection.findAll({
      where: {
        user: id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "id", "user", "literature"],
      },
      include: [
        {
          model: users,
          as: "users",
          attributes: {
            exclude: [
              "password",
              "gender",
              "role",
              "profile_pic",
              "createdAt",
              "updatedAt",
            ],
          },
        },
        {
          model: literatures,
          as: "literatures",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });

    res.status(200).send({
      status: "success",
      message: "get collection success",
      collectionsData,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "get collection failed",
    });
  }
};
