$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDwo3Qmt_9NJG9MnEcv7B5pMv8tE3TCwVc",
        authDomain: "train-scheduler-67886.firebaseapp.com",
        databaseURL: "https://train-scheduler-67886.firebaseio.com",
        projectId: "train-scheduler-67886",
        storageBucket: "",
        messagingSenderId: "205790274696"
    };
    firebase.initializeApp(config);
    var database = firebase.database();
    $("#addTrainBtn").on("click", function (event) {
        event.preventDefault();
        var trainName = $("#trainName").val().trim();
        var destination = $("#destination").val().trim();
        var firstTrain = $("#firstTrain").val().trim();
        var freq = $("#frequency").val().trim();
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: freq
        });
    });
    database.ref().on("child_added", function (childSnapshot) {
        var newTrain = childSnapshot.val().trainName;
        var newLocation = childSnapshot.val().destination;
        var newFirstTrain = childSnapshot.val().firstTrain;
        var newFreq = childSnapshot.val().frequency;
        var startTimeConverted = moment(newFirstTrain, "hh:mm").subtract(1, "years");        // Current Time
        var currentTime = moment();
        var diffTime = moment().diff(moment(startTimeConverted), "minutes");
        var tRemainder = diffTime % newFreq;
        var tMinutesTillTrain = newFreq - tRemainder;
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        var catchTrain = moment(nextTrain).format("HH:mm");
        $("#all-display").append(
            ' <tr><td>' + newTrain +
            ' </td><td>' + newLocation +
            ' </td><td>' + newFreq +
            ' </td><td>' + catchTrain +
            ' </td><td>' + tMinutesTillTrain + ' </td></tr>');
        $("#trainName, #destination, #firstTrain, #frequency").val("");
        return false;
    },
        function (errorObject) {
            console.log("Errors handled: " + errorObject.code);
        });
});