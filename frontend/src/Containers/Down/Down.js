import React from 'react'

const Down = () => {
  return (
    <div className="flex flex-col items-center text-center px-4 gap-12 mt-16">
      <div className="text-5xl font-bold">
        😥💸📉
      </div>
      <div className="text-2xl text-red-700 font-bold">
        暫時下線，敬請見諒！
      </div>
      <div>
        How2split 由於缺乏伺服器營運資金，<br />因此暫時下線。
      </div>
      <div>
        本網址亦將在近期失效，<br />未來請使用 <u><a href="https://how2split.netlify.app/" target="_blank" rel="noreferrer">本連結</a></u>。
      </div>
      <div>
        如果您願意支持我，<br />可以透過 <u><a href="https://www.buymeacoffee.com/derekdylu" target="_blank" rel="noreferrer">Buy Me A Coffee</a></u> 贊助我！
      </div>
    </div>
  )
}

export default Down