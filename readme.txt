Protocol: HTTP(https://)  WebsocketSecurity(wss://)

Generate Response Code
{"code":200,"message":"Success","ok":true}
{"code":403,"message":"Protocol Error","ok":false}
{"code":500,"message":"Internal Server Error","ok":false}

1) Resource Path /im/www/v1/    
ex: https://host.com/im/www/v1/chat.html

2) Register https://host.com/im/register    
Protocol: POST
Data: ajax.Post(JSON.{})
account  string not null
password string	not null
name     string	null allowed  if null, then will be account
picture  string	null allowed  base64
sex      string null allowed
birthday string null allowed
sign     string null allowed
mail     string not null      used for when forget password 
On Success: 
{"code":200,"message":"Success","ok":true}
On Panic: 
{"code":403,"message":"Protocol Error","ok":false}
{"code":500,"message":"Internal Server Error","ok":false}
{"code":501,"message":"Account Info Empty","ok":false}
{"code":502,"message":"Password Info Empty","ok":false}
{"code":503,"message":"Secure Mail Info Empty","ok":false}
{"code":504,"message":"Account Already Exists","ok":false}

3) Login wss://host.com/im/login
Protocol: WebSocket
Data: wss://host.com/im/login/im/login?account=xxx&password=xxx
account  string	login account not null
password string	password      not null
On Success: 
{
  "code": 200,
  "friends": [
    {
      "id": "f69f9777de910b9990e407cbedc243be",//friend id
      "name": "Sunny Tom",//friend alias(named by yourself, but not the one named by friend himself)
      "picture": "img/base64:01010101010101010101010",//base64
      "sex": "male",
      "birthday": "1937-07-07",
      "sign": "The Strong Tom",
      "online": false
    }
  ],
  "message": "Success",
  "ok": true,
  "profile": {
    "id": "61810e422ec1f24f2175c05a631c9a8f",//my id, must be remember, reason for auth
    "name": "Funny John",//my name
    "picture": "img/base64:01010101010101010101010",//base64
    "sex": "male",
    "birthday": "1927-01-01",
    "sign": "I wanna to Mars"
  },
  "requests": [
    {
      "id": "f69f9777de910b9990e407cbedc243be",//id of who request for friend
      "name": "Alex",//guy's name
      "to": "61810e422ec1f24f2175c05a631c9a8f",//my id, this coule be ignore
      "note": "Hello John, this is Alex"//the information of request
    }
  ],
  "token": "2ab3a1db5cc70776319eb5bef385af79"//token, must be remember, reason for auth
}
note: 
friends  information of friends, if have no friend, this will be null
profile  my profile
requests guy who request to be friend, if have no request, this will be null
On Panic: 
{"code":500,"message":"Internal Server Error","ok":false}
{"code":505,"message":"Account & Password Wrong","ok":false}

4) Search Friend https://host.com/im/friends/found  
Protocol: GET
Data: https://host.com/im/friends/found?id=xxx&token=xxx&name=xxx
id    string	my id                         not null
token string	token                         not null
name  string    the guy's name searching for  not null
On Success: 
{
  "code": 200,
  "found": [
    {
      "id": "61810e422ec1f24f2175c05a631c9a8f",
      "name": "Minami",
      "picture": "img/base64:01010101010101010101010",
      "sex": "female",
      "birthday": "1927-01-01",
      "sign": "I'am so Happy everyday"
    }
  ],
  "message": "Success",
  "ok": true
}
On Panic: 
{"code":500,"message":"Internal Server Error","ok":false}
{"code":514,"message":"Auth Info Empty","ok":false}
{"code":515,"message":"Auth Illegal","ok":false}
{"code":516,"message":"Name Empty","ok":false}
{"code":517,"message":"Account ID Empty","ok":false}

5) Request Friend https://host.com/im/friends/request  
Protocol: GET
Data: https://host.com/im/friends/request?id=xxx&token=xxx&to=xxx&note=xxx
id    string	my id              not null
token string	token              not null
to    string    the guy's id       not null
note  string    apply information  null allowed
On Success: 
{"code":200,"message":"Success","ok":true}
On Panic: 
{"code":500,"message":"Internal Server Error","ok":false}
{"code":514,"message":"Auth Info Empty","ok":false}
{"code":515,"message":"Auth Illegal","ok":false}
{"code":517,"message":"Account ID Empty","ok":false}
{"code":519,"message":"Friend Info Empty","ok":false}
{"code":522,"message":"Already Be Friend","ok":false}
{"code":523,"message":"Friend Not Exists","ok":false}

6) Add Friend https://host.com/im/friends/add  
Protocol: GET
Data: https://host.com/im/friends/add?id=xxx&token=xxx&from=xxx&name=xxx
id    string	my id              not null
token string	token              not null
from  string    friend's id        not null
name  string    named by yourself  not null
On Success: 
{"code":200,"message":"Success","ok":true}
On Panic: 
{"code":500,"message":"Internal Server Error","ok":false}
{"code":514,"message":"Auth Info Empty","ok":false}
{"code":515,"message":"Auth Illegal","ok":false}
{"code":517,"message":"Account ID Empty","ok":false}
{"code":519,"message":"Friend Info Empty","ok":false}
{"code":521,"message":"Alias Empty","ok":false}
{"code":522,"message":"Already Be Friend","ok":false}
{"code":523,"message":"Friend Not Exists","ok":false}

7) Remove Friend https://host.com/im/friends/remove  
Protocol: GET
Data: https://host.com/im/friends/remove?id=xxx&token=xxx&to=xxx
id    string	my id         not null
token string	token         not null
to    string    friend's id   not null
On Success: 
{"code":200,"message":"Success","ok":true}
On Panic: 
{"code":500,"message":"Internal Server Error","ok":false}
{"code":512,"message":"Not Relation of Friend","ok":false}
{"code":514,"message":"Auth Info Empty","ok":false}
{"code":515,"message":"Auth Illegal","ok":false}
{"code":517,"message":"Account ID Empty","ok":false}
{"code":519,"message":"Friend Info Empty","ok":false}

8) Send Dialogue WebSocket Tunnel
Protocol: tunnel
Data: wss.sendMessage(JSON.{})
id       string	 sequence, mark each dialogue  not null
toFriend string	 friend's id                   not null
payload  string  message                       not null

9) Receive Dialogue WebSocket Tunnel
Protocol: tunnel
Data: wss.receiveMessage(JSON.{})
id       string	 sequence, mark each dialogue  
from     string	 friend's id         
payload  string	 message           

wss.sendMessage(JSON.{}) On Success
{"code":200,"message":"Success","ok":true,"id":"xxx"}//id is defined above(id  string sequence, mark each dialogue  not null)

wss.sendMessage(JSON.{}) On Panic
{"code":500,"message":"Internal Server Error","ok":false}
{"code":506,"message":"Dialogue ID Empty","ok":false}
{"code":507,"message":"Dialogue Send To Friend Failed","ok":false,"id":"xxx"}//id is defined above(id  string sequence, mark each dialogue  not null) 
{"code":508,"message":"Friend Is Offline","ok":false,"id":"xxx"}//id is defined above(id  string sequence, mark each dialogue  not null) 
{"code":510,"message":"Friend ID Empty","ok":false}
{"code":511,"message":"Payload Empty","ok":false}
{"code":512,"message":"Not Relation of Friend","ok":false}

Receive Dialogue
{"from":"61810e422ec1f24f2175c05a631c9a8f","payload":"How are you ?"}




