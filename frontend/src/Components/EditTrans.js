import React, {useState} from 'react'
import { 
  Input,
  Button,
  Select,
  Modal
} from 'antd';

const serverUrl = process.env.REACT_APP_SERVER_URL

const EditTrans = (props) => {
  const [entryValue, setEntryValue] = useState(props.data.value)
  const [payer, setPayer] = useState(props.data.payer)
  const [receiver, setReceiver] = useState(props.data.receiver)
  const [entryValueError, setEntryValueError] = useState(false)
  const [loading, setLoading] = useState(false)

  const updateEntryValue = (e) => {
    // check if the value is number
    if (isNaN(e.target.value) || e.target.value < 0) {
      setEntryValueError(true)
      return
    } else {
      setEntryValueError(false)
    }
    setEntryValue(e.target.value)
  }

  const handleChangeSelectPayer = (value) => {
    setPayer(value)
  };

  const handleChangeSelectReceiver = (value) => {
    setReceiver(value)
  };

  const checkValidity = () => {
    return !entryValueError && entryValue && payer && receiver && payer !== receiver
  }

  const submitEntry = async () => {
    setLoading(true)
    const transactionData = {
      eventId: props.id,
      // timestamp: Date.now(),
      type: "transfer",
      value: Number(entryValue),
      payer: payer,
      receiver: receiver
    }
    try {
      const response = await fetch(`${serverUrl}/transactions/${props.transactionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      props.confirmMessage()
      props.closeModal()
    } catch (error) {
      console.error('Error updating transaction:', error);
      props.closeModal()
    }
  }
  
  return (
    <Modal open={props.openModal} onCancel={props.closeModal} footer={null}>
    <div className="flex flex-col px-4 gap-4 items-center">
      <div className="font-bold">編輯轉帳</div>
      <div className="flex flex-row items-center justify-between w-full">
        付款人
        <Select
          placeholder="付款人"
          style={{ width: 220 }}
          value={payer}
          onChange={handleChangeSelectPayer}
          options={props.accounts.map(a => ({value: a, label: a}))}
        />
      </div>
      <div className="flex flex-row items-center justify-between w-full">
        金額
        <Input status={entryValueError && "error"} placeholder="帳目金額" value={entryValue} onChange={(e) => updateEntryValue(e)} style={{ width: 220 }} />
      </div>
      <div className="flex flex-row items-center justify-between w-full">
        收款人
        <Select
          placeholder="收款人"
          style={{ width: 220 }}
          value={receiver}
          onChange={handleChangeSelectReceiver}
          options={props.accounts.map(a => ({value: a, label: a}))}
        />
      </div>
      <div className="flex flex-col w-full mt-2 items-center">
      {
        loading ?
        <Button loading>儲存</Button>
        :
        <Button type="primary" disabled={!checkValidity()} onClick={() => submitEntry()}>儲存</Button>
      }
      </div>
    </div>
    </Modal>
  )
}

export default EditTrans