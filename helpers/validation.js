const z = require("zod");

const SendOTP = z.object({
  email:z.string().email({ message: "Invalid email address" }),
});

const VerifyOTP = z.object({
  email:z.string().email({ message: "Invalid email address" }),
  otp: z.string().length(5),
});

module.exports = {
  SendOTP: SendOTP,
  VerifyOTP: VerifyOTP,
};
