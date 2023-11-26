const options = {
  clientId: "ACTUATOR_APP",
  username: "user1",
  password: "user1",
};

const client = mqtt.connect("mqtt://localhost:9001", options);

function OnConnect() {
  // Subscribe to the topic
  client.subscribe("test/topic", function (err) {
    if (!err) {
      console.log("Subscribed to 'test/topic");
    } else {
      console.log("Error subscribing to 'test/topic': " + err);
    }
  });

  client.on("message", function (topic, message) {
    var updateMessage = message.toString();

    var updateDiv = document.createElement("div");
    updateDiv.setAttribute("style", "white-space:pre;");

    updateDiv.textContent = "Update Message: " + updateMessage + "\n\n";

    // Add new div to the page
    document.getElementById("detectionsContainer").appendChild(updateDiv);
  });

  // // Subscribe to the topic
  // client.subscribe("test/topic", function (err) {
  //   if (!err) {
  //     console.log("Subscribed to 'ESP_A/updates'");
  //   } else {
  //     console.log("Error subscribing to 'ESP_A/updates': " + err);
  //   }
  // });

  // // Update the page when a message is received
  // client.on("message", function (topic, message) {
  //   if (topic == "test/topic") {
  //     // Access the data
  //     var data = JSON.parse(message);
  //     var macAddress = data.mac;
  //     var channel = data.channel;
  //     var hour = data.hour;
  //     var minute = data.minute;
  //     var seconds = data.seconds;

  //     // Create a new div element for the current detection
  //     var detectionDiv = document.createElement("div");
  //     detectionDiv.setAttribute("style", "white-space:pre;");

  //     detectionDiv.textContent =
  //       "MAC Address Detected: " +
  //       macAddress +
  //       "\r\n" +
  //       "Channel: " +
  //       channel +
  //       "\r\n" +
  //       "Last detected at: " +
  //       hour +
  //       ":" +
  //       minute +
  //       ":" +
  //       seconds +
  //       "\n\n";

  //     // Add the new div to the page
  //     document.getElementById("detectionsContainer").appendChild(detectionDiv);
  //   }
  // });
}

const macAddressInput = document.getElementById("macAddress");
const sendMacAddressButton = document.getElementById("sendMacAddress");

sendMacAddressButton.addEventListener("click", function () {
  var macAddress = macAddressInput.value;
  console.log("Button Clicked");
  // Publish the MAC address to the MQTT topic
  client.publish("test/topic_1", macAddress, function (err) {
    if (err) {
      console.error("Error publishing to 'test/topic_1': " + err);
    } else {
      console.log("Published to 'test/topic_1': " + macAddress);
    }
  });
});
