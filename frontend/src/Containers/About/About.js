import React from 'react'

const About = () => {
  return (
    <div className="flex flex-col items-start text-start px-4 gap-4">
      <div>
        關於本站
      </div>
      <div>
        How2split 是一款極輕量化線上帳目分攤工具，無需下載應用程式、無需註冊帳號，只要建立活動然後記住並分享連結，即可立即開始使用。
      </div>
      <div>
        此工具由 <u><a href="https://derekdylu.com" target="_blank" rel="noreferrer">derekdylu</a></u> 設計與開發，概念取自 When2meet 的輕量化設計，一切從簡，僅保留核心功能，希望可以讓帳目分攤更加便捷。若您有任何建議與回饋，請不吝填寫 <u><a href="https://forms.gle/sXuG5QWCHrvB9G628" target="_blank" rel="noreferrer">本表單</a></u>！
      </div>
      <div>
        如果您願意支持我，可以透過 <u><a href="https://www.buymeacoffee.com/derekdylu" target="_blank" rel="noreferrer">Buy Me A Coffee</a></u> 贊助我，感謝您的支持！
      </div>
    </div>
  )
}

export default About