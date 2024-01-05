import React, {useState} from 'react'
import { 
  Checkbox,
  List,
  Radio,
  Input,
  Button,
  Select
} from 'antd';
const CheckboxGroup = Checkbox.Group;

const accounts = ['Andrea', 'Bella', 'Derek', 'Ella'];

const AddEntry = () => {
  const [entryName, setEntryName] = useState("")
  const [entryValue, setEntryValue] = useState(0)
  const [shares, setShares] = useState(accounts.map(a => 0))
  const [checkedList, setCheckedList] = useState(accounts)
  const [valueRadio, setValueRadio] = useState(1)
  const [payer, setPayer] = useState("")

  const checkAll = accounts.length === checkedList.length;
  const indeterminate = checkedList.length > 0 && checkedList.length < accounts.length;

  const onChangeRadio = (e) => {
    setValueRadio(e.target.value);
    e.target.value === 1 ?
      setShares(accounts.map(a => entryValue / checkedList.length))
      :
      setShares(accounts.map(a => 0))
  };

  const onChangeCheck = (list) => {
    setCheckedList(list);
    if (valueRadio === 1) {
      setShares(list.map(a => entryValue / list.length))
    }
    
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? accounts : []);
  };

  const updateEntryValue = (e) => {
    setEntryValue(e.target.value)
    if (valueRadio === 1) {
      setShares(accounts.map(a => e.target.value / checkedList.length))
    }
  }

  const handleChangeSelect = (value) => {
    setPayer(value)
  };

  const checkValidity = () => {
    return entryName && entryValue && payer && ((valueRadio === 1 && checkedList.length > 0) || (valueRadio === 2 && entryValue - shares.reduce((a, b) => a + b, 0) === 0))
  }
  
  return (
    <>
      帳目 <Input placeholder="帳目名稱" onChange={(e) => setEntryName(e.target.value)}/>
      金額 <Input placeholder="帳目金額" onChange={(e) => updateEntryValue(e)}/>
      付款人
      <Select
        placeholder="付款人"
        style={{ width: 120 }}
        onChange={handleChangeSelect}
        options={accounts.map(a => ({value: a, label: a}))}
      />
      <Radio.Group onChange={onChangeRadio} value={valueRadio}>
        <Radio value={1}>平均分攤</Radio>
        <Radio value={2}>指定金額</Radio>
      </Radio.Group>
      {
        valueRadio === 1 &&
        <div>
          <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
            全選
          </Checkbox>
          <CheckboxGroup options={accounts} value={checkedList} onChange={onChangeCheck} />
        </div>
      }
      <List
        bordered
        dataSource={checkedList}
        renderItem={(item, i) => (
          <List.Item>
            {item} 分擔 {shares[i]} 元
            {
              valueRadio === 2 && <Input placeholder="指定金額" onChange={(e) => {
                const newShares = [...shares]
                newShares[i] = Number(e.target.value)
                setShares(newShares)
              }}/>
            }
          </List.Item>
        )}
      />
      {
        valueRadio === 2 && 
        <div>
          剩餘金額: {entryValue - shares.reduce((a, b) => a + b, 0)}
        </div>
      }
      <Button disabled={!checkValidity()} onClick={() => console.log(entryName, payer, entryValue, shares)}>新增帳目</Button>
    </>
  )
}

export default AddEntry