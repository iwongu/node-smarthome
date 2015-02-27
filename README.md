# pi-surveillance

Simple surveillance system using Raspberry Pi + Node.js

## System

This simple surveillance system consists of three parts; motion detector, display, lights.
The display will show alert whenever the system detects motions. Also the lights will be turned on. After a fixed amount of time, the lights will be off if there is no more motions detected.

It uses Raberry Pi for its controller, PIR sensors for motion detectors, and LCD module for display. The controller is abstracted so that it can be reused with other types of motion detectors or display.
