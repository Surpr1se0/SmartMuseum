const options = {
  clientId: "DEBUGGER_APP",
  username: "user1",
  password: "user1",
};

var temperature;
var humidty;
var alarm;
var smoke;

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
