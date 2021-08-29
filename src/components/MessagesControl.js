import React from 'react'
import sendIcon from '../assets/send.png';
import attachment from '../assets/paper-clip.png';
import cancel from "../assets/cancel.png";
import ScrollableFeed from 'react-scrollable-feed'
import image from '../assets/image.png'
/**
* @author
* @function MessagesControl
**/

const MessagesControl = (props) => {
    const {
        sendMessage,
        value,
        onChange,
        onKeyUp,
        groupMessage,
        sortNames,
        username,
        receiver,
        setMedia,
        media,
        onChatClose
    } = props;
    console.log('GROUP_MESSAGE:', groupMessage)
    console.log('MEDIA: ', media)

    const messages = groupMessage ? groupMessage[sortNames(username, receiver)] : []

    return (
        // Display messages
        <div>
            <div>
                <div className="online-users-header">
                    <div style={{ margin: "0 10px", textTransform: "capitalize" }} >{receiver}</div>
                    <div style={{ margin: "0 10px", cursor: "pointer" }}>
                        <img onClick={onChatClose} width={15} src={cancel} alt="close" />
                    </div>
                </div>

                <div className="message-area">
                    <ul>
                        <ScrollableFeed>
                            {
                                messages && messages.length > 0 ? messages.map((msg, index) => (
                                    <li style={{
                                        flexDirection: username === msg.receiver ? 'row' : 'row-reverse'
                                    }} key={index}>

                                        {/* AVATAR */}
                                        <div className='user-pic'>
                                            <img src={require(`../users/${msg.avatar}`).default} />
                                        </div>

                                        {/* MESSAGE */}
                                        <div>
                                            {msg.media && msg.media.image ? (
                                                <div className="image-container" >
                                                    <img src={msg.media.content} />
                                                </div>
                                            ) : null}

                                            {msg.message !== "" ? (
                                                <div className="message-text">{msg.message}</div>
                                            ) : null}
                                        </div>
                                        {/* <div className="message-text">{msg.message}</div> */}

                                    </li>
                                )) : null
                            }
                        </ScrollableFeed>
                    </ul>
                </div>
            </div>

            {/* Form send message */}
            {/* Gán sự kiện onSubmit = {sendMessage} */}
            {/* {media ? (<div >
                <img src={media.content} width={50} height={50} />
                <span>{media.name}</span>
            </div>) : null} */}

            <div>
                {media !== null ? (<div className="attachement-display" >
                    <img src={media.content} width={50} height={50} alt={media.name} />
                    <span className="attachment-name">{media.name}</span>
                    <span className="remove-attachment">X</span>
                </div>) : null}


                <form onSubmit={sendMessage} className="message-control" >
                    <textarea value={value} onChange={onChange} onKeyUp={onKeyUp} placeholder="Type something..." ></textarea>
                    <div className="file-input-container">
                        <input type="file"
                            onChange={(e) => {
                                const file = e.target.files[0]
                                const reader = new FileReader();

                                reader.onloadend = function () {
                                    setMedia({
                                        image: true,
                                        content: reader.result,
                                        name: file.name
                                    })
                                }
                                reader.readAsDataURL(e.target.files[0]);

                                reader.onerror = function (error) {
                                    console.log(error)
                                }
                            }}
                            id="hidden-file" />
                        <label htmlFor="hidden-file">
                            <img src={attachment} alt={"hihi"} width="20" />
                        </label>
                    </div>
                    <button>
                        <img src={sendIcon} />
                        <span style={{ display: 'inline-block' }} >Send</span>
                    </button>
                </form>
            </div>


        </div>
    )

}

export default MessagesControl