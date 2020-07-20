
const TabsManager  = (function(){
    return { 
        setup(){
            this.tabs = this.getTabs();
            this.tab  = btoa(new Date());
            this.addTab();
            window.addEventListener('beforeunload',   () =>{ this.removeTab() });
            window.addEventListener('focus',          () =>{ this.focusTab() });
            window.addEventListener('blur',           () =>{ this.unfocusTab() });
        },

        getTabs(){
            return  JSON.parse(localStorage.getItem('TabsManager') || JSON.stringify({open : []}));
        },

        getTab(){
            let index = this.getTabs().open.findIndex((t)=> t.id == this.tab);
            return this.getTabs().open[index];
        },

        addTab(){
            this.tabs.open.forEach((t) => t.lastFocus = false);
            this.tabs.open.push({
                id        : this.tab,
                focus     : true,
                lastFocus : true,
                href      : location.href,
            });
           this.update();
        },

        removeTab(){
            let index = this.tabs.open.findIndex((t)=> t.id == this.tab);
            this.tabs.open.splice(index,1);
            this.update();
        },

        focusTab(){
            this.tabs = this.getTabs();
            this.tabs.open.forEach((t) => t.lastFocus = false);
            let index = this.tabs.open.findIndex((t)=> t.id == this.tab);
            this.tabs.open[index].focus     = true;
            this.tabs.open[index].lastFocus = true;
            this.update();
        },

        unfocusTab(){
            this.tabs = this.getTabs();
            let index = this.tabs.open.findIndex((t)=> t.id == this.tab);
            this.tabs.open[index].focus = false;
            this.update();
        },

        update(){
            localStorage.setItem('TabsManager',JSON.stringify(this.tabs));
        },

        clearAll(){
            this.tabs = {open : []};
            this.update();
        }
    };
}());
TabsManager.setup();

const idle  = (function(){
    return {  
        start(opts) {
            this.options           = {};
            this.options.timeout   = opts.timeout  || 40;
            this.options.inactive  = opts.inactive || 5;
            this.idle              = "active";
            localStorage.idleTime  = 0;
            this.listenChannel();
            this.startTimer();
            this.setEvents();      
        },

        listenChannel(){
            let channel = new BroadcastChannel(`dw-idle-handler`);
            channel.onmessage = ((e)=>{
                if(e.data == "destroyTimers"){
                    this.destroyTimer();
                }
            });
        },

        startTimer(){
            if(!this._timer){
                this._timer = setInterval(() =>{
                    localStorage.idleTime = this.currentTime() + 1;
                    this.onTimerChange();
                } , 60000);
            }
        },

        destroyTimer(){
            this.tab = TabsManager.getTab();
            if(this._timer != null && this.tab.lastFocus == true != this.tab.focus == false && TabsManager.getTabs().open.length > 1){
                this._timer = null
                clearInterval(this._timer);
            }
        },

        currentTime(){
            return parseInt(localStorage.idleTime);
        },

        onTimerChange(){
            if(this.currentTime() == this.options.timeout){
                this.notify("timeout");
            } 
            else if(this.currentTime() >= this.options.inactive && this.idle == "active"){
                this.notify("inactive");
            }
        },

        setEvents(){
            window.addEventListener('click',      () =>{ this.onWindowInteraction() });
            window.addEventListener('keypress',   () =>{ this.onWindowInteraction() });
            window.addEventListener('mouseover',  () =>{ this.onWindowInteraction() });
            window.addEventListener('focus',      () =>{ this.startTimer() });
            
            window.addEventListener('blur',       () =>{
                let channel = new BroadcastChannel(`dw-idle-handler`);
                channel.postMessage("destroyTimers");
            });
        },

        onWindowInteraction(){
            if(this.idle == "inactive"){
                this.notify("active");
            }
            localStorage.idleTime = 0;
        }, 

        notify(state){
            let State   = state.charAt(0).toUpperCase() + state.substring(1);
            let channel = new BroadcastChannel(`on${State}`);
            channel.postMessage({
                tab : TabsManager.getTab()
            });
            this.idle   = state;
        },
        
        on(name,callback){
            let Name    = name.charAt(0).toUpperCase() + name.substring(1);
            let channel = new BroadcastChannel(`on${Name}`);
            channel.onmessage = ((e) =>{
               callback(e);
            });
        },
    };
}());

module.exports = idle;
