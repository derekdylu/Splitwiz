import React, { useState } from 'react'
import { 
  Input,
  Space,
  Button,
  List,
  message,
} from 'antd';

const serverUrl = process.env.REACT_APP_SERVER_URL

const Create = () => {
  const [loading, setLoading] = useState([]);
  const [inputEvent, setInputEvent] = useState("")
  const [inputMember, setInputMember] = useState("")
  const [members, setMembers] = useState([])
  const [messageApi, contextHolder] = message.useMessage();
  const [locked, setLocked] = useState(false) // eslint-disable-line
  const [password, setPassword] = useState("") // eslint-disable-line

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

  async function postEvent(eventData) {
    try {
      const response = await fetch(`${serverUrl}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      window.location.href = `/events/${data._id}`
    } catch (error) {
      console.error("Could not post event:", error);
    }
  }

  const submitEvent = async () => {
    setLoading(true);
    const eventData = {
      name: inputEvent,
      accounts: members,
      locked: locked,
      password: password
    }
    await postEvent(eventData)
    setLoading(false);
  }

  return (
    <>
      {contextHolder}
      <Space direction='vertical'>
        建立活動
        <Input placeholder="活動名稱" onChange={(e) => setInputEvent(e.target.value)}/>
        <Space wrap>
          <Input placeholder="成員名稱" value={inputMember} onChange={(e) => setInputMember(e.target.value)}/>
          <Button onClick={() => addMember()} disabled={!inputMember}>新增成員</Button>
        </Space>
        <List
          bordered
          dataSource={members}
          renderItem={(member) => (
            <List.Item actions={[<Button danger onClick={() => removeMember(member)}>刪除</Button>]}>
              {member}
            </List.Item>
          )}
        />
        {/* <Space warp>
            密碼保護
          <Switch defaultChecked checked={locked} onChange={() => setLocked(!locked)} />
        </Space>
        {
          locked && <Input.Password placeholder="設定密碼" value={password} onChange={(e) => setPassword(e.target.value)}/>
        } */}
        {
          loading ?
          <Button loading>建立活動</Button>
          :
          <Button disabled={!inputEvent || members.length === 0 || (locked && password === "")} onClick={() => submitEvent()}>建立活動</Button>
        }
      </Space>
    </>
  )
}

export default Create