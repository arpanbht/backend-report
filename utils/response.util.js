export const sendSuccess = (res, statusCode, data = {}, message) => {
  res.status(statusCode).json({
    success: true,
    message: message,
    data: data,
  });
};

export const sendError = (res, statusCode, message) => {
  res.status(statusCode).json({
    success: false,
    message: message,
  });
};
