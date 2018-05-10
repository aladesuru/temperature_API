// Global Variable declaration 
let $url = location.pathname;
let $tempReading = []; 
let $time = null;
let $averge = [];
let $clearAverageInerval = null;

/***************************************************************************/
/*  TEMPERATURE UTILITIES :
/*
/*  1 to check if a user has signed in
/ * 2 for login and connect to API
/*  3 to call API every minute to take latest temperature reading
/*  4 to calculated average and store calculated average
/*  5 that allow any length of time series and any interval
/*  6 that display temperature to browser                                        
/***************************************************************************/

const temperature_utilities = {
//Method to check if a user has signed in 
 init: () => {
	 if (window.sessionStorage.getItem("token")) {  // if signed in display display temperature
			 temperature_utilities.callTemApi('temp.json');    

			 setInterval(() => {
			  temperature_utilities.callTemApi('temp.json');    //calling the API every minute to take the latest temperature reading
			 },60000); 

			temperature_utilities.smallerDataSet(1,5);  //generate average to produce a smaller set of data that can serve across our API 
	 } else {
		 $('#Form-container').css('transform' , 'scale(1)');  // if not signed in display login form
	 }
 },

//Method to login and connect to API to return token
		login: () => {
			 let $loginUrl = `${$url}${file}`;
			 let $loginDetails = {"user" : $('#user').val(), "password" : $('#password').val() } ;
			 let $formData  = JSON.stringify($loginDetails) ;   // Convert loging details to JSON 
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
	callTemApi : (file) => {
	 let $callTemAPiUrl = `${$url}${file}`;;
	 $.ajax({
  	 url: $callTemAPiUrl,
  	 type: 'GET',
  	 headers: {
  			 token: window.sessionStorage.getItem("token"),   //request containing the bearer token    
  	 },
  	 dataType: 'json',
  	 success: function (data) {
  		 console.info(data); 
  		 window.sessionStorage.setItem("temperature", data.temp);  //store the temperature on client side
       temperature_utilities.showTempOnbrowswer();               // Display temperature to browser

       /* generate timestamp , store the timestamp and the API 
       /* to be used to calculate Average. */
        $tempReading.push({timestamp : Date.now() , temp: Number(sessionStorage.temperature)});
  	 },
  	 error: function(error){
  		 console.info(error);
  	 }
  }); 
},                      

//Method that allow calling code to specify any length of input time
// and any interval duration, but have default of 24hours and 5 interval.
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
   
	 console.log($averge);
 },

//Method that allow calling code to specify any length of input time
// and any interval duration, but have default of 24 and 5 respectively .
  smallerDataSet: (tempReadingLenghtofTime = 24 , tempReadingInterval= 5) => { 
    let interval = tempReadingInterval * (1000 * 60);             // convert the interval to millisecond
    let lenghtofTime = tempReadingLenghtofTime * (1000 * 60 * 60); // convert the length of time to millisecond

      $clearAverageInerval = setInterval(() => {  
        temperature_utilities.averageTemp($tempReading);
      }, interval);

      setTimeout(() => {
        sessionStorage.removeItem("token");
        clearInterval($clearAverageInerval);
        location.reload(true);
      },lenghtofTime);
  },

  // Method that display temperature to the browser
   showTempOnbrowswer : () => {
    let  $displayReading = `<div class='temp'><h2>London Office Temperature</h2>
                            <span>${sessionStorage.temperature}<sup>o</sup></span></div>`;
    $('.container').html($displayReading);
    },
}

// temperature_utilities.login();
temperature_utilities.init();
$('form#login').submit(function(event){
     event.preventDefault();
     temperature_utilities.login('token.json');
  });
