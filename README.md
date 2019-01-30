![](http://subirimagen.me/uploads/20190128131637.png)
# SempliceJS Client

**Semplice Client Library**




##Mode of use:

Global methods that facilitate communication with Semplice


```javascript
//A new instance of Semplice-Client is created 
//and the use of websocket is activated
const semplice = new Semplice('http://localhost:3000', { websocket: true } );

// EventListener websocket
semplice.io().on('recived', function(res){
	console.log(res.detail);
});

// Fetch for Semplice API`s
semplice.fetch('/').then(res => res.json())
.then(response => console.log(response));

//Send data websocket
semplice.io().send('send',{data:'recived'});

```
                    
###Methods
                    
| Function name | Description                    | type
| ------------- | ------------------------------ | --------------------------------- |
| `fetch(route,opts)`      | Fetch for Semplice API`s       | Function
| `on(event,callback)`   | EventListener websocket    | Function
| `send(event,data)`   | Send data websocket   | Function
| `socketID().set(id)`   | Save new socketID    | Function
| `socketID().get()`   | View socketID   | Function
| `encodeBin(str)`   | Encode string to bin   | Function
| `decodeBin(str)`   | Dencode bin to string   | Function


###Defaults events

| Event name | Description                    | type
| ------------- | ------------------------------ | --------------------------------- |
| `SUCCESS_CONECTION` | Returns the event when the connection is established | Event


