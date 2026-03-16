// PAYWALL SYSTEM
//  change version  when you change free access codes
const CODE_VERSION = "v2";


const validCodes = [
 "gatsby",
 "vip"
];

function checkQRUnlock(){

 const params = new URLSearchParams(window.location.search);
 const code = params.get("access");

 if(!code) return;

 const validCodes = [
  "gatsby",
  "vip"
 ];

 if(validCodes.includes(code)){

   unlockGuide(90);

 }

}





let deviceId = localStorage.getItem("deviceId");

if (!deviceId) {
 deviceId = crypto.randomUUID();
 localStorage.setItem("deviceId", deviceId);
}

function hasAccess(){

 const unlocked = localStorage.getItem("guideUnlocked");
 const expire = localStorage.getItem("guideExpire");
 const version = localStorage.getItem("guideCodeVersion");

 if(!unlocked || !expire) return false;

 if(version !== CODE_VERSION) return false;

 return new Date(expire) > new Date();
}

function unlockGuide(days=90){

 const expire = new Date();
 expire.setDate(expire.getDate()+days);

 localStorage.setItem("guideUnlocked",true);
 localStorage.setItem("guideExpire",expire);
 localStorage.setItem("guideCodeVersion",CODE_VERSION);

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

 window.location.href="https://buy.stripe.com/dRm4gy7798Amb7p6gkeQM05";
}

function unlockWithCode(){

 const code=document.getElementById("accessCode").value;



 if(validCodes.includes(code)){
  unlockGuide(90);
 }else{
  alert("Invalid code");
 }

}


function openUnlockModal(){
document.getElementById("unlockModal").style.display="flex";
}

function closeUnlockModal(){
document.getElementById("unlockModal").style.display="none";
}


checkQRUnlock();