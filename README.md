# Smart Museum
### A 3 sensor application with MQTT Mosquitto communication used to convert a normal museum to a smart museum.

This application, made for a Mobile Communications Class, focuses on implementing simple aspects of MQTT brooker Communications and ESP8266 Arduino PubSub libraries - _Qos, LWT, Docker Configuration, WebSockets and TCP protocols._

---
## Prerequisites

Before you begin this guide you'll need the following:

- Basic knowledge of ESP8266 arduinos with [these tutorials](https://randomnerdtutorials.com/projects-esp8266/)
- Basic knowledge of MQTT [Mosquitto Brooker](https://mosquitto.org/)

## How does it work:
This application works in 3 ways: 

### Sensors
Gives out the readings for temperature, humidity and the detectors. Implements logic from the data that receives from management application - to read, store, and alter the behaviour of the unit, depending on the values received. 

### Management
Gives out the maximum temperature and maximum humidity allowed for every room. Also can turn on/off all sensores and ac. It can also cancel the diferent sensor alarms. 
![management](https://github.com/Surpr1se0/SmartMuseum/assets/86316775/731f234b-c72e-4dc7-88be-b5f6eea04f5f)

### Actuator
Sees the actual state of every component in the ESP8266. Can also check the most frequent readings made from the sensors.
![actuator](https://github.com/Surpr1se0/SmartMuseum/assets/86316775/a0bcd82c-d785-4ab2-8936-08438201cb0b)

### Debugger
See all comunications being made with all the diferent applications. 
![debugger](https://github.com/Surpr1se0/SmartMuseum/assets/86316775/48432c3b-2aac-43d8-9653-815803e9b55e)

## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>
