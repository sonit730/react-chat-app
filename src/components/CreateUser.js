import React from 'react'

/**
* @author
* @function CreaterUser
**/

const CreaterUser = (props) => {
    const { onCreateUser, value, onChange } = props
    // console.log('%cComponent CreateUser', 'color: green',)
    return (
        <div className="username-container" >
            <form onSubmit={onCreateUser} style={{ display: "inline-block" }} >
                <h4 className="username-label" >Nhập tên tài khoản</h4>
                <input className="input" onChange={onChange} />
            </form>
        </div>
    )

}

export default CreaterUser