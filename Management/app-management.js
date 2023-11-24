const options = {
    clientId: "mqtt-tester",
    username: "user1",
    password: "user1",
  };
  
  const client = mqtt.connect("mqtt://localhost:9001", options);
  
  function OnConnect() {
    // Subscribe to the topic
    client.subscribe("ESP_A/detections", function (err) {
      if (!err) {
        console.log("Subscribed to 'ESP_A/detections");
      } else {
        console.log("Error subscribing to 'ESP_A/detections': " + err);
      }
    });
  
    // Subscribe to the topic
    client.subscribe("ESP_A/updates", function (err) {
      if (!err) {
        console.log("Subscribed to 'ESP_A/updates'");
      } else {
        console.log("Error subscribing to 'ESP_A/updates': " + err);
      }
    });
  
    // Update the page when a message is received
    client.on("message", function (topic, message) {
      if (topic == "ESP_A/detections") {
        // Access the data
        var data = JSON.parse(message);
        var macAddress = data.mac;
        var channel = data.channel;
        var hour = data.hour;
        var minute = data.minute;
        var seconds = data.seconds;
  
        // Create a new div element for the current detection
        var detectionDiv = document.createElement("div");
        detectionDiv.setAttribute("style", "white-space:pre;");
  
        detectionDiv.textContent =
          "MAC Address Detected: " +
          macAddress +
          "\r\n" +
          "Channel: " +
          channel +
          "\r\n" +
          "Last detected at: " +
          hour +
          ":" +
          minute +
          ":" +
          seconds +
          "\n\n";
  
        // Add the new div to the page
        document.getElementById("detectionsContainer").appendChild(detectionDiv);
      }
      else if(topic == "ESP_A/updates") {
        var updateMessage = message.toString();
  
        var updateDiv = document.createElement("div");
        updateDiv.setAttribute("style", "white-space:pre;");
  
        updateDiv.textContent = "Update Message: " + updateMessage + "\n\n";
    
        // Add new div to the page
        document.getElementById("detectionsContainer").appendChild(updateDiv);
      }
    });
  }
  
  const macAddressInput = document.getElementById("macAddress");
  const sendMacAddressButton = document.getElementById("sendMacAddress");
  
  sendMacAddressButton.addEventListener("click", function () {
    var macAddress = macAddressInput.value;
    console.log("Button Clicked");
    // Publish the MAC address to the MQTT topic
    client.publish("ESP_A/detections_rx", macAddress, function (err) {
      if (err) {
        console.error("Error publishing to 'ESP_A/detections_rx': " + err);
      } else {
        console.log("Published to 'ESP_A/detections_rx': " + macAddress);
      }
    });
  });
  