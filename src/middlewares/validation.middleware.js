const JoiSchemaValidation = (schema) => {
  return async (req, res, next) => {
    try {
      const result = await schema.validateAsync(req.body, { abortEarly: true });
      if (result.error) {
        throw new Error(result.error);
      } else {
        next();
      }
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  };
};

module.exports = JoiSchemaValidation;
