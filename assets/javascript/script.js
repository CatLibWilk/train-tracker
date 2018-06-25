////////////firebase setup and initialization////////////////
    var config = {
    apiKey: "AIzaSyCJAnqAApvegDoiD1LxXfrZexrSerUSY6M",
    authDomain: "train-tracker-e7b76.firebaseapp.com",
    databaseURL: "https://train-tracker-e7b76.firebaseio.com",
    projectId: "train-tracker-e7b76",
    storageBucket: "",
    messagingSenderId: "483387658628"
    };

    firebase.initializeApp(config);

////////////variables////////////////////////////////////////
    var subBtn = $("#add-train");
    var database = firebase.database();



////////////functions usw.///////////////////////////////////

///takes inputed train information, stores in firebase, clears text areas
subBtn.on("click", function(event){
    event.preventDefault();

    var name = $("#train-name").val();
    var destination = $("#destination").val();
    var first = $("#first-time").val();
    var frequency = $("#frequency").val();    

    database.ref().push({
        name: name,
        destination: destination,
        first: first,
        frequency: frequency
    });

    name = $("#train-name").val("");
    destination = $("#destination").val("");
    first = $("#first-time").val("");
    frequency = $("#frequency").val("");  
});

//////listens for database updates and when one occurs, updates train table with firebase data
database.ref().on("child_added", function(snapshot) {
    var sv = snapshot.val();
    console.log(sv.key);
    var nextArrive = "";
    var minAway = "";


        ///calculates next arrival time and gives minutes to
        function timeCalc (){
            var tFrequency = sv.frequency;
            var firstTime = sv.first;

            var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

            var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

            var tRemainder = diffTime % tFrequency;

            minAway = tFrequency - tRemainder;

            nextArrive = moment().add(minAway, "minutes").format("hh:mm");

        }

timeCalc();

    var newTr = $("<tr>");
    newTr.addClass("bg-warning p-1");
        newTr.attr("id", sv.name);

    var nameTd = $("<td>").text(sv.name);
    var destTd = $("<td>").text(sv.destination);
    var freqTd = $("<td>").text(sv.frequency);
    var nextTd = $("<td>").text(nextArrive);
    var minAwayTd = $("<td>").text(minAway);
    var key = sv.key
    var delBtn = $("<td class='clearfix'>");
    var delInput = $("<div class='fa fa-trash btn remove-btn'>");
    delInput.attr("id", key);
    delBtn.append(delInput);

    newTr.append(nameTd, destTd, freqTd, nextTd, minAwayTd, delBtn);

    $("tbody").append(newTr);
});
/////////heres where I need to figure out delete button functionality
$("body").on("click", ".remove-btn", function(){
    database.ref().once('value').then(function(snap){
        var newSv = snap.val();
        console.log(newSv.key);
    });
});