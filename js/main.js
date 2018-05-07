// Assuming form  validation is done and the fields values are  extracted to create object 

const loginDetails = { "user" : "user123" , "password" : "l0g1n"} ;

let $token = null ;
let $url = location.pathname ;

/***************************************************************************/
/*  Create a Temperature Utilities :
/ * 1 for login and connect to API
/*  2 to call API every minute to take latest temperature reading
/*  3 to temperature reading for client                  	                  
/***************************************************************************/

const temperature_utilities = {
//method to login and connect to API to return token
	login: (authetication , file) => {
    			if ((typeof authetication).toLowerCase() === 'object' && file ) { 
    	        let $formData = JSON.stringify(authetication);
    	      	let $loginUrl = `${$url}${file}`;
    			$.post($loginUrl , $formData , function(response){
    				$token = response;
    				console.log($token);
    			}).fail(function(jqXHR){
    				console.log(jqXHR.statusText);
    			});
    			} else {
    				console.log("Please provide the login details as JSON object and file name");
    			}
    	},
//method to request  temperature reading
	callTemApi : (data , file) => {
    					let $callTemAPiUrl = `${$url}${file}`;
    					let $getPara = data ; 
              if (data && file) {
                $.getJSON($callTemAPiUrl , $getPara , function(response){
                  console.log(response);
                }).fail(function(jqXHR){
                  console.log(jqXHR.statusText);
                });
              } else {
                  console.log("Please provide token and file name");
              }
    					
  				},

};

temperature_utilities.login(loginDetails , 'token.json');

//calling the API every minute to take the latest temperature reading
const latestApi = () =>  temperature_utilities.callTemApi($token , 'temp.json');
setInterval( latestApi , 60000);

//calling the API every minute to take the latest temperature reading

