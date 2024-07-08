// import React, { useState, useEffect } from 'react';
// import { Form, Modal, Input, Select, message, Table, DatePicker } from 'antd';
// import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
// import Spinner from '../components/Spinner';
// import axios from 'axios';
// import moment from 'moment'
// import Analytics from '../components/Analytics';
// import ReactGA from 'react-ga';
// import Header from '../components/Layout/Header';

// const { RangePicker } = DatePicker;

// const HomePage = () => {
//     const [showModal, setShowModal] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [allTransactions, setAllTransaction] = useState([]);
//     const [frequency, setFrequency] = useState('7');
//     const [selectedDate, setSelectedDate] = useState([]);
//     const [type, setType] = useState('all')
//     const [viewData, setViewData] = useState("table");
//     const [editable, setEditable] = useState(null);

//     //react ga
//     useEffect(() => {
//         ReactGA.pageview(window.location.pathname)
//     }, [])

//     // Table columns
//     const columns = [{
//         title: 'Date',
//         dataIndex: 'date',
//         render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>
//     }, {
//         title: 'Amount',
//         dataIndex: 'amount',
//     }, {
//         title: 'Type',
//         dataIndex: 'type',
//     }, {
//         title: 'Category',
//         dataIndex: 'category',
//     }, {
//         title: 'Reference',
//         dataIndex: 'reference'
//     }, {
//         title: 'Actions',
//         render: (text, record) => (
//             <div>
//                 <svg
//                     style={{ cursor: 'pointer' }}
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="lucide lucide-pencil"
//                     onClick={() => {
//                         setEditable(record);
//                         setShowModal(true);
//                     }}
//                 >
//                     <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
//                     <path d="m15 5 4 4" />
//                 </svg>

//                 {/* <EditOutlined onClick={() => {
//                     setEditable(record)
//                     setShowModal(true)
//                 }} /> */}
//                 <svg
//                     style={{ cursor: 'pointer', marginLeft: '18px' }}
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="lucide lucide-trash-2"
//                     onClick={() => handleDelete(record)}
//                 >
//                     <path d="M3 6h18" />
//                     <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
//                     <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
//                     <line x1="10" y1="11" x2="10" y2="17" />
//                     <line x1="14" y1="11" x2="14" y2="17" />
//                 </svg>

//                 {/* <DeleteOutlined className='mx-2' onClick={() => handleDelete(record)} /> */}

//             </div>
//         )
//     }];

//     useEffect(() => {
//         //get all transaction
//         const getAllTransactions = async () => {
//             try {
//                 const user = JSON.parse(localStorage.getItem('user'));
//                 setLoading(true);
//                 const res = await axios.post('https://fintrack-server.vercel.app/api/v1/transactions/get-transaction', {
//                     userid: user._id, frequency, selectedDate, type
//                 });
//                 setLoading(false)
//                 setAllTransaction(res.data)
//                 console.log(res.data)
//             } catch (error) {
//                 console.log(error)
//                 message.error("Fetch issue");
//             }
//         }
//         getAllTransactions();
//     }, [frequency, selectedDate, type])


//     //delete handler
//     const handleDelete = async (record) => {
//         try {
//             setLoading(true)
//             await axios.post("https://fintrack-server.vercel.app/api/v1/transactions/delete-transaction", { transactionId: record._id })
//             setLoading(false)
//             message.success("Transaction Deleted")
//         } catch (error) {
//             setLoading(false)
//             console.log(error)
//             message.error("Unable To Delete")
//         }
//     }


//     // Form handling
//     const handleSubmit = async (values) => {
//         console.log(values);
//         try {
//             const user = JSON.parse(localStorage.getItem('user'));
//             setLoading(true);
//             if (editable) {
//                 await axios.post('https://fintrack-server.vercel.app/api/v1/transactions/edit-transaction', {
//                     payload: {
//                         ...values,
//                         userId: user._id
//                     },
//                     transactionId: editable._id
//                 });
//                 setLoading(false);
//                 message.success("Transaction updated successfully");
//             } else {
//                 await axios.post('https://fintrack-server.vercel.app/api/v1/transactions/add-transaction', { ...values, userid: user._id });
//                 setLoading(false);
//                 message.success("Transaction added successfully");
//             }
//             setShowModal(false);
//             setEditable(null)
//             // getAllTransactions(); // Refresh transactions list
//         } catch (error) {
//             setLoading(false);
//             message.error("Failed to add transaction");
//         }
//     };

//     return (
//         <>
//             {/* <Layout> */}
//             {loading && <Spinner />}
//             <Header />
//             <div className='filters'>
//                 <div>
//                     <h6>Select Frequency</h6>
//                     <Select value={frequency} onChange={(value) => setFrequency(value)} style={{ width: "130px" }}>
//                         <Select.Option value="7">Last 7 days</Select.Option>
//                         <Select.Option value="30">Last 30 days</Select.Option>
//                         <Select.Option value="365">Last 1 year</Select.Option>
//                         <Select.Option value="custom">Custom</Select.Option>
//                     </Select>
//                     {
//                         frequency === 'custom' && <RangePicker value={selectedDate} onChange={(values) => setSelectedDate(values)} />
//                     }

//                 </div>

//                 <div>
//                     <h6>Select Type</h6>
//                     <Select value={type} onChange={(values) => setType(values)} style={{ width: "100px" }}>
//                         <Select.Option value="all">All</Select.Option>
//                         <Select.Option value="income">Income</Select.Option>
//                         <Select.Option value="expense">Expense</Select.Option>
//                     </Select>
//                     {
//                         frequency === 'custom' && <RangePicker value={selectedDate} onChange={(values) => setSelectedDate(values)} />
//                     }

//                 </div>

//                 <div className='switch-icons'>
//                     <UnorderedListOutlined className={`mx-2 ${viewData === "table" ? "active-icon" : "inactive-icon"
//                         }`} onClick={() => setViewData('table')} />
//                     <AreaChartOutlined className={`mx-2 ${viewData === "analytics" ? "active-icon" : "inactive-icon"
//                         }`} onClick={() => setViewData('analytics')} />
//                 </div>
//                 <div>
//                     <button
//                         className="logout-button"
//                         onClick={() => setShowModal(true)}
//                     >
//                         Add New
//                     </button>
//                 </div>
//             </div>

//             <div>
//                 {viewData === 'table' ? <Table columns={columns} dataSource={allTransactions} pagination={{ pageSize: 6 }} style={{ marginTop: "30px" }} /> : <Analytics allTransactions={allTransactions} />
//                 }
//             </div>

//             <Modal
//                 title={editable ? 'Edit Transaction' : 'Add Transaction'}
//                 open={showModal}
//                 onCancel={() => setShowModal(false)}
//                 footer={false}
//             >
//                 <Form layout='vertical' onFinish={handleSubmit} initialValues={editable}>
//                     <Form.Item label="Amount" name="amount">
//                         <Input type="text" />
//                     </Form.Item>
//                     <Form.Item label="Type" name="type">
//                         <Select>
//                             <Select.Option value="income">Income</Select.Option>
//                             <Select.Option value="expense">Expense</Select.Option>
//                         </Select>
//                     </Form.Item>
//                     <Form.Item label="Category" name="category">
//                         <Select>
//                             <Select.Option value="salary">Salary</Select.Option>
//                             <Select.Option value="tip">Tip</Select.Option>
//                             <Select.Option value="project">Project</Select.Option>
//                             <Select.Option value="food">Food</Select.Option>
//                             <Select.Option value="movie">Movie</Select.Option>
//                             <Select.Option value="bills">Bills</Select.Option>
//                             <Select.Option value="medical">Medical</Select.Option>
//                             <Select.Option value="fee">Fee</Select.Option>
//                             <Select.Option value="tax">Tax</Select.Option>
//                         </Select>
//                     </Form.Item>
//                     <Form.Item label="Date" name="date">
//                         <Input type="date" />
//                     </Form.Item>
//                     <Form.Item label="Reference" name="reference">
//                         <Input type="text" />
//                     </Form.Item>
//                     <Form.Item label="Description" name="description">
//                         <Input type="text" />
//                     </Form.Item>
//                     <div className='d-flex justify-content-end'>
//                         <button type='submit' className='logout-button'>SAVE</button>
//                     </div>
//                 </Form>
//             </Modal>
//             {/* </Layout> */}
//             {viewData === 'table' && (
//                 <div className='bg-dark text-light p-4 footer' >
//                     <h6 className='text-center'>Made by <a href="https://portfolio-vatsal.vercel.app/" target="_blank" style={{ color: "white", width: "100%" }}>Vatsal</a></h6>
//                 </div>
//             )}


//         </>
//     );
// };

// export default HomePage;




import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import Header from '../components/Layout/Header';
import Spinner from '../components/Spinner';
import ReactGA from 'react-ga';

const HomePage = () => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allTransactions, setAllTransactions] = useState([]);
    const [frequency, setFrequency] = useState('7');
    const [selectedDate, setSelectedDate] = useState([]);
    const [type, setType] = useState('all');
    const [viewData, setViewData] = useState("table");
    const [editable, setEditable] = useState(null);

    // ReactGA initialization
    useEffect(() => {
        ReactGA.pageview(window.location.pathname);
    }, []);

    // Fetch all transactions
    useEffect(() => {
        const getAllTransactions = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                setLoading(true);
                const res = await axios.post('https://fintrack-server.vercel.app/api/v1/transactions/get-transaction', {
                    userid: user._id, frequency, selectedDate, type
                });
                setLoading(false);
                setAllTransactions(res.data);
            } catch (error) {
                setLoading(false);
                message.error("Failed to fetch transactions");
            }
        };
        getAllTransactions();
    }, [frequency, selectedDate, type]);

    // Delete transaction handler
    const handleDelete = async (record) => {
        try {
            setLoading(true);
            await axios.post("https://fintrack-server.vercel.app/api/v1/transactions/delete-transaction", { transactionId: record._id });
            setLoading(false);
            message.success("Transaction deleted successfully");
        } catch (error) {
            setLoading(false);
            message.error("Failed to delete transaction");
        }
    };

    // Form submit handler
    const handleSubmit = async (values) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            setLoading(true);
            if (editable) {
                await axios.post('https://fintrack-server.vercel.app/api/v1/transactions/edit-transaction', {
                    payload: { ...values, userId: user._id },
                    transactionId: editable._id
                });
            } else {
                await axios.post('https://fintrack-server.vercel.app/api/v1/transactions/add-transaction', { ...values, userid: user._id });
            }
            setLoading(false);
            message.success(editable ? "Transaction updated successfully" : "Transaction added successfully");
            setShowModal(false);
            setEditable(null);
            // Refresh transactions list
            getAllTransactions();
        } catch (error) {
            setLoading(false);
            message.error("Failed to save transaction");
        }
    };

    // Table columns
    const columns = [
        { title: 'Date', dataIndex: 'date', render: (text) => moment(text).format("YYYY-MM-DD") },
        { title: 'Amount', dataIndex: 'amount' },
        { title: 'Type', dataIndex: 'type' },
        { title: 'Category', dataIndex: 'category' },
        { title: 'Reference', dataIndex: 'reference' },
        {
            title: 'Actions',
            render: (text, record) => (
                <div>
                    <svg
                        style={{ cursor: 'pointer' }}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-edit"
                        onClick={() => {
                            setEditable(record);
                            setShowModal(true);
                        }}
                    >
                        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                        <path d="m15 5 4 4" />
                    </svg>

                    <svg
                        style={{ cursor: 'pointer', marginLeft: '18px' }}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-trash-2"
                        onClick={() => handleDelete(record)}
                    >
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6m8 2v10" />
                    </svg>
                </div>
            )
        }
    ];

    return (
        <>
            {loading && <Spinner />}
            <Header />
            <div className='filters'>
                {/* Frequency filter */}
                <Select value={frequency} onChange={(value) => setFrequency(value)} style={{ width: "130px", marginRight: '10px' }}>
                    <Select.Option value="7">Last 7 days</Select.Option>
                    <Select.Option value="30">Last 30 days</Select.Option>
                    <Select.Option value="365">Last 1 year</Select.Option>
                    <Select.Option value="custom">Custom</Select.Option>
                </Select>
                {frequency === 'custom' && <RangePicker value={selectedDate} onChange={(values) => setSelectedDate(values)} style={{ marginRight: '10px' }} />}

                {/* Type filter */}
                <Select value={type} onChange={(value) => setType(value)} style={{ width: "100px", marginRight: '10px' }}>
                    <Select.Option value="all">All</Select.Option>
                    <Select.Option value="income">Income</Select.Option>
                    <Select.Option value="expense">Expense</Select.Option>
                </Select>
                {frequency === 'custom' && <RangePicker value={selectedDate} onChange={(values) => setSelectedDate(values)} style={{ marginRight: '10px' }} />}

                {/* Switch between table and analytics view */}
                <div className='switch-icons'>
                    <UnorderedListOutlined className={`mx-2 ${viewData === "table" ? "active-icon" : "inactive-icon"}`} onClick={() => setViewData('table')} />
                    <AreaChartOutlined className={`mx-2 ${viewData === "analytics" ? "active-icon" : "inactive-icon"}`} onClick={() => setViewData('analytics')} />
                </div>

                {/* Add New button */}
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add New</button>
            </div>

            {/* Table or Analytics view */}
            <div className="container">
                {viewData === 'table' ?
                    <table className="table mt-3">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Type</th>
                                <th>Category</th>
                                <th>Reference</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allTransactions.map(transaction => (
                                <tr key={transaction._id}>
                                    <td>{moment(transaction.date).format("YYYY-MM-DD")}</td>
                                    <td>{transaction.amount}</td>
                                    <td>{transaction.type}</td>
                                    <td>{transaction.category}</td>
                                    <td>{transaction.reference}</td>
                                    <td>
                                        <svg
                                            style={{ cursor: 'pointer' }}
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="feather feather-edit"
                                            onClick={() => {
                                                setEditable(transaction);
                                                setShowModal(true);
                                            }}
                                        >
                                            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                                            <path d="m15 5 4 4" />
                                        </svg>

                                        <svg
                                            style={{ cursor: 'pointer', marginLeft: '18px' }}
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="feather feather-trash-2"
                                            onClick={() => handleDelete(transaction)}
                                        >
                                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6m8 2v10" />
                                        </svg>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    : null
                }
            </div>

            {/* Modal for adding/editing transaction */}
            <Modal
                visible={showModal}
                title={editable ? "Edit Transaction" : "Add Transaction"}
                onCancel={() => {
                    setShowModal(false);
                    setEditable(null);
                }}
                footer={null}
            >
                <TransactionForm onSubmit={handleSubmit} editable={editable} />
            </Modal>
        </>
    );
};

// TransactionForm component
const TransactionForm = ({ onSubmit, editable }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (editable) {
            form.setFieldsValue({
                date: moment(editable.date),
                amount: editable.amount,
                type: editable.type,
                category: editable.category,
                reference: editable.reference
            });
        } else {
            form.resetFields();
        }
    }, [editable, form]);

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
        >
            <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: 'Please select date!' }]}
            >
                <DatePicker />
            </Form.Item>
            <Form.Item
                label="Amount"
                name="amount"
                rules={[{ required: true, message: 'Please enter amount!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Type"
                name="type"
                rules={[{ required: true, message: 'Please select type!' }]}
            >
                <Select>
                    <Select.Option value="income">Income</Select.Option>
                    <Select.Option value="expense">Expense</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: 'Please enter category!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Reference"
                name="reference"
                rules={[{ required: true, message: 'Please enter reference!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item>
                <button className="btn btn-primary" type="submit">Submit</button>
            </Form.Item>
        </Form>
    );
};

export default HomePage;
