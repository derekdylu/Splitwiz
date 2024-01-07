import React from 'react'
import { 
  Modal,
  Divider
} from 'antd';

const Info = (props) => {
  return (
    <Modal title="How2split" open={props.openModal} onCancel={props.closeModal} footer={null}>
      1. 輸入成員並建立活動
      2. 記住並分享活動連結
      3. 開始記帳！
      ⚠️ 所有擁有連結的人都可以編輯活動內容，請勿分享連結給不認識的人。
      <Divider />
      How2split 是一款極輕量化線上帳目分攤工具，無需下載應用程式、無需註冊帳號，只要建立活動然後記住並分享連結，即可立即開始使用。
      <Divider />
      此工具由 <u><a href="https://derekdylu.com" target="_blank" rel="noreferrer">derekdylu</a></u> 設計與開發，概念取自 When2meet 的輕量化設計，一切從簡，僅保留核心功能，希望可以讓帳目分攤更加便捷。若您有任何建議與回饋，請不吝填寫 <u><a href="https://forms.gle/sXuG5QWCHrvB9G628" target="_blank" rel="noreferrer">本表單</a></u>！
    </Modal>
  )
}

export default Info