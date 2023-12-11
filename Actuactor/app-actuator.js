const options = {
  clientId: "ACTUATOR_APP",
  username: "user1",
  password: "user1",
  will: {
    topic: "room_a/alive",
    payload: "Node A is NOT Alive!",
    qos: 1,
    retain: true,
  },
};

// these variables refer to => STATUS
var temperature_a, temperature_b, temperature_c;
var humidity_a, humidity_b, humidity_c;
var alarm_a, alarm_b, alarm_c;
var smoke_a, smoke_b, smoke_c;
var ac_a, ac_b, ac_c;
var alive_a,
  alive_b,
  alive_c = "0";
// these variables refer to => ON/OFF for alarms
var alarm_a_state,
  smoke_a_state = " ";
var alarm_b_state,
  smoke_b_state = " ";
var alarm_c_state,
  smoke_c_state = " ";

// these variables refer to alive status in seconds
var last_alive_a = 0;
var last_alive_b = 0;
var last_alive_c = 0;

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
      "room_a/alarm/send",
      "room_a/smoke/send",

      "room_b/alive",
      "room_b/temp/receive",
      "room_b/hum/receive",
      "room_b/alarm/receive",
      "room_b/smoke/receive",
      "room_b/ac/receive",
      "room_b/alarm/send",
      "room_b/smoke/send",

      "room_c/alive",
      "room_c/temp/receive",
      "room_c/hum/receive",
      "room_c/alarm/receive",
      "room_c/smoke/receive",
      "room_c/ac/receive",
      "room_c/alarm/send",
      "room_c/smoke/send",
    ],
    function (err) {
      if (!err) {
        console.log("Subscribed to 'All the topic /receive");
      } else {
        console.log("Error subscribing to 'topics /receive': " + err);
      }
    }
  );
  checkAliveTimeout();
  // Update when receive message
  client.on("message", function (topic, message) {
    checkAliveTimeout();

    if (topic.startsWith("room_a/")) {
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
      } else if (topic == "room_a/alive") {
        last_alive_a = new Date().getTime();
        console.log("Received LWT message:", message.toString());
      } else if (topic == "room_a/alarm/send") {
        // Update ON & OFF values for Alarms
        if (message == "3") {
          alarm_a_state = "ON";
        } else if (message == "2") {
          alarm_a_state = "OFF";
        } else {
          alarm_a_state = " ";
        }
      } else if (topic == "room_a/smoke/send") {
        if (message == "3") {
          smoke_a_state = "ON";
        } else if (message == "2") {
          smoke_a_state = "OFF";
        } else {
          smoke_a_state = " ";
        }
      }
      updateValues_A();
      console.log("Received from node A");
    }
    if (topic.startsWith("room_b/")) {
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
      } else if (topic == "room_b/alive") {
        last_alive_b = new Date().getTime();
        console.log("Received LWT message:", message.toString());
      } else if (topic == "room_b/alarm/send") {
        // Update ON & OFF values for Alarms
        if (message == "3") {
          alarm_b_state = "ON";
        } else if (message == "2") {
          alarm_b_state = "OFF";
        } else {
          alarm_b_state = " ";
        }
      } else if (topic == "room_b/smoke/send") {
        if (message == "3") {
          smoke_b_state = "ON";
        } else if (message == "2") {
          smoke_b_state = "OFF";
        } else {
          smoke_b_state = " ";
        }
      }

      updateValues_B();
      console.log("received from node B");
    } else if (topic.startsWith("room_c/")) {
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
      } else if (topic == "room_c/alive") {
        last_alive_c = new Date().getTime();
        console.log("Received LWT message:", message.toString());
      } else if (topic == "room_c/alarm/send") {
        // Update ON & OFF values for Alarms
        if (message == "3") {
          alarm_c_state = "ON";
        } else if (message == "2") {
          alarm_c_state = "OFF";
        } else {
          alarm_c_state = " ";
        }
      } else if (topic == "room_c/smoke/send") {
        if (message == "3") {
          smoke_c_state = "ON";
        } else if (message == "2") {
          smoke_c_state = "OFF";
        } else {
          smoke_c_state = " ";
        }
      }
      updateValues_C();
      console.log("received from node C");
    }

    // Print out the messages
    var updateMessage = message.toString();
    var updateDiv = document.createElement("div");
    updateDiv.setAttribute("style", "white-space:pre;");
    updateDiv.textContent = "Update Message: " + updateMessage + "\n\n";

    // Add new div to the page
    document.getElementById("detectionsContainer").appendChild(updateDiv);
  });
}

// FOR ARDUINO NUMBER 1
function updateValues_A() {
  document.getElementById("temperatureValue_a").innerText = temperature_a;
  document.getElementById("humidityValue_a").innerText = humidity_a;
  document.getElementById("acValue_a").innerText = ac_a;
  document.getElementById("smokeValue_a").innerText =
    smoke_a + " " + smoke_a_state;
  document.getElementById("alarmValue_a").innerText =
    alarm_a + " " + alarm_a_state;
}

// FOR ARDUINO NUMBER 2
function updateValues_B() {
  document.getElementById("temperatureValue_b").innerText = temperature_b;
  document.getElementById("humidityValue_b").innerText = humidity_b;
  document.getElementById("acValue_b").innerText = ac_b;
  document.getElementById("smokeValue_b").innerText =
    smoke_b + " " + smoke_b_state;
  document.getElementById("alarmValue_b").innerText =
    alarm_b + " " + alarm_b_state;
}

// FOR ARDUINO NUMBER 3
function updateValues_C() {
  document.getElementById("temperatureValue_c").innerText = temperature_c;
  document.getElementById("humidityValue_c").innerText = humidity_c;
  document.getElementById("acValue_c").innerText = ac_c;
  document.getElementById("smokeValue_c").innerText =
    smoke_c + " " + smoke_c_state;
  document.getElementById("alarmValue_c").innerText =
    alarm_c + " " + alarm_c_state;
}

// Check if Nodes are Alive to send warning messages
function checkAliveTimeout() {
  var currentTime = new Date().getTime();

  // room A
  if (currentTime - last_alive_a > 6000) {
    alive_a = "0";
    // Send message to Management application
    client.publish("room_a/alive", "Node A is NOT Alive!", function (err) {
      if (err) {
        console.error("Error publishing to 'room_a/alive': " + err);
      } else {
        console.log("Published to 'room_a/alive': Node A is NOT Alive!");
      }
    });
  } else {
    alive_a = "1";
  }

  // room B
  if (currentTime - last_alive_b > 6000) {
    alive_b = "0";
    // Send message to management application
    client.publish("room_b/alive", "Node B is NOT Alive!", function (err) {
      if (err) {
        console.error("Error publishing to 'room_b/alive': " + err);
      } else {
        console.log("Published to 'room_b/alive': Node B is NOT Alive!");
      }
    });
  } else {
    alive_b = "1";
  }

  // Room C
  if (currentTime - last_alive_c > 6000) {
    alive_c = "0";
    // Send message to management application
    client.publish("room_c/alive", "Node C is NOT Alive!", function (err) {
      if (err) {
        console.error("Error publishing to 'room_c/alive': " + err);
      } else {
        console.log("Published to 'room_c/alive': Node C is NOT Alive!");
      }
    });
  } else {
    alive_c = "1";
  }
}
// Change the tabs in View
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
