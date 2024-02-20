const Joi = require("joi")


const userSchema = Joi.object({
  
  firstname: Joi.string().max(255).required(),
  lastname: Joi.string().max(255).required(),
  email: Joi.string()
  .max(255)
  .regex(/[a-z0-9._]+@[a-z0-9-]+\.[a-z]{2,3}/)
  .required(),
});

const validateUser = (req, res, next) => {
  const { firstname, lastname, email } = req.body;

  const { error } = userSchema.validate(
    { firstname, lastname, email },
    { abortEarly: false }
  );

  if (error) {
    res.status(422).json({ validationErrors: error.details });
  } else {
    next();
  }
};

module.exports = validateUser