#include <ESP8266WiFi.h>
#include <PubSubClient.h>             // WiFi
const char *ssid = " ";      // Enter your WiFi name
const char *password = " ";  // Enter WiFi password

// MQTT Brooker Login
const char *mqtt_user = "user1";
const char *mqtt_password = "user1";

// MQTT Broker
const char *mqtt_broker = "192.168.1.77";  // Enter your WiFi or Ethernet IP
const char *topic = "room_a/#";
const int mqtt_port = 1883;
const char *mqttWillTopic = "room_a/alive";
const char *mqttWillMessage = "Client has died :(";

// VARIABLES
String max_temp;
String min_temp;
String max_hum;
String min_hum;

String alarm;         // [ON/OFF/CANCEL]
String alarm_update;  // [TRUE/FALSE]
String smoke;         // [ON/OFF/CANCEL]
String smoke_update;  // [TRUE/FALSE]
String ac = "0";      // [ON/OFF]
String ac_update;

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  // Set software serial baud to 115200;
  Serial.begin(115200);

  // connecting to a WiFi network
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }

  Serial.println("Connected to the WiFi network");

  //connecting to a mqtt broker
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);
  //client.setWill(mqttWillTopic, mqttWillMessage, 1, false);

  while (!client.connected()) {
    String client_id = "NODE_ROOM_A";
    client_id += String(WiFi.macAddress());

    Serial.printf("The client %s connects to mosquitto mqtt broker\n", client_id.c_str());

    if (client.connect(client_id.c_str(), mqtt_user, mqtt_password)) {
      Serial.println("Public mqtt broker connected");
    } else {
      Serial.print("failed with state ");
      Serial.print(client.state());
      delay(2000);
    }
  }
  //subscribes
  client.subscribe("room_a/temp/max");
  client.subscribe("room_a/temp/min");

  client.subscribe("room_a/hum/max");
  client.subscribe("room_a/hum/min");

  client.subscribe("room_a/smoke/send");
  client.subscribe("room_a/alarm/send");
  client.subscribe("room_a/ac/send");
}

void callback(char *topic, byte *payload, unsigned int length) {
  // Remove this
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);
  Serial.print("Message:");
  // Until here

  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }

  Serial.println();
  Serial.println(" - - - - - - - - - - - -");

  if (strcmp(topic, "room_a/alarm/send") == 0) {
    handleAlarmMessage(topic, payload, length);
  } else if (strcmp(topic, "room_a/smoke/send") == 0) {
    handleSmokeMessage(topic, payload, length);
  } else if (strcmp(topic, "room_a/ac/send") == 0) {
    handleACMessage(topic, payload, length);
  }

  handleTemperatureMessage(topic, payload, length);
}

/*---------------------- HANDLES ----------------------*/

void handleTemperatureMessage(char *topic, byte *payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  if (strcmp(topic, "room_a/temp/max") == 0) {
    max_temp = message;
  } else if (strcmp(topic, "room_a/temp/min") == 0) {
    min_temp = message;
  } else if (strcmp(topic, "room_a/hum/max") == 0) {
    min_temp = message;
  } else if (strcmp(topic, "room_a/hum/min") == 0) {
    min_temp = message;
  }
}

void handleAlarmMessage(char *topic, byte *payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  const char *alarmStatus = message.c_str();

  if (strcmp(alarmStatus, "0") == 0) {
    alarm = "0";
    Serial.print("Alarm is OFF: ");
    Serial.println(alarm);
  } else if (strcmp(alarmStatus, "1") == 0) {
    alarm = "1";
    Serial.print("Alarm is ON: ");
    Serial.println(alarm);
  } else if (strcmp(alarmStatus, "2") == 0) {
    alarm = "2";
    Serial.print("Alarm is CANCELED: ");
    Serial.println(alarm);
  }
}

void handleSmokeMessage(char *topic, byte *payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  const char *smokeStatus = message.c_str();

  if (strcmp(smokeStatus, "0") == 0) {
    smoke = "0";
    Serial.print("Smoke alarm is OFF: ");
    Serial.println(smoke);
  } else if (strcmp(smokeStatus, "1") == 0) {
    smoke = "1";
    Serial.print("Smoke Alarm is ON: ");
    Serial.println(smoke);
  } else if (strcmp(smokeStatus, "2") == 0) {
    smoke = "2";
    Serial.print("Smoke Alarm is CANCELED: ");
    Serial.println(smoke);
  }
}

void handleACMessage(char *topic, byte *payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  const char *ac_status = message.c_str();

  // We can only turn off if it was manually turned on!
  if (strcmp(ac_status, "0") == 0) {
    ac = "0";
    Serial.print("AC is OFF: ");
    Serial.println(ac);
    client.publish("room_a/ac/receive", String(ac).c_str());
  } else if (strcmp(ac_status, "1") == 0) {
    ac = "1";
    Serial.print("AC is ON: ");
    Serial.println(ac);
    client.publish("room_a/ac/receive", String(ac).c_str());
  }
}

/*---------------------- GETS ----------------------*/

float getRandomTemperature() {
  return static_cast<float>(rand() % 101);
}

float getRandomHumidity() {
  return static_cast<float>(rand() % 101);
}

int getRandomSmoke() {
  return rand() % 2;
}

int getRandomMovement() {
  return rand() % 2;
}

void SendReadings() {
  // TEMPERATURE
  float temp = getRandomTemperature();
  Serial.print("Temperature: ");
  Serial.println(temp);
  client.publish("room_a/temp/receive", String(temp).c_str());

  // HUMIDTY
  float hum = getRandomHumidity();
  Serial.print("Humidity: ");
  Serial.println(hum);
  client.publish("room_a/hum/receive", String(hum).c_str());

  // Convert values
  float minTempFloat = atof(min_temp.c_str());
  float maxTempFloat = atof(max_temp.c_str());
  float minHumFloat = atof(min_hum.c_str());
  float maxHumFloat = atof(max_hum.c_str());

  // AC LOGIC
  if(strcmp(String(ac).c_str(), "1") == 0){ // I turned it on
    Serial.println("Turned ON manually, can't do nothing.");
  }
  else {
    if ((temp > minTempFloat) || (temp < maxTempFloat)) {// Insert the humidity condition
      ac_update = "1";
      Serial.println("AC -> ON");
      client.publish("room_a/ac/receive", String(ac_update).c_str());
    }
    else {
      ac_update = "0";
      Serial.println("AC -> OFF");
      client.publish("room_a/ac/receive", String(ac_update).c_str());
    }
  }

  // SMOKE
  // if() adicionar logica do alarme estar desligado
  int smoke = getRandomSmoke();
  Serial.print("Smoke: ");
  Serial.println(smoke);
  client.publish("room_a/smoke/receive", String(smoke).c_str());

  // ALARM
  int alarm = getRandomMovement();
  Serial.print("Movement: ");
  Serial.println(alarm);
  client.publish("room_a/alarm/receive", String(alarm).c_str());
}

/*-------------------------------------------------*/


void loop() {
  client.loop();

  // Publish a message every 5 seconds
  static unsigned long lastAliveUpdate = 0;
  if (millis() - lastAliveUpdate > 5000) {
    client.publish("room_a/alive", "I am alive!");
    Serial.println("Message sent");
    lastAliveUpdate = millis();  // Reset the timer
  }

  // Update readings every 10 seconds -> maybe should be more
  static unsigned long lastUpdateReadings = 0;
  if (millis() - lastUpdateReadings > 10000) {
    SendReadings();
    lastUpdateReadings = millis();  // Reset the timer
  }
}