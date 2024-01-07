import React from 'react'

const Header = (props) => {
  return (
    <div className="flex flex-row justify-between bg-black text-white px-4 py-2 mb-4">
      <a href="/" className="font-bold">How2split</a>
      <div onClick={props.openModal} style={{ cursor: "pointer" }}>About</div>
    </div>
  )
}

export default Header