# Idle Handler

A small and simple free dependency to manage window idle.

## Installation
```bash
npm install dw-idle-handler
```

## Usage
```javascript
idleHandler.start({
    timeout  : 30, // minutes 
    inactive : 5  
});
idleHandler.on("timeout",()=>{
   //timeout
});

idleHandler.on("inactive",()=>{
   //window is inactive
});

idleHandler.on("active",()=>{
   //window is active
   //Detected user interaction by one of this events : click, keypress, mouseover and touchstart
});
```
### For previous versions <= 0.0.9
```javascript
const idleHandler   = require('dw-idle-handler');
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