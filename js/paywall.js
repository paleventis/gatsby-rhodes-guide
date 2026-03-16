// PAYWALL SYSTEM

let deviceId = localStorage.getItem("deviceId");

if (!deviceId) {
 deviceId = crypto.randomUUID();
 localStorage.setItem("deviceId", deviceId);
}

function hasAccess(){

 const unlocked = localStorage.getItem("guideUnlocked");

 if(!unlocked) return false;

 const expire = localStorage.getItem("guideExpire");

 if(!expire) return false;

 return new Date(expire) > new Date();
}

function unlockGuide(days=90){

 const expire = new Date();
 expire.setDate(expire.getDate()+days);

 localStorage.setItem("guideUnlocked",true);
 localStorage.setItem("guideExpire",expire);

 location.reload();
}

function openUnlockModal(){
 document.getElementById("unlockModal").style.display="flex";
}

function closeUnlockModal(){
 document.getElementById("unlockModal").style.display="none";
}

function startPayment(){

 const email=document.getElementById("userEmail").value;

 if(!email){
  alert("Enter email");
  return;
 }

 localStorage.setItem("userEmail",email);

 window.location.href="https://buy.stripe.com/YOUR_STRIPE_LINK";
}

function unlockWithCode(){

 const code=document.getElementById("accessCode").value;

 const validCodes=[
  "gatsby",
  "vip"
 ];

 if(validCodes.includes(code)){
  unlockGuide(90);
 }else{
  alert("Invalid code");
 }

}