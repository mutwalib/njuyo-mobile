export function otpValidator(otp) {
  if (otp.length < 6) return "OTP can't be less than 6.";
  return '';
}
