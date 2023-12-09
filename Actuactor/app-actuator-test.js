const options = {
    clientId: "ACTUATOR_APP",
    username: "user1",
    password: "user1",
  };
  
  const arduinos = ["room_a", "room_b", "room_c"];
  const arduino_var = ["a", "b", "c"];
  
  const client = mqtt.connect("mqtt://localhost:9001", options);
  
  // Subscribe to the topics using arduinos list
  function subscribeToTopics(arduino) {
    const topics = [
      `${arduino}/alive`,
      `${arduino}/temp/receive`,
      `${arduino}/hum/receive`,
      `${arduino}/alarm/receive`,
      `${arduino}/smoke/receive`,
      `${arduino}/ac/receive`,
      `${arduino}/alarm/send`,
      `${arduino}/smoke/send`,
    ];
  
    client.subscribe(topics, (err) => {
      if (!err) {
        console.log("Subscribed to topics for Arduino");
      } else {
        console.log("Error subscribing to topics for Arduino");
      }
    });
  }
  
  function OnConnect() {
    // Subscribe to the topics
    arduinos.forEach((arduino) => subscribeToTopics(arduino));
    client.on("message", function (topic, message) {
      arduinos.forEach((arduino_var) => {
        if (topic.startsWith(`room_${arduino_var}`)) {
          updateValues(arduino_var, message.toString());
        }
      });
    });
  }
  
  function updateValues(arduino_var) {
    // Get the current value
    var temperature = document.getElementById(
      `temperatureValue_${arduino_var}`
    ).innerText;
    var humidity = document.getElementById(
      `humidityValue_${arduino_var}`
    ).innerText;
    var ac = document.getElementById(`acValue_${arduino_var}`).innerText;
    var smoke = document.getElementById(`smokeValue_${arduino_var}`).innerText;
  
    // Update the value based on the message
    if (message.startsWith("room_${arduino_var}/temp/receive")) {
      temperature = message;
    } else if (message.startsWith("room_${arduino_var}/hum/receive")) {
      humidity = message;
    } else if (message.startsWith("room_${arduino_var}/ac/receive")) {
      ac = message;
    } else if (message.startsWith("room_${arduino_var}/smoke/receive")) {
      smoke = message;
    } else if (message.startsWith("room_${arduino_var}/alarm/send")) {
      if (message == "2") {
        states[`alarm${arduino_var}_state`] = "ON";
      } else if (message == "3") {
        states[`alarm${arduino_var}_state`] = "OFF";
      } else {
        states[`alarm${arduino_var}_state`] = " ";
      }
    } else if (message.startsWith("room_${arduino_var}/smoke/send")) {
      if (message == "2") {
        states[`smoke${arduino_var}_state`] = "ON";
      } else if (message == "3") {
        states[`smoke${arduino_var}_state`] = "OFF";
      } else {
        states[`smoke${arduino_var}_state`] = " ";
      }
    }
  }
  
  function addUpdateToContainer(message) {
    // Print out the messages
    var updateMessage = message.toString();
    var updateDiv = document.createElement("div");
    updateDiv.setAttribute("style", "white-space:pre;");
    updateDiv.textContent = "Update Message: " + updateMessage + "\n\n";
  
    // Add new div to the page
    document.getElementById("detectionsContainer").appendChild(updateDiv);
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
  