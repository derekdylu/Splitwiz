import React, {useState} from 'react'
import { 
  Checkbox,
  List,
  Radio,
  Input,
  Button,
  Select,
  Collapse
} from 'antd';

import AddEntry from '../../Components/AddEntry'

const data = [
  {
    "name": "apple",
    "value": 1200,
    "payer": "Andrea",
    "shares": {
      "Andrea": 400,
      "Bella": 400,
      "Derek": 400,
      "Ella": 0
    }
  },
  {
    "name": "banana",
    "value": 800,
    "payer": "Bella",
    "shares": {
      "Andrea": 0,
      "Bella": 400,
      "Derek": 400,
      "Ella": 0
    }
  },
  {
    "name": "cherry",
    "value": 600,
    "payer": "Derek",
    "shares": {
      "Andrea": 0,
      "Bella": 0,
      "Derek": 400,
      "Ella": 200
    }
  },
  {
    "name": "durian",
    "value": 400,
    "payer": "Ella",
    "shares": {
      "Andrea": 0,
      "Bella": 0,
      "Derek": 0,
      "Ella": 400
    }
  }
]

const Event = () => {
  const [openAdding, setOpenAdding] = useState(false)

  return (
    <>
      <h1>Event</h1>
      <Button>複製連結</Button>
      <Button>結算</Button>
      <Button onClick={() => setOpenAdding(!openAdding)}>新增帳目</Button>
      {
        openAdding && <AddEntry />
      }
      <List
        bordered
        dataSource={data}
        renderItem={(item, i) => (
          <List.Item>
            {item.name}
            <Button>編輯</Button>
            <Button danger>刪除</Button>
            <Collapse>
              <Collapse.Panel header={item.payer + "先付" + item.value + "元"}>
                <List
                  bordered
                  dataSource={Object.keys(item.shares)}
                  renderItem={(member) => (
                    <List.Item>
                      {member} 分擔 {item.shares[member]} 元
                    </List.Item>
                  )}
                />
              </Collapse.Panel>
            </Collapse>
          </List.Item>
        )}
      />
    </>
  )
}

export default Event