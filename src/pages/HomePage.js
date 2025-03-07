import React, { useState, useEffect } from 'react';
import { Form, Modal, Input, Select, message, Table, DatePicker } from 'antd';
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import Spinner from '../components/Spinner';
import axios from 'axios';
import moment from 'moment'
import Analytics from '../components/Analytics';
import ReactGA from 'react-ga';
import Header from '../components/Layout/Header';
import './HomePage.css';


const { RangePicker } = DatePicker;

const HomePage = () => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allTransactions, setAllTransaction] = useState([]);
    const [frequency, setFrequency] = useState('7');
    const [selectedDate, setSelectedDate] = useState([]);
    const [type, setType] = useState('all')
    const [viewData, setViewData] = useState("table");
    const [editable, setEditable] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6); // Set page size to 6




    //react ga
    useEffect(() => {
        ReactGA.pageview(window.location.pathname)
    }, [])

    // Table columns
    const columns = [{
        title: 'Date',
        dataIndex: 'date',
        render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>
    }, {
        title: 'Amount',
        dataIndex: 'amount',
    }, {
        title: 'Type',
        dataIndex: 'type',
    }, {
        title: 'Category',
        dataIndex: 'category',
    }, {
        title: 'Reference',
        dataIndex: 'reference'
    }, {
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
                    className="lucide lucide-pencil"
                    onClick={() => {
                        setEditable(record);
                        setShowModal(true);
                    }}
                >
                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                    <path d="m15 5 4 4" />
                </svg>

                {/* <EditOutlined onClick={() => {
                    setEditable(record)
                    setShowModal(true)
                }} /> */}
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
                    className="lucide lucide-trash-2"
                    onClick={() => handleDelete(record)}
                >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                </svg>

                {/* <DeleteOutlined className='mx-2' onClick={() => handleDelete(record)} /> */}

            </div>
        )
    }];

    useEffect(() => {
        //get all transaction
        const getAllTransactions = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                setLoading(true);
                const res = await axios.post('https://fintrack-server.vercel.app/api/v1/transactions/get-transaction', {
                    userid: user._id, frequency, selectedDate, type
                });
                setLoading(false)
                setAllTransaction(res.data)
                console.log(res.data)
            } catch (error) {
                console.log(error)
                message.error("Fetch issue");
            }
        }
        getAllTransactions();
    }, [frequency, selectedDate, type])


    //delete handler
    const handleDelete = async (record) => {
        try {
            setLoading(true)
            await axios.post("https://fintrack-server.vercel.app/api/v1/transactions/delete-transaction", { transactionId: record._id })
            setLoading(false)
            message.success("Transaction Deleted")
        } catch (error) {
            setLoading(false)
            console.log(error)
            message.error("Unable To Delete")
        }
    }


    // Form handling
    const handleSubmit = async (values) => {
        console.log(values);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            setLoading(true);
            if (editable) {
                await axios.post('https://fintrack-server.vercel.app/api/v1/transactions/edit-transaction', {
                    payload: {
                        ...values,
                        userId: user._id
                    },
                    transactionId: editable._id
                });
                setLoading(false);
                message.success("Transaction updated successfully");
            } else {
                await axios.post('https://fintrack-server.vercel.app/api/v1/transactions/add-transaction', { ...values, userid: user._id });
                setLoading(false);
                message.success("Transaction added successfully");
            }
            setShowModal(false);
            setEditable(null)
            // getAllTransactions(); // Refresh transactions list
        } catch (error) {
            setLoading(false);
            message.error("Failed to add transaction");
        }
    };

    return (
        <>
            {/* <Layout> */}
            {loading && <Spinner />}
            <Header />
            <div className='filters'>
                <div>
                    <h6>Select Frequency</h6>
                    <Select value={frequency} onChange={(value) => setFrequency(value)} style={{ width: "130px" }}>
                        <Select.Option value="7">Last 7 days</Select.Option>
                        <Select.Option value="30">Last 30 days</Select.Option>
                        <Select.Option value="365">Last 1 year</Select.Option>
                        <Select.Option value="custom">Custom</Select.Option>
                    </Select>
                    {
                        frequency === 'custom' && <RangePicker value={selectedDate} onChange={(values) => setSelectedDate(values)} />
                    }

                </div>

                <div>
                    <h6>Select Type</h6>
                    <Select value={type} onChange={(values) => setType(values)} style={{ width: "100px" }}>
                        <Select.Option value="all">All</Select.Option>
                        <Select.Option value="income">Income</Select.Option>
                        <Select.Option value="expense">Expense</Select.Option>
                    </Select>
                    {
                        frequency === 'custom' && <RangePicker value={selectedDate} onChange={(values) => setSelectedDate(values)} />
                    }

                </div>

                <div className='switch-icons'>
                    <UnorderedListOutlined className={`mx-2 ${viewData === "table" ? "active-icon" : "inactive-icon"
                        }`} onClick={() => setViewData('table')} />
                    <AreaChartOutlined className={`mx-2 ${viewData === "analytics" ? "active-icon" : "inactive-icon"
                        }`} onClick={() => setViewData('analytics')} />
                </div>
                <div>
                    <button
                        className="logout-button"
                        onClick={() => setShowModal(true)}
                    >
                        Add New
                    </button>
                </div>
            </div>

            <div>
                {viewData === 'table' ? <Table columns={columns} dataSource={allTransactions} style={{ marginTop: "30px" }} pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                    },
                }} /> : <Analytics allTransactions={allTransactions} />
                }
            </div>

            <Modal
                title={editable ? 'Edit Transaction' : 'Add Transaction'}
                open={showModal}
                onCancel={() => setShowModal(false)}
                footer={false}
            >
                <Form layout='vertical' onFinish={handleSubmit} initialValues={editable}>
                    <Form.Item label="Amount" name="amount">
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item label="Type" name="type">
                        <Select>
                            <Select.Option value="income">Income</Select.Option>
                            <Select.Option value="expense">Expense</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Category" name="category">
                        <Select>
                            <Select.Option value="groceries">Groceries</Select.Option>
                            <Select.Option value="rent-mortgage">Rent/Mortgage</Select.Option>
                            <Select.Option value="utilities">Utilities(Electricity, Water, Gas)</Select.Option>
                            <Select.Option value="salary">Salary</Select.Option>
                            <Select.Option value="tax">Taxes</Select.Option>

                            <Select.Option value="transportation">Transportation </Select.Option>
                            <Select.Option value="healthcare">Healthcare </Select.Option>
                            <Select.Option value="personal-care">Personal Care </Select.Option>
                            <Select.Option value="dining-out">Dining Out</Select.Option>
                            <Select.Option value="entertainment">Entertainment </Select.Option>
                            <Select.Option value="clothing">Clothing</Select.Option>
                            <Select.Option value="fitness">Fitness </Select.Option>
                            <Select.Option value="education">Education </Select.Option>

                        </Select>
                    </Form.Item>
                    <Form.Item label="Date" name="date">
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item label="Reference" name="reference">
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input type="text" />
                    </Form.Item>
                    <div className='d-flex justify-content-end'>
                        <button type='submit' className='logout-button'>SAVE</button>
                    </div>
                </Form>
            </Modal>
            {/* </Layout> */}
            {viewData === 'table' && (
                <div className='bg-dark text-light p-4 footer' >
                    <h6 className='text-center'>Made by <a href="https://portfolio-vatsal.vercel.app/" target="_blank" style={{ color: "white", width: "100%" }}>Vatsal</a></h6>
                </div>
            )}


        </>
    );
};

export default HomePage;



