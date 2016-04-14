对外协议: HTTP(https://)  WebsocketSecurity(wss://)

通用返回信息
{"code":200,"message":"Success","ok":true}
{"code":403,"message":"Protocol Error","ok":false}
{"code":500,"message":"Internal Server Error","ok":false}

1）资源路径 /im/www/v1/    
访问如 https://minami.cc/im/www/v1/chat.html

2）注册 https://minami.cc/im/register    
协议: POST
数据: ajax.Post(JSON.{})
account  string	账号 必填
password string	密码 必填
name     string	昵称 选填, 不填则为account
picture  string	头像 选填, base64编码
sex      string 性别 选填
birthday string 生日 选填
sign     string 签名 选填
mail     string 密保 必填
成功返回: 
{"code":200,"message":"Success","ok":true}
错误返回: 
{"code":403,"message":"Protocol Error","ok":false}
{"code":500,"message":"Internal Server Error","ok":false}
{"code":501,"message":"Account Info Empty","ok":false}
{"code":502,"message":"Password Info Empty","ok":false}
{"code":503,"message":"Secure Mail Info Empty","ok":false}
{"code":504,"message":"Account Already Exists","ok":false}

3）登陆 wss://minami.cc/im/login
协议: WebSocket
数据: wss://minami.cc/im/login/im/login?account=xxx&password=xxx
account  string	账号 必填
password string	密码 必填
成功返回: 
{
  "code": 200,
  "friends": [
    {
      "id": "f69f9777de910b9990e407cbedc243be",//好友id
      "name": "新朋友223",//好友昵称(我定义的好友别名，非好友自定义的name)
      "picture": "img/base64:01010101010101010101010",//好友头像(base64编码)
      "sex": "女",//好友性别
      "birthday": "1937-07-07",//好友生日
      "sign": "俄罗斯了",//好友签名
      "online": false//好友是否在线
    }
  ],
  "message": "Success",
  "ok": true,
  "profile": {
    "id": "61810e422ec1f24f2175c05a631c9a8f",//我的id，需要保存，auth认证时会用到
    "name": "minami",//我的别名
    "picture": "img/base64:01010101010101010101010",//我的头像(base64编码)
    "sex": "男",//我的性别
    "birthday": "1927-01-01",//我的生日
    "sign": "吃了吗?"//我的签名
  },
  "requests": [
    {
      "id": "f69f9777de910b9990e407cbedc243be",//申请人id
      "name": "minami",//申请人名称
      "to": "61810e422ec1f24f2175c05a631c9a8f",//我的id，此处可以忽略
      "note": "女票"//申请信息
    }
  ],
  "token": "2ab3a1db5cc70776319eb5bef385af79"//token，需要保存，后继请求(非WebSocket通道)auth认证时会用到
}
注: 
friends 好友信息,没有好友时为null
profile 当前用户信息 
requests 好友申请,没有申请时为null
错误返回: 
{"code":500,"message":"Internal Server Error","ok":false}
{"code":505,"message":"Account & Password Wrong","ok":false}

4）发现好友 https://minami.cc/im/friends/found  
协议: GET
数据: https://minami.cc/im/friends/found?id=xxx&token=xxx&name=xxx
id    string	我的id 必填
token string	token 必填
name  string    好友名称
成功返回: 
{
  "code": 200,
  "found": [
    {
      "id": "61810e422ec1f24f2175c05a631c9a8f",
      "name": "minami",
      "picture": "img/base64:01010101010101010101010",
      "sex": "男",
      "birthday": "1927-01-01",
      "sign": "吃了吗?"
    }
  ],
  "message": "Success",
  "ok": true
}
错误返回: 
{"code":500,"message":"Internal Server Error","ok":false}
{"code":514,"message":"Auth Info Empty","ok":false}
{"code":515,"message":"Auth Illegal","ok":false}
{"code":516,"message":"Name Empty","ok":false}
{"code":517,"message":"Account ID Empty","ok":false}

5）申请好友 https://minami.cc/im/friends/request  
协议: GET
数据: https://minami.cc/im/friends/request?id=xxx&token=xxx&to=xxx&note=xxx
id    string	我的id   必填
token string	token   必填
to    string    好友id   必填
note  string    申请信息
成功返回: 
{"code":200,"message":"Success","ok":true}
错误返回: 
{"code":500,"message":"Internal Server Error","ok":false}
{"code":514,"message":"Auth Info Empty","ok":false}
{"code":515,"message":"Auth Illegal","ok":false}
{"code":517,"message":"Account ID Empty","ok":false}
{"code":519,"message":"Friend Info Empty","ok":false}
{"code":522,"message":"Already Be Friend","ok":false}
{"code":523,"message":"Friend Not Exists","ok":false}

6）添加好友 https://minami.cc/im/friends/add  
协议: GET
数据: https://minami.cc/im/friends/add?id=xxx&token=xxx&from=xxx&name=xxx
id    string	我的id   必填
token string	token   必填
from  string    好友id   必填
name  string    好友别名  必填
成功返回: 
{"code":200,"message":"Success","ok":true}
错误返回: 
{"code":500,"message":"Internal Server Error","ok":false}
{"code":514,"message":"Auth Info Empty","ok":false}
{"code":515,"message":"Auth Illegal","ok":false}
{"code":517,"message":"Account ID Empty","ok":false}
{"code":519,"message":"Friend Info Empty","ok":false}
{"code":521,"message":"Alias Empty","ok":false}
{"code":522,"message":"Already Be Friend","ok":false}
{"code":523,"message":"Friend Not Exists","ok":false}

7）移除好友 https://minami.cc/im/friends/remove  
协议: GET
数据: https://minami.cc/im/friends/remove?id=xxx&token=xxx&to=xxx
id    string	我的id   必填
token string	token   必填
to    string    好友id   必填
成功返回: 
{"code":200,"message":"Success","ok":true}
错误返回: 
{"code":500,"message":"Internal Server Error","ok":false}
{"code":512,"message":"Not Relation of Friend","ok":false}
{"code":514,"message":"Auth Info Empty","ok":false}
{"code":515,"message":"Auth Illegal","ok":false}
{"code":517,"message":"Account ID Empty","ok":false}
{"code":519,"message":"Friend Info Empty","ok":false}

8）发送会话 WebSocket Tunnel
协议: tunnel
数据: wss.sendMessage(JSON.{})
id       string	流水，标识每次会话  必填
toFriend string	好友id           必填
payload  string	消息             必填

9）接收会话 WebSocket Tunnel
协议: tunnel
数据: wss.receiveMessage(JSON.{})
id       string	流水，标识每次会话  
from     string	好友id           
payload  string	消息            

wss.sendMessage(JSON.{}) 成功返回
{"code":200,"message":"Success","ok":true,"id":"xxx"}//id值为（id  string	流水，标识每次会话  必填）

wss.sendMessage(JSON.{}) 失败返回
{"code":500,"message":"Internal Server Error","ok":false}
{"code":506,"message":"Dialogue ID Empty","ok":false}
{"code":507,"message":"Dialogue Send To Friend Failed","ok":false,"id":"xxx"}//id值为（id  string	流水，标识每次会话  必填）
{"code":508,"message":"Friend Is Offline","ok":false,"id":"xxx"}//id值为（id  string	流水，标识每次会话  必填）
{"code":510,"message":"Friend ID Empty","ok":false}
{"code":511,"message":"Payload Empty","ok":false}
{"code":512,"message":"Not Relation of Friend","ok":false}

接收到会话消息
{"from":"61810e422ec1f24f2175c05a631c9a8f","payload":"吃饭了吗？"}




