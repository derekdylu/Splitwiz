import React, {useState} from 'react'
import { 
  Checkbox,
  List,
  Radio,
  Input,
  Button,
  Select,
  Modal
} from 'antd';
const CheckboxGroup = Checkbox.Group;

const serverUrl = process.env.REACT_APP_SERVER_URL

const AddEntry = (props) => {
  const [entryName, setEntryName] = useState("")
  const [entryValue, setEntryValue] = useState(0)
  const [shares, setShares] = useState(props.accounts.map(a => 0))
  const [checkedList, setCheckedList] = useState(props.accounts)
  const [valueRadio, setValueRadio] = useState(1)
  const [payer, setPayer] = useState("")
  const [entryValueError, setEntryValueError] = useState(false)
  const [sharesError, setSharesError] = useState(props.accounts.map(x => false))

  const checkAll = props.accounts.length === checkedList.length;
  const indeterminate = checkedList.length > 0 && checkedList.length < props.accounts.length;

  const onChangeRadio = (e) => {
    setValueRadio(e.target.value);
    e.target.value === 1 ?
      setShares(props.accounts.map(account => checkedList.includes(account) ? entryValue / checkedList.length : 0)) // problem
      :
      setShares(props.accounts.map(a => 0))
  };

  const onChangeCheck = (list) => {
    setCheckedList(list);
    if (valueRadio === 1) {
      setShares(props.accounts.map(account => list.includes(account) ? entryValue / list.length : 0)) // problem
    }
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? props.accounts : []);
    if (valueRadio === 1 && e.target.checked) {
      setShares(props.accounts.map(a => entryValue / props.accounts.length))
    }
  };

  const updateEntryValue = (e) => {
    // check if the value is number
    if (isNaN(e.target.value) || e.target.value < 0) {
      setEntryValueError(true)
      return
    } else {
      setEntryValueError(false)
    }
    setEntryValue(e.target.value)
    if (valueRadio === 1) {
      setShares(props.accounts.map(account => checkedList.includes(account) ? e.target.value / checkedList.length : 0)) // problem
    }
  }

  const updateShareValue = (e, i) => {
    // check if the value is number
    if (isNaN(e.target.value) || e.target.value < 0) {
      const newSharesError = [...sharesError]
      newSharesError[i] = true
      setSharesError(newSharesError)
      return
    } else {
      const newSharesError = [...sharesError]
      newSharesError[i] = false
      setSharesError(newSharesError)
    }
    const newShares = [...shares]
    newShares[i] = Number(e.target.value)
    setShares(newShares)
  }

  const handleChangeSelect = (value) => {
    setPayer(value)
  };

  const checkValidity = () => {
    return !entryValueError && entryName && entryValue && payer && ((valueRadio === 1 && checkedList.length > 0) || (valueRadio === 2 && entryValue - shares.reduce((a, b) => a + b, 0) === 0))
  }

  function convertShares(accounts, shares) {
    const sharesMap = new Map();
    accounts.forEach((account, i) => {
      sharesMap.set(account, Number(shares[i]));
    });
    return Object.fromEntries(sharesMap);
  }

  const submitEntry = async () => {
    const transactionData = {
      eventId: props.id,
      timestamp: Date.now(),
      type: "expense",
      value: Number(entryValue),
      payer: payer,
      // receiver: receiver,
      name: entryName,
      method: Number(valueRadio),
      shares: convertShares(props.accounts, shares)
    };
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
      <div className="font-bold">新增支出</div>
      帳目 <Input placeholder="帳目名稱" onChange={(e) => setEntryName(e.target.value)}/>
      金額 <Input status={entryValueError && "error"} placeholder="帳目金額" onChange={(e) => updateEntryValue(e)}/>
      付款人
      <Select
        placeholder="付款人"
        style={{ width: 120 }}
        onChange={handleChangeSelect}
        options={props.accounts.map(a => ({value: a, label: a}))}
      />
      分攤方式
      <Radio.Group onChange={onChangeRadio} value={valueRadio}>
        <Radio value={1}>平均分攤</Radio>
        <Radio value={2}>指定金額</Radio>
      </Radio.Group>
      <div className="flex flex-col w-full gap-2 py-2">
      {
        valueRadio === 1 &&
        <div className='flex flex-col w-full items-start'>
          <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
            全選
          </Checkbox>
          <CheckboxGroup options={props.accounts} value={checkedList} onChange={onChangeCheck} />
        </div>
      }
      <List
        bordered
        dataSource={props.accounts}
        renderItem={(item, i) => (
          <List.Item>
            {item} 分擔 {shares[i] || 0} 元
            {
              valueRadio === 2 && <Input placeholder="指定金額" status={sharesError[i] && "error"} onChange={(e) => {
                updateShareValue(e, i)
              }}/>
            }
          </List.Item>
        )}
      />
      {
        valueRadio === 2 && 
        <div className="flex flex-col w-full items-center">
          剩餘金額: {entryValue - shares.reduce((a, b) => a + b, 0)}
        </div>
      }
      </div>
      <Button type="primary" disabled={!checkValidity()} onClick={() => submitEntry()}>新增支出</Button>
    </div>
    </Modal>
  )
}

export default AddEntry