import './App.css';
import { io } from 'socket.io-client';
import logo from './assets/chat.png';
import { useEffect, useRef, useState } from 'react';

import CreateUser from './components/CreateUser'
import OnlineUser from './components/OnlineUser';
import MessagesControl from './components/MessagesControl';


const socket = io(`https://ams0503-demo.herokuapp.com/`)

function App () {

    const [username, setUserName] = useState('no user') // lưu user tại client
    const [step, setStep] = useState(0)     // chuyển trang
    const [receiver, setReceiver] = useState("") //Store người nhận
    const [media, setMedia] = useState(null)
    const [avatar, setAvatar] = useState("")
    const [users, setUsers] = useState({}) //Store users trả về từ server
    const [message, setMessage] = useState("") // Store message
    const [groupMessage, setGroupMessage] = useState({})
    const receiverRef = useRef(null)


    const sortNames = (username1, username2) => {
        return [username1, username2].sort().join("-")
    }

    //🔥 Luư lại receiver
    const onUserSelect = (username) => {
        setReceiver(username)

        //Set the mutable username lastest value
        receiverRef.current = username
        setStep((prevStep) => prevStep + 1)
    }

    /* 🔔🔔🔔 Hanlder events component CreateUser.js 🔔🔔🔔*/
    // 🔥 Submit User
    const onCreateUser = () => {

        // Nhập username
        // Khởi tạo thông tin user: username, avatar,meida,...
        // 📤 'new_user' về server.js
        socket.emit("new_user", username)
        const a = Math.floor(Math.random() * 12) + '.png'
        setAvatar(a)

        //Tăng step lên 1 để chuyển trang
        setStep((prevStep) => prevStep + 1)  // Render again lần 1

    }

    const onChatClose = () => {
        receiverRef.current = ''
        // setReceiver('')
        setStep(1)
    }

    /* 🔔🔔🔔 Hanlder Event of Component MessagesControl.js 🔔🔔🔔*/
    const submitMessageByKeyboardEnter = (event) => {
        if (event.which === 13) {
            const data = {
                sender: username, //người gửi
                message,   //message
                receiver, //người nhận
                media,
                avatar,
                view: false
            }

            //🚀 event có name 'send_message' + data tới server
            socket.emit("send_message", data)

            const key = sortNames(username, receiver); //2 user nào đang gửi message // vd: son - tuan
            const tempGroupMessage = { ...groupMessage }
            //Lưu lại  mảng message của người gửi
            if (key in tempGroupMessage) {
                tempGroupMessage[key] = [...tempGroupMessage[key], { ...data, view: true }]
            } else {
                tempGroupMessage[key] = [{ ...data, view: true }]
            }

            setGroupMessage({ ...tempGroupMessage });
            // console.log('groupMessage of ', username, ' : ', groupMessage)
            setMessage('')

            // if (media !== null) {
            //     setMedia(null)
            // }
        }
    }

    const sendMessage = (event) => {
        event.preventDefault();
        console.log(event.target)
        //Custom data message gửi về server
        const data = {
            sender: username, //người gửi
            message,   //message
            receiver, //người nhận
            media,
            avatar,
            view: false
        }

        console.log('nhan enter')
        //🚀 event có name 'send_message' + data tới server
        socket.emit("send_message", data)

        const key = sortNames(username, receiver); //2 user nào đang gửi message // vd: son - tuan
        const tempGroupMessage = { ...groupMessage }
        //Lưu lại  mảng message của người gửi
        if (key in tempGroupMessage) {
            tempGroupMessage[key] = [...tempGroupMessage[key], { ...data, view: true }]
        } else {
            tempGroupMessage[key] = [{ ...data, view: true }]
        }

        setGroupMessage({ ...tempGroupMessage });
        // console.log('groupMessage of ', username, ' : ', groupMessage)
        setMessage('')

        if (media !== null) {
            setMedia(null)
        }


    }

    const onChange = (e) => {
        setUserName(e.target.value)
    }

    const checkUnseenMessages = (receiver) => {
        // console.log('checkUnseenMEssage')
        const key = sortNames(username, receiver);
        let unseendMessages = []
        if (key in groupMessage) {
            unseendMessages = groupMessage[key].filter(msg => !msg.view)
        }
        return unseendMessages.length
    }

    // console.log('groupMessage: ', groupMessage)
    useEffect(() => {

        /* 🔔 Lắng nghe các sự kiện từ SERVER trả về  ⏬*/

        //✅ 'all_users 👩‍👩‍👦‍👦 ' từ server trả về
        socket.on("all_users", (users) => { // Nhạn lại user bằng func
            // alert('goi lai')
            setUsers(users) // Render again users lần 2
        })

        // ✅ Nhận message trả về
        // nhưng chỉ những user nào có ID mà server chỉ định thì mới nhận được
        socket.on("new_message", (data) => {

            console.log('%cMessage nhận về: ', 'color:green', data)
            setGroupMessage((prevGroupMessage) => {
                const messages = { ...prevGroupMessage };
                const key = sortNames(data.sender, data.receiver);

                if (receiverRef.current === data.sender) {
                    data.view = true
                }

                if (key in messages) {
                    messages[key] = [...messages[key], data];
                } else {
                    messages[key] = [data];
                };
                return { ...messages };
            })
        })
    }, [])

    useEffect(() => {
        // console.log('goi lai')
        updateMessageView()
    }, [receiver])
    const updateMessageView = () => {
        const key = sortNames(username, receiver)
        if (key in groupMessage) {
            const messages = groupMessage[key].map((msg) => !msg.view ? { ...msg, view: true } : msg);

            groupMessage[key] = [...messages]
            setGroupMessage({ ...groupMessage })

        }
    }
    return (
        <div className="App">
            <header className="app-header">
                <img src={logo} />
                <div className="app-name b-500 primaryColor">My Chat</div>
            </header>

            <div className="chat-system">
                <div className="chat-box">
                    {/* STEP 1: Tạo user name
                        - Nhập user name
                        - Submit form tạo user
                    */}

                    {step === 0 ? (<CreateUser onCreateUser={onCreateUser} onChange={onChange} value={username} />) : null}

                    {/* STEP 2: Hiện tất cả các users đang online
                        - Attribute:
                            + users: list users từ server
                            + username: tài khoản cá nhân
                        -Event
                            + onUserSelect: lưu lại receiver
                    */}
                    {step === 1 ? (<OnlineUser onUserSelect={onUserSelect} users={users} username={username} checkUnseenMessages={checkUnseenMessages} />) : null}

                    {/*
                    STEP 3: Chuyển user đã select vào room chat
                    - Handle Event:
                        + sendMessage
                        + onChange: Lưu message ngay tại client
                    */}
                    {step === 2 ? (<MessagesControl
                        sendMessage={sendMessage}
                        value={message}
                        onChange={(event) => { setMessage(event.target.value) }}
                        onKeyUp={submitMessageByKeyboardEnter}
                        groupMessage={groupMessage}
                        sortNames={sortNames}
                        username={username}
                        receiver={receiver}
                        setMedia={setMedia}
                        media={media}
                        onChatClose={onChatClose}
                    />) : null}
                </div>
            </div>
        </div>
    );
}

export default App;
