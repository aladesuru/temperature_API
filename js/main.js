// Assuming form  validation is done and the fields values are  extracted to create object 
let $token = null;
let $url = location.pathname;
let timeTemp = [];

/***************************************************************************/
/*  Create a Temperature Utilities :
/ * 1 for login and connect to API
/*  2 to call API every minute to take latest temperature reading
/*  3 to temperature reading for client                                        
/***************************************************************************/

const temperature_utilities = {

 init: () => {
   if (window.sessionStorage.getItem("token")) {
     $("#temperature").fadeIn(800);  
     temperature_utilities.callTemApi();
     //calling the API every minute to take the latest temperature reading
       setInterval(function() {
         temperature_utilities.callTemApi();
       },60000);    
   } else {
     $("#loginForm").fadeIn(800);
   }
 },
//Method to login and connect to API to return token
    login: () => {
         let $loginUrl = `${$url}${'token.json'}`;
       let $loginDetails = {"user" : $('#user').val(), "password" : $('#password').val() } ;
       let $formData  = JSON.stringify($loginDetails) ;    
       $.post($loginUrl , $formData , function(response){          
             if (response.token) {
               window.sessionStorage.setItem("token", response.token);
               location.reload();
             } else {
               alert('Invalid Login')
             }
           }).fail(function(jqXHR){
             console.log(jqXHR.statusText);
           });                                      
       },

//Method to request  temperature reading
    callTemApi : () => {
     let $callTemAPiUrl = `${$url}${'temp.json'}`;
   $.ajax({
       url: $callTemAPiUrl,
       type: 'get',
       data: {                
       },
       headers: {
           token: window.sessionStorage.getItem("token"),   //request containing bearer token  
       },
       dataType: 'json',
       success: function (data) {
         console.info(data);
       },
       error: function(error){
         console.info(error);
       }
   });                       
},

 averageTempInTimeSeries: (timeSeries=[{}], invterval_duration=5) => {        
   var totalTemp = 0;
   for (var i = 0; i < timeSeries.length; i++) {
       totalTemp += timeSeries[i].some_temp << 0;
   }
   averageTemp =  totalTemp/timeSeries.length;
   return {timestamp: Date.now(), some_temp: averageTemp}
 },

 // randomTemp: () => {
 //   let max_temp = 50
 //   let min_temp = -50
 //   return Math.floor(Math.random() * (100 - (max_temp) + 1)) + (min_temp)
 // }
};

// temperature_utilities.login();
temperature_utilities.init();

$('form#login').submit(function(event){
     event.preventDefault();
     temperature_utilities.login();
   });

//calling the API every minute to take the latest temperature reading
// const latestApi = () =>

//calling the API every minute to take the latest temperature reading