import React from 'react'
import { 
  Modal
} from 'antd';

const contents = [
  "1. 輸入成員並建立活動",
  "2. 記住並分享活動連結",
  "3. 開始記帳！",
  "4. 點擊帳目可以查看詳細資訊！",
  "⚠️ 所有擁有連結的人都可以編輯活動內容，請勿分享連結給不認識的人。"
]

const Info = (props) => {
  return (
    <Modal title="How2split" open={props.openModal} onCancel={props.closeModal} footer={null}>
    <div className="flex flex-col pt-2 gap-4 items-start">
      {
        contents.map((c, i) => (
          <div key={i}>{c}</div>
        ))
      }
    </div>
    </Modal>
  )
}

export default Info