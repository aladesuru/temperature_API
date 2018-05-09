// Variable declaration 
let $url = location.pathname;
let $tempReading = [];
let $time = null;
let $averge = [];
let $clearAverageInerval = null;

/***************************************************************************/
/*  Create a Temperature Utilities :
/ * 1 for login and connect to API
/*  2 to call API every minute to take latest temperature reading
/*  3 to temperature reading for client                                        
/***************************************************************************/

const temperature_utilities = {
//Method to sniff if a user has  sign in 
 init: () => {
   if (window.sessionStorage.getItem("token")) {  
      temperature_utilities.callTemApi();
       setInterval(() => {
    //calling the API every minute to take the latest temperature reading
         temperature_utilities.callTemApi();

    //generate timestamp , store the timestamp and the API generated every minute
          $tempReading.push({timestamp : Date.now() , temp: Number(sessionStorage.temperature)});
          // console.log($tempReading); 
       },60000); 

    //generate average to produce a smaler set of data that can serve across our API
      $clearAverageInterval= setInterval(() => {
        temperature_utilities.averageTemp($tempReading);
       }, 300000);
   } else {
     $("#loginForm").fadeIn(800);
   }
 },

//Method to login and connect to API to return token
    login: () => {
       let $loginUrl = `${$url}${'token.json'}`;
       let $loginDetails = {"user" : $('#user').val(), "password" : $('#password').val() } ;
       let $formData  = JSON.stringify($loginDetails) ;    
        $.ajax({
           url: $loginUrl,
           type: 'POST',
           data: $formData ,
           contentType: 'application/Json',
           processData: false,
           dataType: 'json',
           success: function (response) {
            if (response.token) {
               window.sessionStorage.setItem("token", response.token);
               location.reload();
             } else {
               alert('Invalid Login')
             }
           },
           error: function(error){
             console.info(error);
           }
       });         

       },

//Method to request  temperature reading
    callTemApi : () => {
     let $callTemAPiUrl = `${$url}${'temp.json'}`;
   $.ajax({
       url: $callTemAPiUrl,
       type: 'GET',
       headers: {
           token: window.sessionStorage.getItem("token"),   //with the request containing the bearer token  
       },
       dataType: 'json',
       success: function (data) {
         console.info(data); 
         window.sessionStorage.setItem("temperature", data.temp);
       },
       error: function(error){
         console.info(error);
       }
   });                       
},

//Method that calculate the average temperature and 
// store the result has an object
 averageTemp: (datalist) => {        
   let totalTimestamp = 0;
   let totalTemperature = 0;
   for (i = 0; i < datalist.length; i++) {
       totalTimestamp += datalist[i].timestamp ;
       totalTemperature += datalist[i].temp ;
   }
   averageTemp =  totalTemperature / datalist.length;
   averageTimestamp =  totalTimestamp / datalist.length;

   $averge.push({timestamp: averageTimestamp , temp: averageTemp});

   // console.log({timestamp: averageTimestamp , temp: averageTemp});
   console.log($averge);
 },

//Method that allow calling code to specify any length of input time
// and any interval duration, but have default of 24hour.
  timeSeries: (setlengthoftime = 24 , setInterval= 5) => { 

  }

}

// temperature_utilities.login();
temperature_utilities.init();
$('form#login').submit(function(event){
     event.preventDefault();
     temperature_utilities.login();
     $("#loginForm").fadeOut();
   });

//calling the API every minute to take the latest temperature reading
// const latestApi = () =>

//calling the API every minute to take the latest temperature reading