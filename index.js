const idle  = (function(){
    let options = {};
    return {  
        start(opts) {
            options.timeout  = opts.timeout  || 40;
            options.inactive = opts.inactive || 5;
            this.time    = 0;
            this.idle    = "active";
            this.setTimer();
            this.setEvents();      
        },

        setTimer(){
            this._timer = setInterval(() =>{
                this.time++;
                this.onTimeChange();
            } , 60000);
        },

        onTimeChange(){
            if(this.time == this.options.timeout){
                this.dispatchChannel("idle");
            }
            else if(this.time >= this.options.inactive && this.idle == "active"){
                this.setPageInactive();
            }
        },

        setEvents(){
            window.addEventListener('click',      () =>{ this.setPageActive() });
            window.addEventListener('keypress',   () =>{ this.setPageActive() });
            window.addEventListener('mouseover',  () =>{ this.setPageActive() });
        },


        dispatchChannel(state){
            let State   = state.charAt(0).toUpperCase() + state.substring(1);
            let channel = new BroadcastChannel(`on${State}`);
            channel.postMessage({state : state});
            this.idle = state;
            localStorage.setItem("idle",state);
        },

        setPageInactive(){
            this.dispatchChannel("inactive");
        },
        
        setPageActive(){
            if(this.idle == "inactive"){
                this.dispatchChannel("active");
            }
            this.time = 0;
        },

        subscribe(channelName,callback){
            let channel = new BroadcastChannel(channelName);
            channel.onmessage = ((e) =>{
               callback(e);
            });
        },
    };
}());

module.exports.idle = idle;