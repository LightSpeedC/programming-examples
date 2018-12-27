restrict-copy-stream
====

# クライアント client

1. サーバに接続 connect to server
	-> CONNECT os-user-id hostname ip-list-json-base64
	<- CONNECTED connection-id
2. get request "copy-stream" and "target"
	-> GET connection-id copy-stream-id
3. wait...
	... long time
3. get "copy-stream" and "target"
	<- GOT connection-id copy-stream-id target-id target-params-json-base64
4. copy! do any process! by spawn
5. release "copy-stream" (or disconnect)
	-> RELEASE connection-id copy-stream-id
		or DISCONNECT

# server

1. socket port listen
2. socket connect (wait request...)
	-> CONNECT os-domain-name os-user-id hostname ip-list-json-base64
	generate "connection-id" and log it and "request-params"
3. get your IP address (24 bit mask subnet)
	
	<- CONNECTED connection-id
4. get your "target", and response it


```
subnet0 -> target0
	client0-1
	client0-2
	client0-3

subnet1 -> target1
	client1-1
	client1-2
	client1-3

subnet2 -> target2
	client2-1
	client2-2
	client2-3

subnet-unknown -> target0
	clientX-1
	clientX-2
	clientX-3

```

# server config data

```json
{
	"log": true,
	"streams": {
		"stream-id-1": {
			"subnet0": {
				"target": "target-id-0",
				"params": {
				}
			},
			"subnet1": {
				"target": "target-id-1",
				"params": {
				}
			},
			"subnet2": {
				"target": "target-id-2",
				"params": {
				}
			}
		}
	}
}
```
