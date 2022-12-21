import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const blogPostSchema = {
  category: {
    name: {
      in: ["body"],
      isString: {
        errorMessage: "category is mandatory field and has to be a string",
      },
    },
  },
  title: {
    name: {
      in: ["body"],
      isString: {
        errorMessage: "title is mandatory field and has to be a string",
      },
    },
  },
  autor: {
    name: {
      in: ["body"],
      isString: {
        errorMessage: "author name is mandatory field and has to be a string",
      },
    },
  },
};
export const checksBlogPostsSchema = checkSchema(blogPostSchema);
export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Errors during Blog Post validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next();
  }
};
