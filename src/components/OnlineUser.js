import React from 'react'

/**
* @author
* @function OnlineUser
**/

const OnlineUser = (props) => {

    const { onUserSelect, users, username, checkUnseenMessages } = props
    // console.log('%cComponent OnlineUser.js', 'color:green', users)
    return (
        <div>
            <div className="online-users-header">
                <div style={{ margin: "0 10px" }} >Online Users</div>
            </div>
            <ul className="users-list">
                {users && Object.keys(users).map((user, index) => (
                    <>
                        {/* Hiện các user đang online
                            Server trả về list user, nhưng sẽ hiện tất cả user
                            có trong list ngoại trừ chính mình
                            username: chính mình đang đăng nhập
                        */}

                        {user !== username ? (

                            <li key={Math.random().toString(36).substr(2, 9)} onClick={() => onUserSelect(user)} >
                                <span style={{ textTransform: "capitalize" }} >{user}</span>
                                {
                                    checkUnseenMessages(user) !== 0 ? (
                                        <span className="new-message-count" >{checkUnseenMessages(user)}</span>
                                    ) : null
                                }
                            </li>
                        ) : null}
                    </>
                ))}


            </ul>
        </div>
    )

}

export default OnlineUser