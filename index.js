function Semplice(urlServer, options = {websocket: false}) {
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    this.options = options;
    this.url = urlServer;

    if (this.options.websocket) {
        this.urlWS = this.url.split('//');
        this.urlWS = 'ws://' + this.urlWS[1];
        this.ws = new WebSocket(this.urlWS);
        this.ws.onopen = function () {};
        this.ws.onerror = function (error) {
            console.log('Semplice - Websocket error:', error);
        };
        this.ws.onmessage = function (event) {
            let data = JSON.parse(event.data);
            document.dispatchEvent(new CustomEvent(data.event, {
                bubbles: true,
                detail: data
            }));
        };
    }
}

Semplice.prototype.io = function () {
    var self = this;
    if (this.options.websocket) {
        return {
            on: function (ev, callback) {
                document.addEventListener(ev, callback, false);
            },

            send: function (event = '', data = {}) {
                data['event'] = event;
                let obj = JSON.stringify({
                    data
                })
                self.ws.send(obj);
            }
        }
    }
}

Semplice.prototype.fetch = function (url, opts = {}, onProgress) {
    const data = new FormData();

    for(let key in opts.body){
        data.append(key,opts.body[key]);
    }

    opts.body = data;

    return fetch(this.url+url,opts,onProgress)
        .then(a => {
            onProgress(a);
            return a
        });
}