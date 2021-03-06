$(document).ready(function() {


// Initialize Firebase
var config = {
    apiKey: "AIzaSyCQHYc2AoFXqoxwnOJXL1xgl5-P-jiBRsk",
    authDomain: "team6-f2e21.firebaseapp.com",
    databaseURL: "https://team6-f2e21.firebaseio.com",
    projectId: "team6-f2e21",
    storageBucket: "team6-f2e21.appspot.com",
    messagingSenderId: "633616272136"
};
firebase.initializeApp(config);
var database = firebase.database();

//these are placeholders for movie params
var titleParam = "";
var theaterParam = "";
var showtimeParam = "";

var prices = [12, 8, 5, 9];
var charges = [0, 0, 0, 0];
var seatHolder = [0, 0, 0, 0];


function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function getSum(total, num) {
    return total + num;
}
function calcTotal(event) {
    var id = event.target.id;
    var numTickets = $("#" + id).val();
    var arr = event.target.id.split("-");
    var priceIdx = arr[1];
    var tixType = arr[0].toLowerCase();
    var total = numTickets * prices[priceIdx];
    charges[priceIdx] = total;
    seatHolder[priceIdx] = parseInt(numTickets);
    $("#" + tixType + "total").text("$" + total.toFixed(2));
    var grandtotal = charges.reduce(getSum);
    $("#grandtotal").text("Total:  $" + grandtotal.toFixed(2));
    if(grandtotal > 0) {
        $("#pay-btn").css("visibility","visible");
    }
    else {
        $("#pay-btn").css("visibility","hidden");
        $("#pay-card").css("visibility","hidden");
    }
    // console.log(numTickets);
}
var newBooking = {
    type: "",
    name: "",
    num: "",
    expiry: "",
    zip: "",
    amt: 0,
    seats: 0,
    movie: "",
    theater: "",
    time: "",
    booking: ""
};
function showPayCard() {
    $("#pay-card").css("visibility","visible");
}
function processPayment(event) {
    var cType = $("form :radio").val().trim(); 
    var cName = $("#name-input").val().trim(); 
    var cNumber = $("#cardnumber-input").val().trim(); 
    var cExpiry = $("#expire-input").val().trim(); 
    var cZip = $("#zip-input").val().trim(); 
    var totalSeats = seatHolder.reduce(getSum);
    var grandtotal = charges.reduce(getSum);

    showtimeParam = getParameterByName("showtime");
    theaterParam = getParameterByName("theater");
    titleParam = getParameterByName("title")
   
    // console.log(cType);
    // console.log(cName);
    // console.log(cNumber);
    // console.log(cExpiry);
    // console.log(cZip);

    newBooking.type = cType;
    newBooking.name = cName;
    newBooking.num = cNumber;
    newBooking.expiry = cExpiry;
    newBooking.zip = cZip;
    newBooking.seats = totalSeats; 
    newBooking.amt = grandtotal;
    newBooking.booking = moment().format("X");
    //these values come from front page
    newBooking.movie = titleParam;
    newBooking.time = moment(showtimeParam).format("X");
    newBooking.theater = theaterParam;

    database.ref().push(newBooking);

    alert("Congratulations! You have purchased tickets for "+titleParam +" at "+theaterParam+ " theatre.  Showtime is "+moment(showtimeParam).format("HH:mm"));

};

$(".booknumselect").change(".booknumselect", calcTotal);
// $("#payment-btn").click(processPayment);
$("#pay-btn").click(showPayCard);


$("#payform").submit(function(e) {
    e.preventDefault();
}).validate
  ({
    // Specify validation rules
    rules: {
      // The key name on the left side is the name attribute
      // of an input field. Validation rules are defined
      // on the right side
      typeRadio:  "required",
      cardname:  {"required":true 
                  ,"minlength": 5
                //   ,"regexp":"^[a-zA-Z'.\s]{1,40}$" 
                },
      cardnumber: "required",
      cardexpire: "required",
      cardzip: "required"
    //    email: {
    //     required: true,
    //     // Specify that email should be validated
    //     // by the built-in "email" rule
    //     email: true
    //   },
    //   password: {
    //     required: true,
    //     minlength: 5
    //   }
    },
    // Specify validation error messages
    messages: {
        typeRadio: "Please enter card type",
        cardname: {"required":"Please enter name","minlength":"Requires at least {0} characters"},
        cardnumber: "Please enter card number",
        cardexpire: "Please enter card expiration (MM/YY)",
        cardzip: "Please enter zip code"
    //   password: {
    //     required: "Please provide a password",
    //     minlength: "Your password must be at least 5 characters long"
    //   },
    //   email: "Please enter a valid email address"
    },
    // ,
    // Make sure the form is submitted to the destination defined
    // in the "action" attribute of the form when valid
    submitHandler: function(form) {
        // alert("doing somestuff");
    //   form.submit();
        return processPayment();
    }
  });



});