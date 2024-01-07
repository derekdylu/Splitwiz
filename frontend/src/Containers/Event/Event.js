import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import { 
  List,
  Button,
  Collapse,
  Popconfirm,
  message,
  Divider
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import AddEntry from '../../Components/AddEntry'
import EditEntry from '../../Components/EditEntry';
import AddTrans from '../../Components/AddTrans';
import EditTrans from '../../Components/EditTrans';

const serverUrl = process.env.REACT_APP_SERVER_URL

const Event = () => {
  let { id } = useParams(); // This retrieves the ID from the URL
  const [eventName, setEventName] = useState("Loading...");
  const [accounts, setAccounts] = useState([]);
  const [data, setData] = useState(null);

  const [openEntryModal, setOpenEntryModal] = useState(false)
  const [openEntryEditModal, setOpenEntryEditModal] = useState(false)
  const [openTransModal, setOpenTransModal] = useState(false)
  const [openTransEditModal, setOpenTransEditModal] = useState(false)

  const [dataIndex, setDataIndex] = useState(-1)
  const [showSettle, setShowSettle] = useState(false)
  const [settleData, setSettleData] = useState([])

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${serverUrl}/events/${id}`);
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const result = await response.json();
    
        if (result.name && result.accounts) {
          setEventName(result.name);
          setAccounts(result.accounts);
        } else {
          console.log('The event data is not in the expected format.');
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    const fetchData = async () => {
      try {
        const response = await fetch(`${serverUrl}/events/${id}/transactions`);
        
        if (response.status === 404) {
          setData([]);
          return;
        }
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
    
        if (!result || result.length === 0) {
          console.log('No transactions found.');
          setData([]);
        } else {
          setData(result.sort((a, b) => b.timestamp - a.timestamp));
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };        

    fetchEvent().catch(console.error);
    fetchData().catch(console.error);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const reload = async () => {
    try {
      const response = await fetch(`${serverUrl}/events/${id}/transactions`);
      
      if (response.status === 404) {
        setData([]);
        return;
      }
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
  
      if (!result || result.length === 0) {
        console.log('No transactions found.');
        setData([]);
      } else {
        setData(result.sort((a, b) => b.timestamp - a.timestamp));
      }

      settle(result)
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  const handleCloseEntryModal = () => {
    setOpenEntryModal(false)
  }

  const handleOpenEntryEditModal = (index) => {
    setDataIndex(index)
    setOpenEntryEditModal(true)
  }

  const handleCloseEntryEditModal = () => {
    setOpenEntryEditModal(false)
  }

  const handleCloseTransModal = () => {
    setOpenTransModal(false)
  }

  const handleOpenTransEditModal = (index) => {
    setDataIndex(index)
    setOpenTransEditModal(true)
  }

  const handleCloseTransEditModel = () => {
    setOpenTransEditModal(false)
  }

  const confirmAdded = () => {
    message.success('已新增帳目');
    reload()
  }

  const confirmEdited = () => {
    message.success('已更新帳目');
    reload()
  }

  const confirmDelete = async (id) => {
    try {
      const response = await fetch(`${serverUrl}/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      message.error('已經刪除帳目');
      reload()
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  
  };

  const confirmSettle = async (payer, receiver, entryValue) => {
    const transactionData = {
      eventId: id,
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

      message.success('已新增結清轉帳');
      reload()
    } catch (error) {
      console.error('Error posting transaction:', error);
    }
    
  }

  const confirmTrans = () => {
    message.success('已新增轉帳');
    reload()
  }

  const confirmTransEdit = () => {
    message.success('已更新轉帳');
    reload()
  }

  const processTransactions = (transactions) => {
    const balances = {};
  
    transactions.forEach((transaction) => {
      if (transaction.type === "transfer") {
        // Update balances for direct transfers
        balances[transaction.payer] =
          (balances[transaction.payer] || 0) + transaction.value;
        balances[transaction.receiver] =
          (balances[transaction.receiver] || 0) - transaction.value;
      } else if (transaction.type === "expense") {
        // Update balances for shared expenses
        const totalValue = transaction.value;
        const payer = transaction.payer;
        const shares = transaction.shares;
  
        // Deduct total expense from the payer
        balances[payer] = (balances[payer] || 0) + totalValue;
  
        // Credit each participant's share
        for (const [person, share] of Object.entries(shares)) {
          balances[person] = (balances[person] || 0) - share;
        }
      }
    });
  
    return balances;
  }

  const minimizeTransactions = (balances) => {
    const transactions = [];
    const keys = Object.keys(balances);
  
    while (true) {
      // Find the person with the highest debt and the highest credit
      keys.sort((a, b) => balances[a] - balances[b]);
      const debtor = keys[0];
      const creditor = keys[keys.length - 1];
  
      // If everyone is settled
      if (balances[debtor] >= 0 || balances[creditor] <= 0) {
        break;
      }
  
      // The amount to be settled
      const settledAmount = Math.min(-balances[debtor], balances[creditor]);
      balances[debtor] += settledAmount;
      balances[creditor] -= settledAmount;
      const transaction = {
        "debtor": debtor,
        "creditor": creditor,
        "settledAmount": settledAmount
      }
      transactions.push(transaction);
    }
    
    return transactions;
  }

  const settle = (transactions) => {
    if (transactions.length <= 0) return;

    setSettleData([])

    // Process the transactions and get the net balances
    const netBalances = processTransactions(transactions);

    // Simplify the transactions
    setSettleData(minimizeTransactions(netBalances));
  }

  const copyToClipboard = async () => {
    const linkToCopy = `https://how2split.derekdylu.com/events/${id}`
    try {
      // Use the Clipboard API to copy the text
      await navigator.clipboard.writeText(linkToCopy);
      message.success('共享連結已複製');
    } catch (err) {
      console.error('Failed to copy: ', err); // Handle any errors
    }
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {
        openEntryModal && <AddEntry openModal={openEntryModal} closeModal={handleCloseEntryModal} confirmMessage={confirmAdded} accounts={accounts} id={id} />
      }
      {
        openEntryEditModal && <EditEntry openModal={openEntryEditModal} closeModal={handleCloseEntryEditModal} confirmMessage={confirmEdited} data={data[dataIndex]} accounts={accounts} id={id} transactionId={data[dataIndex]._id} />
      }
      {
        openTransModal && <AddTrans openModal={openTransModal} closeModal={handleCloseTransModal} confirmMessage={confirmTrans} accounts={accounts} id={id} />
      }
      {
        openTransEditModal && <EditTrans openModal={openTransEditModal} closeModal={handleCloseTransEditModel} confirmMessage={confirmTransEdit} data={data[dataIndex]} accounts={accounts} id={id} transactionId={data[dataIndex]._id} />
      }
      <div className="flex flex-col gap-4 pb-4">
        <div className="font-bold">{eventName}</div>
        <div className="flex flex-row justify-center gap-2">
        <Button onClick={() => copyToClipboard()}>共享</Button>
        <Button onClick={() => setOpenEntryModal(true)}>新增支出</Button>
        <Button onClick={() => setOpenTransModal(true)}>新增轉帳</Button>
        <Button type="primary" onClick={() => {settle(data); setShowSettle(true);}}>結算</Button>
        </div>
      </div>
      <div className="flex flex-col w-full px-2 md:px-12 lg:px-24 xl:px-48">
      {
        showSettle && 
        <div className="flex flex-col pt-2">
        {
          settleData.length > 0 ?
          <List
            bordered
            dataSource={settleData}
            renderItem={(item) => (
              <List.Item>
                <div className='flex flex-row w-full items-center justify-between'>
                {item.debtor} 應付 {item.creditor} {item.settledAmount} 元
                <Popconfirm
                  title="確認轉帳"
                  description="確認新增此筆轉帳以結清欠款？"
                  onConfirm={() => confirmSettle(item.debtor, item.creditor, item.settledAmount)}
                  okText="確認"
                  okType="danger"
                  cancelText="取消"
                >
                  <Button>結清</Button>
                </Popconfirm>
                </div>
              </List.Item>
            )}
          />
          :
          <div>無結算需要</div>
        }
        <Button type="text" onClick={() => setShowSettle(false)}>隱藏結算</Button>
        </div>
      }
      <Divider />
      <List
        bordered
        dataSource={data}
        renderItem={(item, i) => (
          <List.Item>
          {
            item.type === "expense" &&
            <div className="flex flex-col w-full">
              <div className="flex flex-row w-full justify-between items-center pb-2">
                {item.name} 由 {item.payer} 先付 {item.value} 元
                <div className="flex flex-row gap-1">
                  <Button icon={<EditOutlined />} onClick={() => handleOpenEntryEditModal(i)} />
                  <Popconfirm
                    title="刪除帳目"
                    description="確定要刪除此筆帳目？"
                    onConfirm={() => confirmDelete(item._id)}
                    okText="刪除"
                    okType="danger"
                    cancelText="取消"
                  >
                    <Button danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </div>
              </div>
              <Collapse bordered={false}>
                <Collapse.Panel header={item.method === 1 ? "平均分攤" : "指定金額"}>
                  <List
                    bordered
                    dataSource={Object.keys(item.shares)}
                    renderItem={(member) => (
                      <List.Item>
                        <div className='flex flex-row w-full items-center justify-start'>
                          {member} 分攤 {item.shares[member] || 0} 元
                        </div>
                      </List.Item>
                    )}
                  />
                </Collapse.Panel>
              </Collapse>
            </div>
          }
          {
            item.type === "transfer" &&
            <div className="flex flex-row w-full justify-between items-center py-1">
              {item.payer} 轉 {item.value} 元給 {item.receiver}
              <div className="flex flex-row gap-1">
              <Button icon={<EditOutlined />} onClick={() => handleOpenTransEditModal(i)} />
                <Popconfirm
                  title="刪除轉帳"
                  description="確定要刪除此筆轉帳？"
                  onConfirm={() => confirmDelete(item._id)}
                  okText="刪除"
                  okType="danger"
                  cancelText="取消"
                >
                  <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </div>
            </div>
          }
          </List.Item>
        )}
      />
      </div>
    </>
  )
}

export default Event