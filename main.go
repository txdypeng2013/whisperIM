package main

import (
	"crypto/md5"
	"crypto/tls"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"errors"
	"github.com/gorilla/websocket"
	_ "github.com/lib/pq"
	"io"
	"io/ioutil"
	"math/rand"
	"net/http"
	"runtime/debug"
	"strconv"
	"strings"
	"time"
	"whisperIM/code"
	"whisperIM/log"
)

/*
Postgresql 9.5
CREATE TABLE public.profile
(
  body jsonb NOT NULL -- profile body
)
CREATE TABLE public.request
(
  body jsonb NOT NULL
)
*/

var upgrader = websocket.Upgrader{
	HandshakeTimeout: time.Second * 10,
}

var pool = make(map[string]*User, 1024)  // user id : pointer to user
var auth = make(map[string]string, 1024) // token : user id

var DB *sql.DB

type User struct {
	id      string
	friends map[string]string
	conn    *websocket.Conn
	token   string
}

type Profile struct {
	Id       string            `json:"id"`
	Account  string            `json:"account"`
	Password string            `json:"password"`
	Name     string            `json:"name"`
	Picture  string            `json:"picture"`
	Sex      string            `json:"sex"`
	Birthday string            `json:"birthday"`
	Sign     string            `json:"sign"`
	Mail     string            `json:"mail"`
	Friends  map[string]string `json:"friends"` // friend id : user-defined alias
}

type ProfileShow struct {
	Id       string `json:"id"`
	Name     string `json:"name"`
	Picture  string `json:"picture"`
	Sex      string `json:"sex"`
	Birthday string `json:"birthday"`
	Sign     string `json:"sign"`
}

type Friend struct {
	Id       string `json:"id"`
	Name     string `json:"name"`
	Picture  string `json:"picture"`
	Sex      string `json:"sex"`
	Birthday string `json:"birthday"`
	Sign     string `json:"sign"`
	Online   bool   `json:"online"`
}

type Dialogue struct {
	Id       string `json:"id,omitempty"` //remark the payload of this dialogue
	ToFriend string `json:"toFriend,omitempty"`
	Payload  string `json:"payload,omitempty"`
	From     string `json:"from,omitempty"`
}

type Request struct {
	Id   string `json:"id"`   // id of who request
	Name string `json:"name"` // name of who request
	To   string `json:"to,omitempty"`
	Note string `json:"note"` // request note
}

const crt = "cert.pem"
const key = "privkey.pem"

func main() {

	db, err := sql.Open("postgres", "host=127.0.0.1 port=5433 user=postgres password=root dbname=postgres sslmode=disable")
	if err != nil {
		panic(err)
	}
	DB = db
	defer db.Close()

	http.Handle("/im/www/v1/", http.StripPrefix("/im/www/v1/", http.FileServer(http.Dir("example"))))
	http.HandleFunc("/im/register", registerHandle)
	http.HandleFunc("/im/login", loginHandle)
	http.HandleFunc("/im/friends/found", foundFriendHandle)
	http.HandleFunc("/im/friends/request", requestFriendHandle)
	http.HandleFunc("/im/friends/add", addFriendHandle)
	http.HandleFunc("/im/friends/remove", removeFriendHandle)

	certMinami, err := tls.LoadX509KeyPair(crt, key)
	if err != nil {
		panic(err)
	}

	server := &http.Server{

		Addr:           ":443",
		Handler:        nil,
		ReadTimeout:    time.Minute * 1,
		WriteTimeout:   time.Minute * 1,
		MaxHeaderBytes: 1 << 20,
		TLSConfig: &tls.Config{
			Certificates: []tls.Certificate{certMinami},
			//			ClientAuth: tls.RequestClientCert,
		},
	}

	log.Info("attempting to start listener")
	if err := server.ListenAndServeTLS("", ""); err != nil {
		panic(err)
	}

	//	if err := server.ListenAndServe(); err != nil {
	//		panic(err)
	//	}
}

func registerHandle(w http.ResponseWriter, req *http.Request) {

	defer func() {
		if err := recover(); err != nil {
			log.Error(err)
			log.Error(string(debug.Stack()))
			io.WriteString(w, getResponseMsg(500))
		}
	}()

	if req.Method != "POST" {
		io.WriteString(w, getResponseMsg(403))
		return
	}

	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		panic(err)
	}

	profile := &Profile{}
	if err := json.Unmarshal(body, profile); err != nil {
		panic(err)
	}

	profile.Account = strings.TrimSpace(profile.Account)
	profile.Password = strings.TrimSpace(profile.Password)
	profile.Name = strings.TrimSpace(profile.Name)
	profile.Picture = strings.TrimSpace(profile.Picture)
	profile.Sex = strings.TrimSpace(profile.Sex)
	profile.Birthday = strings.TrimSpace(profile.Birthday)
	profile.Sign = strings.TrimSpace(profile.Sign)
	profile.Mail = strings.TrimSpace(profile.Mail)

	if profile.Account == "" {
		io.WriteString(w, getResponseMsg(501))
		return
	}
	if profile.Password == "" {
		io.WriteString(w, getResponseMsg(502))
		return
	}
	if profile.Mail == "" {
		io.WriteString(w, getResponseMsg(503))
		return
	}

	found, err := foundAccount(profile.Account)
	if err != nil {
		panic(err)
	}
	if found {
		io.WriteString(w, getResponseMsg(504))
		return
	}

	profile.Id = generateID(req.RemoteAddr + req.UserAgent() + strconv.FormatInt(time.Now().Unix(), 10) + strconv.FormatInt(time.Now().UnixNano(), 10) + strconv.FormatInt(rand.Int63(), 10))
	if profile.Friends == nil {
		profile.Friends = make(map[string]string)
	}

	if err := registerAccount(profile); err != nil {
		panic(err)
	}
	io.WriteString(w, getResponseMsg(200))
}

func foundAccount(account string) (found bool, Err error) {

	defer func() {
		if err := recover(); err != nil {
			log.Error(err)
			log.Error(string(debug.Stack()))
			Err = errors.New("foundAccount panic")
		}
	}()

	var count int
	if err := DB.QueryRow(`select count(1) from profile where body->'account' ? $1`, account).Scan(&count); err != nil {
		panic(err)
	}

	if count != 0 {
		found = true
	}
	return
}

func registerAccount(profile *Profile) (Err error) {

	tx, err := DB.Begin()
	if err != nil {
		Err = err
		return
	}

	defer func() {
		if err := recover(); err != nil {
			log.Error(err)
			log.Error(string(debug.Stack()))
			Err = errors.New("registerAccount panic")
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	body, err := json.Marshal(profile)
	if err != nil {
		panic(err)
	}

	if _, err := tx.Exec(`insert into profile (body) values ($1)`, string(body)); err != nil {
		panic(err)
	}
	return
}

func loginHandle(w http.ResponseWriter, req *http.Request) {

	var conn *websocket.Conn
	var err error
	var user *User

	defer func() {
		if err := recover(); err != nil {
			log.Error(err)
			log.Error(string(debug.Stack()))
			if conn != nil {
				conn.WriteMessage(websocket.TextMessage, []byte(getResponseMsg(500)))
			}
		}
		if user != nil {
			delete(pool, user.id)
			delete(auth, user.token)
		}
		if conn != nil {
			conn.Close()
		}
	}()

	if conn, err = upgrader.Upgrade(w, req, nil); err != nil {
		panic(err)
	}

	if err := req.ParseForm(); err != nil {
		panic(err)
	}
	account := strings.TrimSpace(req.FormValue("account"))
	password := strings.TrimSpace(req.FormValue("password"))

	if account == "" || password == "" {
		conn.WriteMessage(websocket.TextMessage, []byte(getResponseMsg(505)))
		return
	}

	profile := getProfile(account, password, "")
	if profile == nil {
		conn.WriteMessage(websocket.TextMessage, []byte(getResponseMsg(505)))
		return
	}

	if u, ok := pool[profile.Id]; ok {
		u.conn.WriteMessage(websocket.TextMessage, []byte(getResponseMsg(513)))
		u.close()
	}

	token := generateID(req.RemoteAddr + req.UserAgent() + strconv.FormatInt(time.Now().Unix(), 10) + strconv.FormatInt(time.Now().UnixNano(), 10) + strconv.FormatInt(rand.Int63(), 10))

	user = &User{
		id:      profile.Id,
		friends: profile.Friends,
		token:   token,
	}

	user.conn = conn
	pool[user.id] = user
	auth[token] = user.id

	profileShow := ProfileShow{
		Id:       profile.Id,
		Name:     profile.Name,
		Picture:  profile.Picture,
		Sex:      profile.Sex,
		Birthday: profile.Birthday,
		Sign:     profile.Sign,
	}

	var friends []Friend
	for id, name := range profile.Friends {

		friendProfile := getProfile("", "", id)
		if friendProfile == nil {
			continue
		}

		friend := Friend{
			Id:       id,
			Name:     name,
			Picture:  friendProfile.Picture,
			Sex:      friendProfile.Sex,
			Birthday: friendProfile.Birthday,
			Sign:     friendProfile.Sign,
			Online: func(id string) (ok bool) {
				_, ok = pool[id]
				return
			}(id),
		}
		friends = append(friends, friend)
	}

	var requests []Request
	rows, err := DB.Query(`select body from request where body->'to' ? $1`, profile.Id)
	if err != nil {
		panic(err)
	}
	for rows.Next() {
		var body []byte
		if err := rows.Scan(&body); err != nil {
			panic(err)
		}
		request := Request{}
		if err := json.Unmarshal(body, &request); err != nil {
			panic(err)
		}
		requests = append(requests, request)
	}

	responseMsg := make(map[string]interface{})
	okCode := code.CodeDeclare[200]
	responseMsg["code"] = okCode.Code
	responseMsg["message"] = okCode.Message
	responseMsg["ok"] = okCode.Ok
	responseMsg["profile"] = profileShow
	responseMsg["friends"] = friends
	responseMsg["requests"] = requests
	responseMsg["token"] = token

	response, err := json.Marshal(responseMsg)
	if err != nil {
		panic(err)
	}

	conn.WriteMessage(websocket.TextMessage, response)

	for {
		if msgType, message, err := conn.ReadMessage(); err != nil {
			panic(err)
		} else {
			if msgType != websocket.TextMessage {
				conn.WriteMessage(websocket.TextMessage, []byte(getResponseMsg(509)))
				return
			}
			user.onMessage(message)
		}
	}
}

func getProfile(account, password, id string) *Profile {

	var rows *sql.Rows
	var err error

	if id == "" { //login

		if rows, err = DB.Query(`select body from profile where body->'account' ? $1 and body->'password' ? $2`, account, password); err != nil {
			panic(err)
		}
	} else { //getById

		if rows, err = DB.Query(`select body from profile where body->'id' ? $1`, id); err != nil {
			panic(err)
		}
	}

	var body string
	for rows.Next() {
		if err := rows.Scan(&body); err != nil {
			panic(err)
		}
	}

	if body == "" {
		return nil
	}

	profile := &Profile{}
	if err := json.Unmarshal([]byte(body), profile); err != nil {
		panic(err)
	}
	return profile
}

func (user *User) close() {
	defer func() {
		if err := recover(); err != nil {
			log.Error("multi login, close last conn.", err)
		}
	}()
	user.conn.Close()
}

func (user *User) onMessage(message []byte) {

	defer func() {
		if err := recover(); err != nil {
			log.Error(err)
			log.Error(string(debug.Stack()))
			user.sendMessage(user.id, getResponseMsg(500))
		}
	}()

	dialogue := &Dialogue{}
	if err := json.Unmarshal(message, dialogue); err != nil {
		panic(err)
	}

	if dialogue.ToFriend == "" {
		user.sendMessage(user.id, getResponseMsg(510))
		return
	}

	if dialogue.Payload == "" {
		user.sendMessage(user.id, getResponseMsg(511))
		return
	}

	if _, ok := user.friends[dialogue.ToFriend]; !ok {
		user.sendMessage(user.id, getResponseMsg(512))
		return
	}

	if dialogue.Id == "" {
		user.sendMessage(user.id, getResponseMsg(506))
		return
	}

	if friend, ok := pool[dialogue.ToFriend]; ok {
		go func() {
			responseMsg := make(map[string]interface{})
			responseMsg["id"] = dialogue.Id

			okCode := code.CodeDeclare[200]
			badCode := code.CodeDeclare[507]

			if err := friend.sendMessage(dialogue.ToFriend, dialogue.Payload); err != nil {
				log.Error(err)
				responseMsg["code"] = badCode.Code
				responseMsg["message"] = badCode.Message
				responseMsg["ok"] = badCode.Ok
			} else {
				responseMsg["code"] = okCode.Code
				responseMsg["message"] = okCode.Message
				responseMsg["ok"] = okCode.Ok
			}
			response, err := json.Marshal(responseMsg)
			if err != nil {
				panic(err)
			}
			user.sendMessage(user.id, string(response))
		}()
	} else {
		responseMsg := make(map[string]interface{})
		badCode := code.CodeDeclare[508]
		responseMsg["id"] = dialogue.Id
		responseMsg["code"] = badCode.Code
		responseMsg["message"] = badCode.Message
		responseMsg["ok"] = badCode.Ok

		response, err := json.Marshal(responseMsg)
		if err != nil {
			panic(err)
		}
		user.sendMessage(user.id, string(response))
	}

}

func (user *User) sendMessage(toFriend, message string) (Err error) {

	if toFriend == user.id {
		if Err = user.conn.WriteMessage(websocket.TextMessage, []byte(message)); Err != nil {
			log.Error(Err)
		}
	} else {
		dialogue := &Dialogue{
			From:    user.id,
			Payload: message,
		}

		data, err := json.Marshal(dialogue)
		if err != nil {
			Err = err
			log.Error(err)
			return
		}

		if Err = pool[toFriend].conn.WriteMessage(websocket.TextMessage, data); Err != nil {
			log.Error(Err)
		}
	}

	return
}

func getResponseMsg(status int) string {

	if declare, ok := code.CodeDeclare[status]; ok {
		if msg, err := json.Marshal(declare); err != nil {
			panic(err)
		} else {
			return string(msg)
		}
	} else {
		if msg, err := json.Marshal(code.CodeDeclare[500]); err != nil {
			panic(err)
		} else {
			return string(msg)
		}
	}
}

func generateID(randoMsg string) string {

	md5Ctx := md5.New()
	md5Ctx.Write([]byte(randoMsg))
	return hex.EncodeToString(md5Ctx.Sum(nil))
}

func foundFriendHandle(w http.ResponseWriter, req *http.Request) {

	defer func() {
		if err := recover(); err != nil {
			log.Error(err)
			log.Error(string(debug.Stack()))
			io.WriteString(w, getResponseMsg(500))
		}
	}()

	if err := req.ParseForm(); err != nil {
		panic(err)
	}

	token := strings.TrimSpace(req.FormValue("token"))
	if token == "" {
		io.WriteString(w, getResponseMsg(514))
		return
	}

	id := strings.TrimSpace(req.FormValue("id"))
	if id == "" {
		io.WriteString(w, getResponseMsg(517))
		return
	}

	if userId, ok := auth[token]; !ok || userId != id {
		io.WriteString(w, getResponseMsg(515))
		return
	}

	name := strings.TrimSpace(req.FormValue("name"))
	if name == "" {
		io.WriteString(w, getResponseMsg(516))
		return
	}

	rows, err := DB.Query(`select body from profile where body-> 'name' ? $1`, name)
	if err != nil {
		panic(err)
	}

	var profiles []ProfileShow

	for rows.Next() {

		var body []byte
		if err := rows.Scan(&body); err != nil {
			panic(err)
		}
		each := &ProfileShow{}
		if err := json.Unmarshal(body, each); err != nil {
			panic(err)
		}
		profiles = append(profiles, *each)
	}

	responseMsg := make(map[string]interface{})
	okCode := code.CodeDeclare[200]
	responseMsg["code"] = okCode.Code
	responseMsg["message"] = okCode.Message
	responseMsg["ok"] = okCode.Ok
	responseMsg["found"] = profiles

	response, err := json.Marshal(responseMsg)
	if err != nil {
		panic(err)
	}

	io.WriteString(w, string(response))
}

func requestFriendHandle(w http.ResponseWriter, req *http.Request) {

	defer func() {
		if err := recover(); err != nil {
			log.Error(err)
			log.Error(string(debug.Stack()))
			io.WriteString(w, getResponseMsg(500))
		}
	}()

	if err := req.ParseForm(); err != nil {
		panic(err)
	}

	token := strings.TrimSpace(req.FormValue("token"))
	if token == "" {
		io.WriteString(w, getResponseMsg(514))
		return
	}

	id := strings.TrimSpace(req.FormValue("id"))
	if id == "" {
		io.WriteString(w, getResponseMsg(517))
		return
	}

	if userId, ok := auth[token]; !ok || userId != id {
		io.WriteString(w, getResponseMsg(515))
		return
	}

	to := strings.TrimSpace(req.FormValue("to"))
	if to == "" {
		io.WriteString(w, getResponseMsg(519))
		return
	}

	user, ok := pool[id]
	if !ok {
		panic("get user from pool, found nothing")
	}

	if user.friends != nil {
		if _, ok = user.friends[to]; ok {
			io.WriteString(w, getResponseMsg(522))
			return
		}
	}

	if !friendExists(to) {
		io.WriteString(w, getResponseMsg(523))
		return
	}

	note := strings.TrimSpace(req.FormValue("note"))
	var name string
	if err := DB.QueryRow(`select body->> 'name' from profile where body-> 'id' ? $1`, id).Scan(&name); err != nil {
		panic(err)
	}

	if friend, ok := pool[to]; !ok { //offline
		var rows int
		if err := DB.QueryRow(`select count(1) from request where body->'id' ? $1 and body->'to' ? $2`, id, to).Scan(&rows); err != nil {
			panic(err)
		}

		if rows == 0 {
			tx, err := DB.Begin()
			if err != nil {
				panic(err)
			}

			defer func() {
				if err := recover(); err != nil {
					log.Error(err)
					log.Error(string(debug.Stack()))
					io.WriteString(w, getResponseMsg(500))
					tx.Rollback()
				} else {
					tx.Commit()
				}
			}()

			request := &Request{
				Id:   id,
				Name: name,
				To:   to,
				Note: note,
			}

			body, err := json.Marshal(request)
			if err != nil {
				panic(err)
			}

			if _, err := tx.Exec(`insert into request (body) values ($1)`, string(body)); err != nil {
				panic(err)
			}

		}
	} else { //online
		request := &Request{
			Id:   id,
			Name: name,
			Note: note,
		}

		reqCode := code.CodeDeclare[520]
		requestMsg := make(map[string]interface{})
		requestMsg["code"] = reqCode.Code
		requestMsg["message"] = reqCode.Message
		requestMsg["ok"] = reqCode.Ok
		requestMsg["request"] = request

		requestBody, err := json.Marshal(requestMsg)
		if err != nil {
			panic(err)
		}

		if err := friend.sendMessage(friend.id, string(requestBody)); err != nil {
			log.Error(err)
			io.WriteString(w, getResponseMsg(507))
			return
		}
	}

	io.WriteString(w, getResponseMsg(200))
}

func addFriendHandle(w http.ResponseWriter, req *http.Request) {

	defer func() {
		if err := recover(); err != nil {
			log.Error(err)
			log.Error(string(debug.Stack()))
			io.WriteString(w, getResponseMsg(500))
		}
	}()

	if err := req.ParseForm(); err != nil {
		panic(err)
	}

	token := strings.TrimSpace(req.FormValue("token"))
	if token == "" {
		io.WriteString(w, getResponseMsg(514))
		return
	}

	id := strings.TrimSpace(req.FormValue("id"))
	if id == "" {
		io.WriteString(w, getResponseMsg(517))
		return
	}

	if userId, ok := auth[token]; !ok || userId != id {
		io.WriteString(w, getResponseMsg(515))
		return
	}

	from := strings.TrimSpace(req.FormValue("from"))
	if from == "" {
		io.WriteString(w, getResponseMsg(519))
		return
	}

	name := strings.TrimSpace(req.FormValue("name"))
	if name == "" {
		io.WriteString(w, getResponseMsg(521))
		return
	}

	user, ok := pool[id]
	if !ok {
		panic("get user from pool, found nothing")
	}

	if user.friends != nil {
		if _, ok = user.friends[from]; ok {
			io.WriteString(w, getResponseMsg(522))
			return
		}
	}

	if !friendExists(from) {
		io.WriteString(w, getResponseMsg(523))
		return
	}

	tx, err := DB.Begin()
	if err != nil {
		panic(err)
	}

	defer func() {
		if err := recover(); err != nil {
			log.Error(err)
			log.Error(string(debug.Stack()))
			io.WriteString(w, getResponseMsg(500))
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	where := make(map[string]string)
	where[from] = name
	friend, err := json.Marshal(&where)
	if err != nil {
		panic(err)
	}

	if _, err := tx.Exec(`update profile set body = jsonb_set(body, '{friends}', body->'friends' || $1::jsonb) where body->'id' ? $2`, string(friend), id); err != nil {
		panic(err)
	}

	if _, err := tx.Exec(`delete from request where body->'id' ? $1 and body->'to' ? $2`, id, from); err != nil {
		panic(err)
	}

	if user.friends == nil {
		user.friends = make(map[string]string)
	}
	user.friends[from] = name

	io.WriteString(w, getResponseMsg(200))
}

func removeFriendHandle(w http.ResponseWriter, req *http.Request) {

	defer func() {
		if err := recover(); err != nil {
			log.Error(err)
			log.Error(string(debug.Stack()))
			io.WriteString(w, getResponseMsg(500))
		}
	}()

	if err := req.ParseForm(); err != nil {
		panic(err)
	}

	token := strings.TrimSpace(req.FormValue("token"))
	if token == "" {
		io.WriteString(w, getResponseMsg(514))
		return
	}

	id := strings.TrimSpace(req.FormValue("id"))
	if id == "" {
		io.WriteString(w, getResponseMsg(517))
		return
	}

	if userId, ok := auth[token]; !ok || userId != id {
		io.WriteString(w, getResponseMsg(515))
		return
	}

	to := strings.TrimSpace(req.FormValue("to"))
	if to == "" {
		io.WriteString(w, getResponseMsg(519))
		return
	}

	user, ok := pool[id]
	if !ok {
		panic("get user from pool, found nothing")
	}

	if user.friends != nil {
		if _, ok = user.friends[to]; !ok {
			io.WriteString(w, getResponseMsg(512))
			return
		}
	}

	tx, err := DB.Begin()
	if err != nil {
		panic(err)
	}

	defer func() {
		if err := recover(); err != nil {
			log.Error(err)
			log.Error(string(debug.Stack()))
			tx.Rollback()
			io.WriteString(w, getResponseMsg(500))
		} else {
			tx.Commit()
		}
	}()

	if _, err := tx.Exec(`update profile set body = jsonb_set(body, '{friends}', to_jsonb(body->'friends') - $1) where body->'id' ? $2`, to, id); err != nil {
		panic(err)
	}

	if user.friends != nil {
		delete(user.friends, to)
	}

	io.WriteString(w, getResponseMsg(200))
}

func friendExists(id string) bool {

	var rows int

	if err := DB.QueryRow(`select count(1) from profile where body->'id' ? $1`, id).Scan(&rows); err != nil {
		panic(err)
	}

	if rows == 0 {
		return false
	} else {
		return true
	}
}
