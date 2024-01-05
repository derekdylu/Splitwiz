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
  Switch,
  Modal,
  Radio,
  Checkbox
} from 'antd';

const data = [
  'name', 'value'
]

const const_members = [
  {
    "name": "andrea",
    "share": 0
  },
  {
    "name": "derek",
    "share": 0
  },
  {
    "name": "jason",
    "share": 0
  }
]

const Event = () => {
  let members = const_members

  const [entryName, setEntryName] = useState("");
  const [entryValue, setEntryValue] = useState(0);
  const [sharedValue, setSharedValue] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [radioValue, setRadioValue] = useState(0); // 1: 平均分攤, 2: 指定費用, 3: 指定比例
  const [checkedList, setCheckedList] = useState(members);

  const checkAll = members.length === checkedList.length;
  const indeterminate = checkedList.length > 0 && checkedList.length < members.length;

  const onCheckChange = (e, item) => {
    calculateShare()
    if (e.target.checked) {
      setCheckedList([...checkedList, item]);
    } else {
      setCheckedList(checkedList.filter(x => x !== item));
    }
    for (let member of members) {
      if (!checkedList.find(x => x === member)) {
        member.share = 0
      }
    }
  }

  const onCheckAllChange = (e) => {
    calculateShare()
    setCheckedList(e.target.checked ? members : []);
  }

  const calculateShare = () => {
    if (radioValue === 1) {
      for (let member of members) {
        member.share = entryValue / checkedList.length
        setSharedValue(0)
      }
    }
    if (radioValue === 2 || radioValue === 3) {
      for (let member of members) {
        member.share = 0
      }
    }
  }

  const onRadioChange = (e) => {
    setRadioValue(e.target.value);
    calculateShare();
  }

  const showModal = () => {
    setIsModalOpen(true);
  }

  const handleClose = () => {
    setIsModalOpen(false);
  }

  return (
    <>
      <Modal title="Some entry" open={isModalOpen} onCancel={handleClose} footer={null}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
      <Space warp>
        <Button>結算</Button>
        <Button onClick={() => setIsAdding(!isAdding)}>新增帳目</Button>
      </Space>
      {
        isAdding &&
        <>
          <Input placeholder="帳目名稱" value={entryName} onChange={(e) => setEntryName(e.target.value)} />
          <Input placeholder="帳目金額" value={entryValue} onChange={(e) => {setEntryValue(e.target.value); calculateShare(e.target.value);}}/>
          付款人
          <Select
            defaultValue="lucy"
            style={{ width: 120 }}
            // onChange={handleChange}
            options={members.map(member => ({ value: member.name, label: member.name }))}
          />
          <Radio.Group onChange={onRadioChange} value={radioValue}>
            <Radio value={1}>平均分攤</Radio>
            <Radio value={2}>指定費用</Radio>
            <Radio value={3}>指定比例</Radio>
          </Radio.Group>
          分攤人
          <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
            Check all
          </Checkbox>
          <List
            bordered
            dataSource={members}
            renderItem={(item) => (
              <List.Item>
                <Checkbox defaultChecked={true} checked={checkedList.find(m => m.name === item.name)} onChange={(e) => onCheckChange(e, item)}>{item.name}</Checkbox>
                {
                  radioValue === 2 &&
                  <Input placeholder="金額" />
                }
                {
                  radioValue === 3 &&
                  <Input placeholder="比例" />
                }
                {item.share}
              </List.Item>
            )}
          />
          剩餘 {entryValue - sharedValue} 元尚未分攤
          <Button disabled={entryName === "" || entryValue === 0 || radioValue === 0 || sharedValue !== entryValue}>新增</Button>
        </>
      
      }
      <List
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item onClick={() => showModal()}>
            {item}
          </List.Item>
        )}
      />
    </>
  )
}

export default Event