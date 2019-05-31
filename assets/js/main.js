// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAveDsPvmdeyk-vPFp-h8dk1O80IjVagMw",
  authDomain: "traintest-ff6b5.firebaseapp.com",
  databaseURL: "https://traintest-ff6b5.firebaseio.com",
  projectId: "traintest-ff6b5",
  storageBucket: "traintest-ff6b5.appspot.com",
  messagingSenderId: "356605119517",
  appId: "1:356605119517:web:0ae7207e1a603f35"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

console.log(firebase);

var database = firebase.database();

console.log(database);

// Initial Values
let trainName = "";
let destination = "";
let firstTrainTime = 0;
let frequency = 0;

// Capture Button Click
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();
  // Grabbed values from text boxes
  trainName = $("#name-input")
    .val()
    .trim();
  destination = $("#destination-input")
    .val()
    .trim();
  firstTrainTime = $("#first-train-input")
    .val()
    .trim();
  frequency = $("#frequency-input")
    .val()
    .trim();

  // First Time (pushed back 1 year to make sure it comes before current time)
  let firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  let currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm A"));

  // Difference between the times
  let diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  let tRemainder = diffTime % frequency;
  console.log(tRemainder);

  // Minute Until Train
  let tMinutesTillTrain = frequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
  console.log(tMinutesTillTrain);

  // Next Train
  let nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));
  nextTrain = moment(nextTrain).format("hh:mm A");
  console.log(nextTrain);

  database.ref().push({
    trainName: trainName,
    destination: destination,
    frequency: frequency,
    nextArrival: nextTrain,
    minutesAway: tMinutesTillTrain,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
});

database.ref().on(
  "child_added",
  function(childSnapshot) {
    // Log everything that's coming out of snapshot
    console.log(childSnapshot.val().trainName);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().frequency);
    console.log(childSnapshot.val().nextArrival);
    console.log(childSnapshot.val().minutesAway);

    // full list of items to the well
    $("#train-list").append(
      "<tr><td class='train-name'> " +
        childSnapshot.val().trainName +
        " </td><td class='destination'> " +
        childSnapshot.val().destination +
        " </td><td class='frequency'> " +
        childSnapshot.val().frequency +
        " </td><td class='next-train'> " +
        childSnapshot.val().nextArrival +
        " </td><td class='next-train'> " +
        childSnapshot.val().minutesAway +
        " </td> </tr>"
    );

    // Handle the errors
  },
  function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  }
);
