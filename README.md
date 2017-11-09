# Can I Have Your Attention
## Research project created by Dion Woolley, under the supervision of [Andy Cockburn](http://www.cosc.canterbury.ac.nz/andrew.cockburn/) for COSC475.

#### Note this project does not officially support Linux, as Logitech does not provide official drivers for their G29 wheel

## Requirements

[Node v8, or higher](https://nodejs.org/en/download/current/)  
[Java 8 (latest)](https://java.com/en/download/)  
[Chrome installed](https://www.google.com/chrome/browser/desktop/index.html)  
[yarn](https://yarnpkg.com/en/docs/install)  
[Logitech G29 drivers](http://support.logitech.com/en_us/product/g29-driving-force/downloads)  

##### Ensure that the following are available in your PATH/ENVIRONMENT, node, java, yarn

## Installing
##### Clone or download the project onto the experimental computer
##### From the project directory, run following commands to install and build the software
* yarn install  
* cd node_modules/chrome-launcher  
* yarn install  
* yarn build  
* cd ../..


## Running
To run the experiment, open a terminal or command window, navigate to the project folder.  
In the case of the HITLab machine this is **C:\Users\Research\Can-I-Have-Your-Attention-COSC475-Research**  
Enter the command line args as specified below.

The application should launch two chrome windows in fullscreen on the correct displays.
e top of the file, there should be a log entry stating what set is being used and the start time.

Perform the experiment  

To quit the experiment, press Control-C when you have focus on the command prompt. 
This will kill both chrome windows and write out any remaining data to the log file.

Log files can be found in the results folder.  
Note that every time the application is run it creates a new log file. This means that a participant will have multiple log files.

### Command line args
The experiment accepts two command line arguments, the icon set the condition (w or w/o stencil) and the participants Id  
The icon set can be one of three values, [training, set1, set2]  
For the second argument the program accepts any string.  
The final argument is the participantID, this can be any alphanumeric string.

A few examples are below:
* node main.js training stencil 1
* node main.js set1 noStencil 1
* node main.js set2 stencil 1

## Targets
Targets are specified using properties separated by underscores  
[s,m,l]\_[f,c]\_[1,2]_[1,2,3,4,5,6]  
The first specifies the size, s=>small, m=>medium, l=>large  
Second is the entry profile, f=flat, c=curved or 45 degrees  
Third is the row, in this case 1 or 2, (note the stencil can accommodate a total of six rows)  
Fourth is the column, 1 - 6, or specifically 1 - 3 is the left side and 4 - 6 is the right
## Logging events
Event types
* start
    * id: The id of the participant
    * startTime: time the experiment started in UNIX time
    * imageMap: the image set being used, set1, set2 or training
    * condition: stencil or notStencil, or any string passed as a command arg
    * programArgs: All program args
* arrowDisplacement
    * dist: distance from the spline to the tip of the arrow, threshold this value to tell if drifted from path
    * timestamp: UNIX timestamp
* focusstart (When the spacebar is first held down)
    * startTime: UNIX timestamp
* focusend (on spacebar release)
    * startTime: UNIX timestamp
    * endTime: UNIX timestamp
    * elapsedTime: in milliseconds
*  showImage (Image is shown to the participant)
    *  timestart: UNIX timestamp
*  touchstart (Participant places finger on the display)
    *  timestamp: UNIX timestamp
*  buttonHit
    *  hit: true or false, if the button was hit
    *  target: the touch target
    *  timestamp: UNIX time
*  hideImage (Image is removed from view)
    *  timestart: UNIX timestamp, when the image was shown
    *  timeend: UNIX timestamp, when the image was hidden
    *  elapsedTime: time between showing and hiding the image, in milliseconds


## Troubleshooting
Some issues that have been encountered along the way.
#### Animation stuttering
This may be due to Vsync or vertical sync, if you are using a Nvidia or AMD GPU and have hardware acceleration enabled in Chrome, then you will need to change the global settings for VSync in the respective driver control panel. It make also to be possible to disable this for Intel GPUs
#### Chrome windows missing
If one or both Chrome windows are not showing up on launch, this may be due to the display configuration of the experimental machine changing.
The setting for the locations for launching the Chrome windows can be found in the last few lines of code in [main.js](main.js)
#### Touchscreen not working
* Check to make sure that the touch display is calibrated.
* To calibrate the display you can go to the Control Panel in Windows.
* Select view by small icons, if not already
* Click Tablet PC Settings
* Click setup and follow the onscreen instructions.
#### Steering Wheel not working
* check USB connections
* Ensure the Logitech Gaming software for the wheel is running.