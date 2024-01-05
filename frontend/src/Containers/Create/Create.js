import React, { useState } from 'react'
import { 
  Input,
  Select,
  Space,
  Button,
  Divider,
  List,
  Typography,
  message,
  Switch
} from 'antd';

const Create = () => {
  const [inputEvent, setInputEvent] = useState("")
  const [inputMember, setInputMember] = useState("")
  const [members, setMembers] = useState([])
  const [messageApi, contextHolder] = message.useMessage();
  const [locked, setLocked] = useState(false)
  const [password, setPassword] = useState("")

  const error = () => {
    messageApi.open({
      type: 'error',
      content: '成員名稱重複',
    });
  };

  const addMember = () => {
    // check duplicates
    if (members.includes(inputMember)) {
      error()
      return
    }
    setMembers([...members, inputMember])
    setInputMember("")
  }

  const removeMember = (name) => {
    setMembers(members.filter(member => member !== name))
  }

  const submitEvent = () => {
    console.log(inputEvent, members, password)
  }

  return (
    <>
      {contextHolder}
      <Space direction='vertical'>
      <Input placeholder="活動名稱" onChange={(e) => setInputEvent(e.target.value)}/>
      <Space wrap>
        <Input placeholder="成員名稱" value={inputMember} onChange={(e) => setInputMember(e.target.value)}/>
        <Button onClick={() => addMember()} disabled={!inputMember}>新增成員</Button>
      </Space>
      <List
        bordered
        dataSource={members}
        renderItem={(member) => (
          <List.Item actions={[<Button danger onClick={() => removeMember(member)}>delete</Button>]}>
            {member}
          </List.Item>
        )}
      />
      <Space warp>
          密碼保護
        <Switch defaultChecked checked={locked} onChange={() => setLocked(!locked)} />
      </Space>
      {
        locked && <Input.Password placeholder="設定密碼" value={password} onChange={(e) => setPassword(e.target.value)}/>
      }
      <Button disabled={!inputEvent || members.length === 0 || (locked && password === "")} onClick={() => submitEvent()}>建立活動</Button>
      </Space>
    </>
  )
}

export default Create