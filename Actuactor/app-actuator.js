const options = {
  clientId: "ACTUATOR_APP",
  username: "user1",
  password: "user1",
};

// these variables refer to => STATUS
var temperature;
var humidity;
var alarm;
var smoke;
var ac;
var alive = "0";

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
      temperature = message;
    } else if (topic == "room_a/hum/receive") {
      humidity = message;
    } else if (topic == "room_a/alarm/receive") {
      alarm = message;
    } else if (topic == "room_a/smoke/receive") {
      smoke = message;
    } else if (topic == "room_a/ac/receive") {
      ac = message;
    } else if (topic == "room_a/alive"){
      alive = "1";
    }

    // Print out the messages
    var updateMessage = message.toString();
    var updateDiv = document.createElement("div");
    updateDiv.setAttribute("style", "white-space:pre;");
    updateDiv.textContent = "Update Message: " + updateMessage + "\n\n";

    // Add new div to the page
    document.getElementById("detectionsContainer").appendChild(updateDiv);

    updateValues();
  });
}

function updateValues() {
  document.getElementById("temperatureValue").innerText = temperature;
  document.getElementById("humidityValue").innerText = humidity;

  document.getElementById("acValue").innerText = ac;
  document.getElementById("smokeValue").innerText = smoke;
  document.getElementById("alarmValue").innerText = alarm;
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