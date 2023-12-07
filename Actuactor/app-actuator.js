const options = {
  clientId: "ACTUATOR_APP",
  username: "user1",
  password: "user1",
};

// these variables refer to => STATUS
var temperature_a, temperature_b, temperate_c;
var humidity_a, humidity_b, humidity_c;
var alarm_a, alarm_b, alarm_c;
var smoke_a, smoke_b, smoke_c;
var ac_a, ac_b, ac_c;
var alive_a, alive_b, alive_c = "0";

const client = mqtt.connect("mqtt://localhost:9001", options);

function OnConnect() {
  // Subscribe to the topic
  client.subscribe(
    [
      "room_a/alive",
      "room_a/temp/receive",
      "room_a/hum/receive",
      "room_a/alarm/receive",
      "room_a/smoke/receive",
      "room_a/ac/receive",

      "room_b/alive",
      "room_b/temp/receive",
      "room_b/hum/receive",
      "room_b/alarm/receive",
      "room_b/smoke/receive",
      "room_b/ac/receive",

      "room_c/alive", 
      "room_c/temp/receive",
      "room_c/hum/receive",
      "room_c/alarm/receive",
      "room_c/smoke/receive",
      "room_c/ac/receive",
    ],
    function (err) {
      if (!err) {
        console.log("Subscribed to 'All the topic /receive");
      } else {
        console.log("Error subscribing to 'topics /receive': " + err);
      }
    }
  );

  // Update when receive message
  client.on("message", function (topic, message) {
    if (topic == "room_a/temp/receive") {
      temperature_a = message;
    } else if (topic == "room_a/hum/receive") {
      humidity_a = message;
    } else if (topic == "room_a/alarm/receive") {
      alarm_a = message;
    } else if (topic == "room_a/smoke/receive") {
      smoke_a = message;
    } else if (topic == "room_a/ac/receive") {
      ac_a = message;
    } else if (topic == "room_a/alive"){
      alive_a = "1";
    }

    if (topic == "room_b/temp/receive") {
      temperature_b = message;
    } else if (topic == "room_b/hum/receive") {
      humidity_b = message;
    } else if (topic == "room_b/alarm/receive") {
      alarm_b = message;
    } else if (topic == "room_b/smoke/receive") {
      smoke_b = message;
    } else if (topic == "room_b/ac/receive") {
      ac_b = message;
    } else if (topic == "room_b/alive"){
      alive_b = "1";
    }

    if (topic == "room_c/temp/receive") {
      temperature_c = message;
    } else if (topic == "room_c/hum/receive") {
      humidity_c = message;
    } else if (topic == "room_c/alarm/receive") {
      alarm_c = message;
    } else if (topic == "room_c/smoke/receive") {
      smoke_c = message;
    } else if (topic == "room_c/ac/receive") {
      ac_c = message;
    } else if (topic == "room_c/alive"){
      alive_c = "1";
    }

    // Print out the messages
    var updateMessage = message.toString();
    var updateDiv = document.createElement("div");
    updateDiv.setAttribute("style", "white-space:pre;");
    updateDiv.textContent = "Update Message: " + updateMessage + "\n\n";

    // Add new div to the page
    document.getElementById("detectionsContainer").appendChild(updateDiv);

    updateValues_A();
  });
}

// FOR ARDUINO NUMBER 1
function updateValues_A() {
  document.getElementById("temperatureValue_a").innerText = temperature_a;
  document.getElementById("humidityValue_a").innerText = humidity_a;
  document.getElementById("acValue_a").innerText = ac_a;
  document.getElementById("smokeValue_a").innerText = smoke_a;
  document.getElementById("alarmValue_a").innerText = alarm_a;
}

// FOR ARDUINO NUMBER 2
function updateValues_B() {
  document.getElementById("temperatureValue_b").innerText = temperature_b;
  document.getElementById("humidityValue_b").innerText = humidity_b;
  document.getElementById("acValue_b").innerText = ac_b;
  document.getElementById("smokeValue_b").innerText = smoke_b;
  document.getElementById("alarmValue_b").innerText = alarm_b;
}

function updateValues_C() {
  document.getElementById("temperatureValue_c").innerText = temperature_c;
  document.getElementById("humidityValue_c").innerText = humidity_c;
  document.getElementById("acValue_c").innerText = ac_c;
  document.getElementById("smokeValue_c").innerText = smoke_c;
  document.getElementById("alarmValue_c").innerText = alarm_c;
}

function changeTab(event, arduinoNum) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(arduinoNum).style.display = "block";
  event.currentTarget.className += " active";
} 

