import React, {useState} from 'react'
import { 
  Input,
  Button,
  Select,
  Modal
} from 'antd';

const serverUrl = process.env.REACT_APP_SERVER_URL

const AddTrans = (props) => {
  const [entryValue, setEntryValue] = useState(0)
  const [payer, setPayer] = useState("")
  const [receiver, setReceiver] = useState("")
  const [entryValueError, setEntryValueError] = useState(false)

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
    const transactionData = {
      eventId: props.id,
      timestamp: Date.now(),
      type: "transfer",
      value: Number(entryValue),
      payer: payer,
      receiver: receiver
    }
    try {
      const response = await fetch(`${serverUrl}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      props.confirmMessage()
      props.closeModal()
    } catch (error) {
      console.error('Error posting transaction:', error);
      props.closeModal()
    }
  }
  
  return (
    <Modal open={props.openModal} onCancel={props.closeModal} footer={null}>
    <div className="flex flex-col px-4 gap-2 items-center">
      <div className="font-bold">新增轉帳</div>
      付款人
      <Select
        placeholder="付款人"
        style={{ width: 120 }}
        onChange={handleChangeSelectPayer}
        options={props.accounts.map(a => ({value: a, label: a}))}
      />
      金額 <Input status={entryValueError && "error"} placeholder="帳目金額" onChange={(e) => updateEntryValue(e)}/>
      收款人
      <Select
        placeholder="收款人"
        style={{ width: 120 }}
        onChange={handleChangeSelectReceiver}
        options={props.accounts.map(a => ({value: a, label: a}))}
      />
      <div className="flex flex-col w-full mt-2 items-center">
        <Button type="primary" disabled={!checkValidity()} onClick={() => submitEntry()}>新增轉帳</Button>
      </div>
    </div>
    </Modal>
  )
}

export default AddTrans