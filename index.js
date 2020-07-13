const idle  = (function(){
    let options = {};
    return {  
        start(opts) {
            this.options.timeout  = opts.timeout  || 40;
            this.options.inactive = opts.inactive || 5;
            this.time    = 0;
            this.idle    = "active";
            this.startTimer();
            this.setEvents();      
        },

        startTimer(){
            this._timer = setInterval(() =>{
                this.time++;
                this.onTimerChange();
            } , 60000);
        },

        onTimerChange(){
            if(this.time == this.options.timeout){
                this.notify("idle");
            } 
            else if(this.time >= this.options.inactive && this.idle == "active"){
                this.notify("inactive");
            }
        },

        setEvents(){
            window.addEventListener('click',      () =>{ this.onWindowInteraction() });
            window.addEventListener('keypress',   () =>{ this.onWindowInteraction() });
            window.addEventListener('mouseover',  () =>{ this.onWindowInteraction() });
        },

        onWindowInteraction(){
            if(this.idle == "inactive"){
                this.notify("active");
            }
            this.time = 0;
        }, 

        notify(state){
            let State   = state.charAt(0).toUpperCase() + state.substring(1);
            let channel = new BroadcastChannel(`on${State}`);
            channel.postMessage({state : state});
            this.idle   = state;
        },

        subscribe(name,callback){
            let channel = new BroadcastChannel(name);
            channel.onmessage = ((e) =>{
               callback(e);
            });
        },
    };
}());

module.exports.idle = idle;
