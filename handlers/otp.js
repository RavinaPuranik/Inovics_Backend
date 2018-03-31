exports.generator =async () => {
  let length = 6;
  let s = '0123456789';
  let otp='';
  for(let i = 0 ; i < 6; i++ ){
    otp += s.charAt(Math.floor(Math.random()*10));
  }
  return otp;
}
