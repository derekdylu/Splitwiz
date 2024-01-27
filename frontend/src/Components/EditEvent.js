import React, {useState} from 'react'
import {
  List,
  Input,
  Button,
  Modal,
  Space,
  message
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const serverUrl = process.env.REACT_APP_SERVER_URL

const EditEvent = (props) => {
  const [eventName, setEventName] = useState(props.data.name)
  const [eventAccounts, setEventAccounts] = useState(props.data.accounts)
  const [eventLocked, setEventLocked] = useState(props.data.locked) // eslint-disable-line
  const [eventPassword, setEventPassword] = useState(props.data.password) // eslint-disable-line
  const [loading, setLoading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage();
  const [inputMember, setInputMember] = useState("")
  const [originalAccounts, setOriginalAccounts] = useState(props.data.accounts) // eslint-disable-line

  const error = () => {
    messageApi.open({
      type: 'error',
      content: '成員名稱重複',
    });
  };

  const addMember = () => {
    // check duplicates
    if (eventAccounts.includes(inputMember)) {
      error()
      return
    }
    setEventAccounts([...eventAccounts, inputMember])
    setInputMember("")
  }

  // remove a temporary member
  const removeMember = (name) => {
    setEventAccounts(eventAccounts.filter(member => member !== name))
  }

  const submitEvent = async () => {
    setLoading(true);
    const eventData = {
      name: eventName,
      accounts: eventAccounts,
      locked: eventLocked,
      password: eventPassword
    }
    try {
      const response = await fetch(`${serverUrl}/events/${props.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      props.closeModal();
      window.location.href = `/events/${data._id}`
    } catch (error) {
      console.error("Could not post event:", error);
      props.closeModal();
    }
  }

  return (
    <>
    {contextHolder}
    <Modal open={props.openModal} onCancel={props.closeModal} footer={null}>
    <div className="flex flex-col items-center gap-4">
      <div className="font-bold">編輯活動</div>
      <Input placeholder="活動名稱" value={eventName} onChange={(e) => setEventName(e.target.value)} style={{ width: 276}} />
      <Space wrap style={{ width: 276 }}>
        <Input placeholder="成員名稱" value={inputMember} onChange={(e) => setInputMember(e.target.value)}/>
        <Button onClick={() => addMember()} disabled={!inputMember}>新增成員</Button>
      </Space>
      <List
        bordered
        dataSource={eventAccounts}
        style={{ width: 276}}
        renderItem={(member) => (
          <List.Item actions={[<Button disabled={originalAccounts.find(x => x === member)} danger icon={<DeleteOutlined />} onClick={() => removeMember(member)} />]}>
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
      <div className="text-xs text-gray-700">
        *活動更新後即無法刪除既有成員*
      </div>
      {
        loading ?
        <Button loading>更新活動</Button>
        :
        <Button disabled={!eventName || eventAccounts.length === 0 || (eventLocked && eventPassword === "")} onClick={() => submitEvent()}>更新活動</Button>
      }
    </div>
    </Modal>
    </>
  )
}

export default EditEvent