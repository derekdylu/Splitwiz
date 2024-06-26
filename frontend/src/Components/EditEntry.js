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

const EditEntry = (props) => {
  const [entryName, setEntryName] = useState(props.data.name)
  const [entryValue, setEntryValue] = useState(props.data.value)
  const [shares, setShares] = useState(Object.values(props.data.shares))
  const [checkedList, setCheckedList] = useState(Object.keys(props.data.shares).filter(key => props.data.shares[key] > 0))
  const [valueRadio, setValueRadio] = useState(props.data.method)
  const [payer, setPayer] = useState(props.data.payer)
  const [entryValueError, setEntryValueError] = useState(false)
  const [sharesError, setSharesError] = useState(props.accounts.map(x => false))
  const [loading, setLoading] = useState(false)

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
    setLoading(true)
    const transactionData = {
      eventId: props.id,
      // timestamp: Date.now(),
      type: "expense",
      value: Number(entryValue),
      payer: payer,
      // receiver: receiver,
      name: entryName,
      method: Number(valueRadio),
      shares: convertShares(props.accounts, shares)
    };
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

  const round = (num) => {
    if (num === null || num === undefined) { 
      return 0
    } else {
      return (num.toString().split(".")[1]?.length > 2) ? num.toFixed(2) : num;
    }
  };
  
  return (
    <Modal open={props.openModal} onCancel={props.closeModal} footer={null}>
    <div className="flex flex-col px-4 gap-4 items-center">
      <div className="font-bold">編輯支出</div>
      <div className="flex flex-row items-center justify-between w-full">
        帳目
        <Input placeholder="帳目名稱" value={entryName} onChange={(e) => setEntryName(e.target.value)} style={{ width: 220 }}/>
      </div>
      <div className="flex flex-row items-center justify-between w-full">
        金額
        <Input status={entryValueError && "error"} placeholder="帳目金額" value={entryValue} onChange={(e) => updateEntryValue(e)} style={{ width: 220 }} />
      </div>
      <div className="flex flex-row items-center justify-between w-full">
        付款人
        <Select
          placeholder="付款人"
          style={{ width: 220 }}
          value={payer}
          onChange={handleChangeSelect}
          options={props.accounts.map(a => ({value: a, label: a}))}
        />
      </div>
      <div className="flex flex-row items-center justify-between w-full">
        分攤方式
        <Radio.Group onChange={onChangeRadio} value={valueRadio}>
          <Radio value={1}>平均分攤</Radio>
          <Radio value={2}>指定金額</Radio>
        </Radio.Group>
      </div>
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
            {item} 分擔 {round(shares[i]) || 0} 元
            {
              valueRadio === 2 && <Input allowClear placeholder="指定金額" status={sharesError[i] && "error"} onChange={(e) => {
                updateShareValue(e, i)
              }}/>
            }
          </List.Item>
        )}
      />
      {
        valueRadio === 2 && 
        <div className="flex flex-col w-full items-center gap-2">
          剩餘金額: {round(entryValue - shares.reduce((a, b) => a + b, 0))}
        </div>
      }
      </div>
      {
        loading ?
        <Button loading>儲存</Button>
        :
        <Button type="primary" disabled={!checkValidity()} onClick={() => submitEntry()}>儲存</Button>
      }
    </div>
    </Modal>
  )
}

export default EditEntry