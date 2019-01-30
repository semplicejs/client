function Semplice(urlServer, options = {
    websocket: false,
    protocols: []
}) {
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    var self = this; 
    this.options = options;
    this.url = urlServer;

    if (this.options.websocket) {
        this.urlWS = this.url.split('//');
        this.urlWS = 'ws://' + this.urlWS[1];
        this.ws = new WebSocket(this.urlWS, this.options.protocols);
        
        this.ws.onopen = function (open) {
            
        };
        this.ws.onerror = function (error) {
            console.log('Semplice - Websocket error:', error);
        };


        this.ws.onmessage = function (event) {
            let data = JSON.parse(event.data);
            
            if(data.event === 'OPEN_CONEXION'){
                self.socketID().set(data.id);
                event['socketID'] = self.socketID().get();
                self.send('OPEN_SUCCESS',event)
                
            } else {
                document.dispatchEvent(new CustomEvent(data.event, {
                    bubbles: true,
                    detail: data
                }));
            }
        };
    }
}


Semplice.prototype.open = function(callback){
    this.ws.onopen = function(open){
        callback(open);
    }
}

Semplice.prototype.send = function(event = '', data = {}){
    data['event'] = event;
    data['socketID'] = this.socketID().get();
    let obj = JSON.stringify({data});
    this.ws.send(obj);
};

Semplice.prototype.on = function(ev, callback){
    document.addEventListener(ev, callback, false);
}

Semplice.prototype.fetch = function (url, opts = {}, onProgress) {
    const data = new FormData();

    for (let key in opts.body) {
        data.append(key, opts.body[key]);
    }

    opts.body = data;

    return fetch(this.url + url, opts, onProgress).then(a => {
        onProgress(a);
        return a
    });
}

Semplice.prototype.socketID = function(){
    var self = this;
    return {
        set: function(id){
            
            return window.localStorage.setItem('_ssws86',self.encodeBin(id));
        },
    
        get: function(){
            return self.decodeBin(window.localStorage.getItem('_ssws86'));
        },
    
        check: function(){
            return window.localStorage.getItem('_ssws86') ? true : false;
        },
    
        delete: function(){
            return window.localStorage.removeItem('_ssws86');
        }
    }
}


Semplice.prototype.encodeBin = function( s ){
    s = unescape( encodeURIComponent( s ) );
    var chr, i = 0, l = s.length, out = '';
    for( ; i < l; i ++ ){
        chr = s.charCodeAt( i ).toString( 2 );
        while( chr.length % 8 != 0 ){ chr = '0' + chr; }
        out += chr;
    }
    return out;
};


Semplice.prototype.decodeBin = function( s ){
    var i = 0, l = s.length, chr, out = '';
    for( ; i < l; i += 8 ){
        chr = parseInt( s.substr( i, 8 ), 2 ).toString( 16 );
        out += '%' + ( ( chr.length % 2 == 0 ) ? chr : '0' + chr );
    }
    return decodeURIComponent( out );
};
