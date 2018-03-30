exports.generator =async (length) => {
  const keys = '123456789';
  let otp = '';
  for(let i=0;i<length;i++){
    otp += keys.charAt(Math.floor(Math.random()*9 + 1));
  }
  if(otp.length < 6){
    for(let i = 0; i < (length - otp.length) ; i++){
      otp += '0'
    }
  }
  return otp;
}
