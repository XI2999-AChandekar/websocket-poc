/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
// import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Card, Avatar, Input, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuid } from 'uuid';
import 'antd/dist/antd.css';
import './index.css'
import { setMessageList, setUsersList, setSendMessage, setSendMessageAcknowledgement } from '../store';

const { Search } = Input;
const { Text } = Typography;
const { Meta } = Card;

// const client = new W3CWebSocket('ws://3.7.100.88:7000/ws');
const ws = new WebSocket('ws://3.7.100.88:7000/ws');
const Main = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.message.messageData);
  const ackowledgement = useSelector((state) => state.message.ackowledgement);
  const users = useSelector((state) => state.message.users);
  const [userName, setUserName] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [messages, setMessages] = useState([]);
  console.log(messages, "messagesmessagesmessages");
  // console.log(users, "usersList");
  const onButtonClicked = (value) => {
    const id = uuid();
    dispatch(setSendMessage(
      {
        code: 200,
        from: "You",
        to: userName,
        message: searchVal,
        reqId: id,
        time: "2022-08-10 08:13:19.31513605 +0000 UTC m=+172554.464027781"

      }
    ));
    setSearchVal('');
    ws.send(JSON.stringify({
      action: "message",
      payload: { message: searchVal, to: userName },
      reqId: id,
    }));
  };

  // const setOwnMessage = (code) => {
  //   dispatch(setSendMessage(
  //     {
  //       code: code,
  //       from: userName,
  //       message: searchVal,
  //       time: "2022-08-10 08:13:19.31513605 +0000 UTC m=+172554.464027781"
  //     }
  //   ));
  //   setSearchVal('');
  // };

  const onHandleJoin = (user) => {
    ws.send(JSON.stringify({
      action: "join",
      payload: { name: user },
      reqID: Math.random(),
    }));
  };
  const checkAckowledgement = (reqId) => {
    let found = false;

    if (reqId) {
      ackowledgement.forEach((a) => {
        if (a.reqId === reqId) {
          console.log(a.reqId, reqId, "a.reqId, reqId")
          found = true;
        }
      })
    }
    return found;
  };

  const handleUserWindowChange = (user) => {
    setUserName(user);
  }
  useEffect(() => {
    ws.onopen = function () {
      console.log('WebSocket Client Connected');
    };
    ws.onmessage = function message(message) {
      const dataFromServer = JSON.parse(message.data);
      if (dataFromServer.action === "join" && dataFromServer.payload.code === 200) {
        dispatch(setUsersList(dataFromServer.payload.users));
        setIsLoggedIn(true);
      }
      if (dataFromServer.action === "message" && dataFromServer.payload.code === 200) {
        console.log('got reply! message', dataFromServer);
        dispatch(setSendMessageAcknowledgement(dataFromServer));
      }
      if (dataFromServer.action === "subscribe") {
        dispatch(setMessageList(dataFromServer.payload));
        console.log('got reply! subscribe', dataFromServer);
      }
      if (dataFromServer.action === "users") {
        // console.log('got reply! users', dataFromServer);
        dispatch(setUsersList(dataFromServer.payload.users));
      }
    };
  }, []);

  return (
    <div className="main" id='wrapper'>
      {isLoggedIn ?
        <div>
          <div className="title">
            <Text id="main-heading" type="secondary" style={{ fontSize: '36px' }}> {userName}</Text>
          </div>
          <div style={{ display: "flex", border: "1px solid", height: "700px" }}>
            <div style={{ width: "30%" }}>
              {users.map((user) => {
                return (
                  <div style={{ width: "100%", height: "70px" }}>
                    <Card key={user} style={{ width: "100%", height: "100%", alignSelf: userName === user ? 'flex-end' : 'flex-start' }} loading={false} onClick={() => handleUserWindowChange(user)}>
                      <Meta
                        avatar={
                          <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{user[0].toUpperCase()}</Avatar>
                        }
                        title={user}
                        // description={message.message}
                        style={{ color: "#25d366" }}
                      />
                    </Card>
                    {/* <button style={{ width: "100%", height: "100%" }} onClick={() => handleUserWindowChange(user)}>{user}</button> */}
                  </div>)
              })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 50, width: "100%" }} id="messages">
              {messages[userName]?.map(message => {

                return (
                  <Card key={message.msg} style={{ maxWidth: 550, minWidth: 250, margin: '16px 4px 0 4px', alignSelf: userName === message.from ? 'flex-start' : 'flex-end' }} loading={false}>
                    <Meta
                      title={message.from}
                      description={message.message}
                      style={{ color: "#25d366" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", marginTop: "10px" }}>
                      <div>{new Date(message.time).toLocaleString()}</div>
                      {userName !== message.from && <div> <i class="fa fa-check" aria-hidden="true"></i>
                        {(userName !== message.from && checkAckowledgement(message?.reqId)) && <i class="fa fa-check" aria-hidden="true"></i>}
                        {checkAckowledgement(message?.reqId)}</div>

                      }

                    </div>
                  </Card>)
              }
              )}
            </div>
          </div>
          <div className="bottom">
            <Search
              placeholder="Type a message"
              enterButton="Send"
              value={searchVal}
              size="large"
              onChange={(e) => setSearchVal(e.target.value)}
              onSearch={value => onButtonClicked(value)}
            />
          </div>
        </div >
        :
        <div style={{ padding: '200px 40px' }}>
          <Search
            placeholder="Enter Username"
            enterButton="Join"
            size="large"
            onSearch={(value) => {
              onHandleJoin(value)
            }}
          />
        </div>
      }
    </div >
  );

}
export default Main;
