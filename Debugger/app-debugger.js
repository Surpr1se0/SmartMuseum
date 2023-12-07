const options = {
  clientId: "DEBUGGING_APP",
  username: "user1",
  password: "user1",
};

const client = mqtt.connect("mqtt://localhost:9001", options);

function OnConnect() {
  // Subscribe to the topic
  client.subscribe(["room_a/#", "room_b/#", "room_c/#"], function (err) {
    if (!err) {
      console.log("Subscribed to 'All the topics");
    } else {
      console.log("Error subscribing to 'topics': " + err);
    }
  });

  // Update when receive message
  client.on("message", function (topic, message) {
    if (topic == "room_a/#") {
      // Print out the messages
      var updateMessage = message.toString();
      var updateDiv = document.createElement("div");
      updateDiv.setAttribute("style", "white-space:pre;");
      updateDiv.textContent = "Update Message: " + updateMessage + "\n\n";

      // Add new div to the page
      document.getElementById("detectionsContainer-A").appendChild(updateDiv);
    } else if (topic == "room_b/#") {
      // Print out the messages
      var updateMessage = message.toString();
      var updateDiv = document.createElement("div");
      updateDiv.setAttribute("style", "white-space:pre;");
      updateDiv.textContent = "Update Message: " + updateMessage + "\n\n";

      // Add new div to the page
      document.getElementById("detectionsContainer-B").appendChild(updateDiv);
    } else if (topic == "room_c/#") {
      // Print out the messages
      var updateMessage = message.toString();
      var updateDiv = document.createElement("div");
      updateDiv.setAttribute("style", "white-space:pre;");
      updateDiv.textContent = "Update Message: " + updateMessage + "\n\n";

      // Add new div to the page
      document.getElementById("detectionsContainer-C").appendChild(updateDiv);
    }
  });
}
