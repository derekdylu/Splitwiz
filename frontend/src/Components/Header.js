import React from 'react'

const Header = (props) => {
  return (
    <div className="flex flex-row justify-between bg-black text-white px-4 py-2 mb-4">
      <a href="/" className="font-bold" style={{ cursor: "pointer" }}>How2split</a>
      <div className="flex flex-row gap-4">
        <a href="/about" style={{ cursor: "pointer" }}>關於</a>
        <div onClick={props.openModal} style={{ cursor: "pointer" }}>說明</div>
      </div>
    </div>
  )
}

export default Header