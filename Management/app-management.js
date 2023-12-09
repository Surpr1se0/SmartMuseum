const options = {
  clientId: "MANAGEMENT_APP",
  username: "user1",
  password: "user1",
};

var temperature_A;
var humidty_A;
var alarm_A;
var smoke_A;

var temperature_B;
var humidty_B;
var alarm_B;
var smoke_B;

var temperature_C;
var humidty_C;
var alarm_C;
var smoke_C;

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
      temperature_A = message;
    } else if (topic == "room_a/hum/receive") {
      humidty_A = message;
    } else if (topic == "room_a/alarm/receive") {
      alarm_A = message;
    } else if (topic == "room_a/smoke/receive") {
      smoke_A = message;
    } else if (topic == "room_a/ac/receive") {
      ac_A = message;
    }

    if (topic == "room_b/temp/receive") {
      temperature_B = message;
    } else if (topic == "room_b/hum/receive") {
      humidty_B = message;
    } else if (topic == "room_b/alarm/receive") {
      alarm_B = message;
    } else if (topic == "room_b/smoke/receive") {
      smoke_B = message;
    } else if (topic == "room_b/ac/receive") {
      ac_B = message;
    }

    if (topic == "room_c/temp/receive") {
      temperature_C = message;
    } else if (topic == "room_c/hum/receive") {
      humidty_C = message;
    } else if (topic == "room_c/alarm/receive") {
      alarm_C = message;
    } else if (topic == "room_c/smoke/receive") {
      smoke_C = message;
    } else if (topic == "room_c/ac/receive") {
      ac_C = message;
    }

    if (topic.startsWith("room_a/")) {
      // Print out the messages
      var updateMessage = message.toString();
      var updateDiv = document.createElement("div");
      updateDiv.setAttribute("style", "white-space:pre;");
      updateDiv.textContent = "Update Message: " + updateMessage + "\n\n";
      // Add new div to the page
      document.getElementById("detections1Container").appendChild(updateDiv);

    } else if (topic.startsWith("room_b/")) {
      // Print out the messages
      var updateMessage = message.toString();
      var updateDiv = document.createElement("div");
      updateDiv.setAttribute("style", "white-space:pre;");
      updateDiv.textContent = "Update Message: " + updateMessage + "\n\n";
      // Add new div to the page
      document.getElementById("detections2Container").appendChild(updateDiv);

    } else if (topic.startsWith("room_c/")) {
      // Print out the messages
      var updateMessage = message.toString();
      var updateDiv = document.createElement("div");
      updateDiv.setAttribute("style", "white-space:pre;");
      updateDiv.textContent = "Update Message: " + updateMessage + "\n\n";

      // Add new div to the page
      document.getElementById("detections3Container").appendChild(updateDiv);
    }
  });
}

// #########################  NODE A  #########################
// Send Threshold for temperature
const max_temp_input = document.getElementById("max_temp");
const min_temp_input = document.getElementById("min_temp");
const send_temp_btn = document.getElementById("send_temp-btn");

send_temp_btn.addEventListener("click", function () {
  var maxTemp = max_temp_input.value;
  var minTemp = min_temp_input.value;

  if (minTemp > maxTemp) {
    window.alert("Insert valid values!");
  }

  // Publish the Temps to the MQTT topic
  client.publish("room_a/temp/max", maxTemp, function (err) {
    if (err) {
      console.error("Error publishing to 'room_a/temp/max': " + err);
    } else {
      console.log("Published to 'room_a/temp/max': " + maxTemp);
    }
  });

  client.publish("room_a/temp/min", minTemp, function (err) {
    if (err) {
      console.error("Error publishing to 'room_a/temp/min': " + err);
    } else {
      console.log("Published to 'room_a/temp/min': " + minTemp);
    }
  });
});

const max_hum_input = document.getElementById("max_hum");
const min_hum_input = document.getElementById("min_hum");
const send_hum_btn = document.getElementById("send_hum-btn");

send_hum_btn.addEventListener("click", function () {
  var maxHum = max_hum_input.value;
  var minHum = min_hum_input.value;

  if (minHum > maxHum) {
    window.alert("Insert valid values!");
  }

  // Publish the Temps to the MQTT topic
  client.publish("room_a/hum/max", maxHum, function (err) {
    if (err) {
      console.error("Error publishing to 'room_a/hum/max': " + err);
    } else {
      console.log("Published to 'room_a/hum/max': " + maxHum);
    }
  });

  client.publish("room_a/hum/min", minHum, function (err) {
    if (err) {
      console.error("Error publishing to 'room_a/hum/min': " + err);
    } else {
      console.log("Published to 'room_a/hum/min': " + minHum);
    }
  });
});

// ----------------Send Alarm ON/OFF for MOVEMENT----------------
document.getElementById("movementAlarm").addEventListener("change", function () {
    var movementAlarmStatus = this.checked ? "2" : "3";
    client.publish("room_a/alarm/send", movementAlarmStatus);
  });

// Send Cancel for MOVEMENT
document.getElementById("cancelAlarmBtn").addEventListener("click", function () {
    // Was the alarm triggered?
    if (alarm_A == "1") {
      client.publish("room_a/alarm/send", "2");
    } else {
      window.alert("Insert valid values!");
      console.log("Cannot Send!");
    }
  });

// ----------------Send Alarm ON/OFF for MOVEMENT----------------

// Send Alarm ON/OFF for Smoke
document.getElementById("smokeAlarm").addEventListener("change", function () {
  var smokeAlarmStatus = this.checked ? "2" : "3";
  client.publish("room_a/smoke/send", smokeAlarmStatus);
});

// Send Cancel for Smoke
document.getElementById("cancelSmokeAlarmBtn").addEventListener("click", function () {
    // Was the alarm triggered?
    if (smoke_A == "1") {
      client.publish("room_a/smoke/send", "2");
    } else {
      window.alert("Cannot cancel the alarm because it was not triggered!");
      console.log("Cannot Send!");
    }
  });

// ----------------Send Alarm ON/OFF for AC----------------

// Send Alarm ON/OFF for AC
document.getElementById("acStatus").addEventListener("change", function () {
  var acStatus = this.checked ? "1" : "0";
  client.publish("room_a/ac/send", acStatus);
});



// #########################  NODE B  #########################
// Send Threshold for temperature
const max_temp_input_b = document.getElementById("max_temp2");
const min_temp_input_b = document.getElementById("min_temp2");
const send_temp_btn_b = document.getElementById("send_temp-btn2");

send_temp_btn_b.addEventListener("click", function () {
  var maxTemp = max_temp_input_b.value;
  var minTemp = min_temp_input_b.value;

  if (minTemp > maxTemp) {
    window.alert("Insert valid values!");
  }

  // Publish the Temps to the MQTT topic
  client.publish("room_b/temp/max", maxTemp, function (err) {
    if (err) {
      console.error("Error publishing to 'room_b/temp/max': " + err);
    } else {
      console.log("Published to 'room_b/temp/max': " + maxTemp);
    }
  });

  client.publish("room_b/temp/min", minTemp, function (err) {
    if (err) {
      console.error("Error publishing to 'room_b/temp/min': " + err);
    } else {
      console.log("Published to 'room_b/temp/min': " + minTemp);
    }
  });
});

const max_hum_input_b = document.getElementById("max_hum2");
const min_hum_input_b = document.getElementById("min_hum2");
const send_hum_btn_b = document.getElementById("send_hum-btn2");

send_hum_btn_b.addEventListener("click", function () {
  var maxHum = max_hum_input_b.value;
  var minHum = min_hum_input_b.value;

  if (minHum > maxHum) {
    window.alert("Insert valid values!");
  }

  // Publish the Temps to the MQTT topic
  client.publish("room_b/hum/max", maxHum, function (err) {
    if (err) {
      console.error("Error publishing to 'room_b/hum/max': " + err);
    } else {
      console.log("Published to 'room_b/hum/max': " + maxHum);
    }
  });

  client.publish("room_b/hum/min", minHum, function (err) {
    if (err) {
      console.error("Error publishing to 'room_b/hum/min': " + err);
    } else {
      console.log("Published to 'room_b/hum/min': " + minHum);
    }
  });
});

// ----------------Send Alarm ON/OFF for MOVEMENT----------------
document.getElementById("movementAlarm2").addEventListener("change", function () {
  var movementAlarmStatus = this.checked ? "2" : "3";
  client.publish("room_b/alarm/send", movementAlarmStatus);
});

// Send Cancel for MOVEMENT
document.getElementById("cancelAlarmBtn2").addEventListener("click", function () {
  // Was the alarm triggered?
  if (alarm_B == "1") {
    client.publish("room_b/alarm/send", "2");
  } else {
    window.alert("Cannot cancel the alarm because it was not triggered!");
    console.log("Cannot Send!");
  }
});

// ----------------Send Alarm ON/OFF for MOVEMENT----------------

// Send Alarm ON/OFF for Smoke
document.getElementById("smokeAlarm2").addEventListener("change", function () {
var smokeAlarmStatus = this.checked ? "2" : "3";
client.publish("room_b/smoke/send", smokeAlarmStatus);
});

// Send Cancel for Smoke
document.getElementById("cancelSmokeAlarmBtn2").addEventListener("click", function () {
  // Was the alarm triggered?
  if (smoke_B == "1") {
    client.publish("room_b/smoke/send", "2");
  } else {
    window.alert("Cannot cancel the alarm because it was not triggered!");
    console.log("Cannot Send!");
  }
});

// ----------------Send Alarm ON/OFF for AC----------------

// Send Alarm ON/OFF for AC
document.getElementById("acStatus2").addEventListener("change", function () {
var acStatus = this.checked ? "1" : "0";
client.publish("room_b/ac/send", acStatus);
});



// #########################  NODE C  #########################
// Send Threshold for temperature
const max_temp_input_c = document.getElementById("max_temp3");
const min_temp_input_c = document.getElementById("min_temp3");
const send_temp_btn_c = document.getElementById("send_temp-btn3");

send_temp_btn_c.addEventListener("click", function () {
  var maxTemp = max_temp_input_c.value;
  var minTemp = min_temp_input_c.value;

  if (minTemp > maxTemp) {
    window.alert("Insert valid values!");
  }

  // Publish the Temps to the MQTT topic
  client.publish("room_c/temp/max", maxTemp, function (err) {
    if (err) {
      console.error("Error publishing to 'room_c/temp/max': " + err);
    } else {
      console.log("Published to 'room_c/temp/max': " + maxTemp);
    }
  });

  client.publish("room_c/temp/min", minTemp, function (err) {
    if (err) {
      console.error("Error publishing to 'room_c/temp/min': " + err);
    } else {
      console.log("Published to 'room_c/temp/min': " + minTemp);
    }
  });
});

const max_hum_input_c = document.getElementById("max_hum3");
const min_hum_input_c = document.getElementById("min_hum3");
const send_hum_btn_c = document.getElementById("send_hum-btn3");

send_hum_btn_c.addEventListener("click", function () {
  var maxHum = max_hum_input_c.value;
  var minHum = min_hum_input_c.value;

  if (minHum > maxHum) {
    window.alert("Insert valid values!");
  }

  // Publish the Temps to the MQTT topic
  client.publish("room_c/hum/max", maxHum, function (err) {
    if (err) {
      console.error("Error publishing to 'room_c/hum/max': " + err);
    } else {
      console.log("Published to 'room_c/hum/max': " + maxHum);
    }
  });

  client.publish("room_c/hum/min", minHum, function (err) {
    if (err) {
      console.error("Error publishing to 'room_c/hum/min': " + err);
    } else {
      console.log("Published to 'room_c/hum/min': " + minHum);
    }
  });
});

// ----------------Send Alarm ON/OFF for MOVEMENT----------------
document.getElementById("movementAlarm3").addEventListener("change", function () {
  var movementAlarmStatus = this.checked ? "2" : "3";
  client.publish("room_c/alarm/send", movementAlarmStatus);
});

// Send Cancel for MOVEMENT
document.getElementById("cancelAlarmBtn3").addEventListener("click", function () {
  // Was the alarm triggered?
  if (alarm_C == "1") {
    client.publish("room_c/alarm/send", "2");
  } else {
    window.alert("Cannot cancel the alarm because it was not triggered!");
    console.log("Cannot Send!");
  }
});

// ----------------Send Alarm ON/OFF for MOVEMENT----------------

// Send Alarm ON/OFF for Smoke
document.getElementById("smokeAlarm3").addEventListener("change", function () {
var smokeAlarmStatus = this.checked ? "2" : "3";
client.publish("room_c/smoke/send", smokeAlarmStatus);
});

// Send Cancel for Smoke
document.getElementById("cancelSmokeAlarmBtn3").addEventListener("click", function () {
  // Was the alarm triggered?
  if (smoke_C == "1") {
    client.publish("room_c/smoke/send", "2");
  } else {
    window.alert("Cannot cancel the alarm because it was not triggered!");
    console.log("Cannot Send!");
  }
});

// ----------------Send Alarm ON/OFF for AC----------------

// Send Alarm ON/OFF for AC
document.getElementById("acStatus3").addEventListener("change", function () {
var acStatus = this.checked ? "1" : "0";
client.publish("room_c/ac/send", acStatus);
});
