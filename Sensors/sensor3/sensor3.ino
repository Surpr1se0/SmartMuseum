#include <ESP8266WiFi.h>
#include <PubSubClient.h>             // WiFi
const char *ssid = "";      // Enter your WiFi name
const char *password = "";  // Enter WiFi password

// MQTT Brooker Login
const char *mqtt_user = "user1";
const char *mqtt_password = "user1";

// MQTT Broker
const char *mqtt_broker = "192.168.1.77";  // Enter your WiFi or Ethernet IP
const char *topic = "room_c/#";
const int mqtt_port = 1883;
const char *mqttWillTopic = "room_c/alive";
const char *mqttWillMessage = "Client has died :(";

// VARIABLES
String max_temp;
String min_temp;
String max_hum;
String min_hum;

String alarm;         // [TRIGGERED/NOT TRIGGERED/CANCEL]
String alarm_status;  // [ON/OFF]
String smoke;         // [TRIGGERED/NOT TRIGGERED/CANCEL]
String smoke_status;  // [TRUE/FALSE]
String ac = "0";      // [ON/OFF]
String ac_update;
bool led_blinking_smoke = false;
bool led_blinking_alarm = false;
bool alarm_canceled = false;
bool smoke_canceled = false;

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  // Set software serial baud to 115200;
  Serial.begin(115200);
  // Set LED values
  pinMode(LED_BUILTIN, OUTPUT);


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
    String client_id = "NODE_room_c";
    client_id += String(WiFi.macAddress());

    Serial.printf("The client %s connects to mosquitto mqtt broker\n", client_id.c_str());

    if (client.connect(client_id.c_str(), mqtt_user, mqtt_password, mqttWillTopic, 1, true, mqttWillMessage)) {
      Serial.println("Public mqtt broker connected");
    } else {
      Serial.print("failed with state ");
      Serial.print(client.state());
      delay(2000);
    }
  }
  //subscribes
  client.subscribe("room_c/temp/max");
  client.subscribe("room_c/temp/min");

  client.subscribe("room_c/hum/max");
  client.subscribe("room_c/hum/min");

  client.subscribe("room_c/smoke/send");
  client.subscribe("room_c/alarm/send");
  client.subscribe("room_c/ac/send");
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

  if (strcmp(topic, "room_c/alarm/send") == 0) {
    handleAlarmMessage(topic, payload, length);
  } else if (strcmp(topic, "room_c/smoke/send") == 0) {
    handleSmokeMessage(topic, payload, length);
  } else if (strcmp(topic, "room_c/ac/send") == 0) {
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

  if (strcmp(topic, "room_c/temp/max") == 0) {
    max_temp = message;
  } else if (strcmp(topic, "room_c/temp/min") == 0) {
    min_temp = message;
  } else if (strcmp(topic, "room_c/hum/max") == 0) {
    min_temp = message;
  } else if (strcmp(topic, "room_c/hum/min") == 0) {
    min_temp = message;
  }
}

void handleAlarmMessage(char *topic, byte *payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  const char *alarmStatus = message.c_str();

  if (strcmp(alarmStatus, "2") == 0) {
    alarm_status = "0";
    Serial.print("Alarm is OFF: ");
    Serial.println(alarm);
  } else if (strcmp(alarmStatus, "3") == 0) {
    alarm_status = "1";
    Serial.print("Alarm is ON: ");
    Serial.println(alarm);
  } else if (strcmp(alarmStatus, "4") == 0) {
    alarm = "2";
    alarm_canceled = true;
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

  if (strcmp(smokeStatus, "2") == 0) {
    smoke_status = "0";
    Serial.print("Smoke alarm is OFF: ");
    Serial.println(smoke);
  } else if (strcmp(smokeStatus, "3") == 0) {
    smoke_status = "1";
    Serial.print("Smoke Alarm is ON: ");
    Serial.println(smoke);
  } else if (strcmp(smokeStatus, "4") == 0) {
    smoke = "2";
    smoke_canceled = true;
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
    client.publish("room_c/ac/receive", String(ac).c_str());
  } else if (strcmp(ac_status, "1") == 0) {
    ac = "1";
    Serial.print("AC is ON: ");
    Serial.println(ac);
    client.publish("room_c/ac/receive", String(ac).c_str());
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
  client.publish("room_c/temp/receive", String(temp).c_str());

  // HUMIDTY
  float hum = getRandomHumidity();
  Serial.print("Humidity: ");
  Serial.println(hum);
  client.publish("room_c/hum/receive", String(hum).c_str());

  // Convert values
  float minTempFloat = atof(min_temp.c_str());
  float maxTempFloat = atof(max_temp.c_str());
  float minHumFloat = atof(min_hum.c_str());
  float maxHumFloat = atof(max_hum.c_str());

  // AC LOGIC
  if (strcmp(String(ac).c_str(), "1") == 0) {  // I turned it on
    Serial.println("Turned ON manually, can't do nothing.");
  } else {
    if (((temp > minTempFloat) || (temp < maxTempFloat)) && ((hum > minHumFloat) || (hum < maxHumFloat))) {
      ac_update = "1";
      Serial.println("AC -> ON");
      client.publish("room_c/ac/receive", String(ac_update).c_str());
    } else {
      ac_update = "0";
      Serial.println("AC -> OFF");
      client.publish("room_c/ac/receive", String(ac_update).c_str());
    }
  }

  // SMOKE
  int smoke = getRandomSmoke();
  Serial.print("Smoke: ");
  Serial.println(smoke);
  client.publish("room_c/smoke/receive", String(smoke).c_str());

  // ALARM
  int alarm = getRandomMovement();
  Serial.print("Movement: ");
  Serial.println(alarm);
  client.publish("room_c/alarm/receive", String(alarm).c_str());


  led_blinking_alarm = false;
  led_blinking_smoke = false;

  if ((strcmp(alarm_status.c_str(), "0") == 0) || (strcmp(alarm_status.c_str(), "2") == 0)) {
    Serial.println("Entering LED Blinking for Alarm");
    led_blinking_alarm = false;
  } else {
    Serial.println("Entering LED ELSE for Alarm");
    if (alarm == 1) {
      Serial.println("Entering LED IF for Alarm");
      led_blinking_alarm = true;
    }
  }

  if ((strcmp(smoke_status.c_str(), "0") == 0) || (strcmp(smoke_status.c_str(), "2") == 0)) {
    Serial.println("Entering LED Blinking for Smoke");
    led_blinking_smoke = false;
  } else {
    Serial.println("Entering LED ELSE for Smoke");
    if (smoke == 1) {
      Serial.println("Entering LED IF for Smoke");
      led_blinking_smoke = true;
    }
  }

  Serial.print("Alarm Status: ");
  Serial.println(alarm_status.c_str());
  Serial.print("Alarm: ");
  Serial.println(alarm);
  Serial.print("LED Blinking for Alarm: ");
  Serial.println(led_blinking_alarm);

  Serial.print("Smoke Status: ");
  Serial.println(smoke_status.c_str());
  Serial.print("Smoke: ");
  Serial.println(smoke);
  Serial.print("LED Blinking for Smoke: ");
  Serial.println(led_blinking_smoke);
}

/*-------------------------------------------------*/


void loop() {
  client.loop();
  digitalWrite(LED_BUILTIN, HIGH);

  // Publish a message every 5 seconds
  static unsigned long lastAliveUpdate = 0;
  if (millis() - lastAliveUpdate > 2000) {
    client.publish("room_c/alive", "I am alive!");
    Serial.println("Message sent");
    lastAliveUpdate = millis();  // Reset the timer
  }

  // Update readings every 10 seconds -> maybe should be more
  static unsigned long lastUpdateReadings = 0;
  if (millis() - lastUpdateReadings > 10000) {
    SendReadings();
    lastUpdateReadings = millis();  // Reset the timer
  }

  if ((led_blinking_smoke && !smoke_canceled) || (led_blinking_alarm && !alarm_canceled)) {
      digitalWrite(LED_BUILTIN, LOW);
      delay(500);
      digitalWrite(LED_BUILTIN, HIGH);
      delay(500);
  } else {
    digitalWrite(LED_BUILTIN, HIGH);
    led_blinking_alarm = false;
    led_blinking_smoke = false;
    smoke_canceled = false;
    alarm_canceled = false;
  }
}