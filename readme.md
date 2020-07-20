# Idle Handler
A small and simple free dependency to manage window idle.

## Installation
```bash
npm install dw-idle-handler
```

## Usage
```javascript
const idleHandler   = require('dw-idle-handler');

idleHandler.start({
   timeout  : 30, // minutes 
   inactive : 5  
});

idleHandler.on("timeout",(e)=>{
   if(e.tab.lastFocus){
      //this was the last focused browser tab
   }
});

idleHandler.on("inactive",()=>{
   //window is inactive
});

idleHandler.on("active",()=>{
   //window is active
   //Detected user interaction by one of this events : click, keypress, mouseover and touchstart
});
```
## Note
Thanks to the  [TabsManager](https://www.npmjs.com/package/browser-tabs-manager) package and local storage the library can has a persistent timer
even if there are multiple browser tabs the timer will be the same for each window only allowing only one lnterval timer for the active tab or the last active tab, anyway when a tab has passed timeout all tabs will be notified with the timeout event

## For previous versions <= 0.0.9
```javascript
idleHandler.start({
    timeout  : 30, // minutes 
    inactive : 5  
});
idleHandler.subscribe("onIdle",callback);
idleHandler.subscribe("onInactive",callback);
idleHandler.subscribe("onActive",callback);
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License [MIT]