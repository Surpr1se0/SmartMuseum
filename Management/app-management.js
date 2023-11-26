const options = {
  clientId: "MANAGEMENT_APP",
  username: "user1",
  password: "user1",
};

var temperature;
var humidty;
var alarm;
var smoke;

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
      humidty = message;
    } else if (topic == "room_a/alarm/receive") {
      alarm = message;
    } else if (topic == "room_a/smoke/receive") {
      smoke = message;
    } else if (topic == "room_a/smoke/ac") {
      smoke = message;
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

// Send Threshold for temperature
const max_temp_input = document.getElementById("max_temp");
const min_temp_input = document.getElementById("min_temp");
const send_temp_btn = document.getElementById("send_temp-btn");

send_temp_btn.addEventListener("click", function () {
  var maxTemp = max_temp_input.value;
  var minTemp = min_temp_input.value;

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
  var movementAlarmStatus = this.checked ? "1" : "0";
  client.publish("room_a/alarm/send", movementAlarmStatus);
});

// Send Cancel for MOVEMENT
document.getElementById("cancelAlarmBtn").addEventListener("click", function () {
  client.publish("room_a/alarm/send", "2");
});

// ----------------Send Alarm ON/OFF for MOVEMENT----------------

// Send Alarm ON/OFF for Smoke
document.getElementById("smokeAlarm").addEventListener("change", function () {
  var smokeAlarmStatus = this.checked ? "1" : "0";
  client.publish("room_a/smoke/send", smokeAlarmStatus);
});

// Send Cancel for Smoke
document.getElementById("cancelSmokeAlarmBtn").addEventListener("click", function () {
  client.publish("room_a/smoke/send", "2");
});

// ----------------Send Alarm ON/OFF for AC----------------

// Send Alarm ON/OFF for AC
document.getElementById("acStatus").addEventListener("change", function () {
  var acStatus = this.checked ? "1" : "0";
  client.publish("room_a/ac/send", acStatus);
});