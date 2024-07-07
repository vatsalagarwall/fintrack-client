import React from 'react';
import { Progress } from 'antd';
import Footer from './Layout/Footer';

const Analytics = ({ allTransactions }) => {
    const categories = ['salary', 'tip', 'project', 'food', 'movie', 'bills', 'medical', 'fee', 'tax'];

    const totalTransactions = allTransactions.length;
    const totalIncomeTransactions = allTransactions.filter(transaction => transaction.type === 'income');
    const totalExpenseTransactions = allTransactions.filter(transaction => transaction.type === 'expense');
    const totalIncomePercent = (totalIncomeTransactions.length / totalTransactions) * 100;
    const totalExpensePercent = (totalExpenseTransactions.length / totalTransactions) * 100;

    // Turnover
    const totalTurnover = allTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    const totalIncomeTurnover = allTransactions.filter(transaction => transaction.type === 'income').reduce((acc, transaction) => acc + transaction.amount, 0);
    const totalExpenseTurnover = allTransactions.filter(transaction => transaction.type === 'expense').reduce((acc, transaction) => acc + transaction.amount, 0);

    const totalIncomeTurnoverPercent = (totalIncomeTurnover / totalTurnover) * 100;
    const totalExpenseTurnoverPercent = (totalExpenseTurnover / totalTurnover) * 100;

    return (
        <div className="container mt-4" style={{ height: "100vh" }}>
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-header">
                            <h5>Total Transactions</h5>
                        </div>
                        <div className="card-body">
                            <h6 className="text-success">Income: {totalIncomeTransactions.length}</h6>
                            <h6 className="text-danger">Expense: {totalExpenseTransactions.length}</h6>
                            <div className="d-flex justify-content-around mt-3">
                                <Progress type="circle" strokeColor="green" percent={totalIncomePercent.toFixed(0)} />
                                <Progress type="circle" strokeColor="red" percent={totalExpensePercent.toFixed(0)} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-header">
                            <h5>Total Turnover</h5>
                        </div>
                        <div className="card-body">
                            <h6 className="text-success">Income: {totalIncomeTurnover}</h6>
                            <h6 className="text-danger">Expense: {totalExpenseTurnover}</h6>
                            <div className="d-flex justify-content-around mt-3">
                                <Progress type="circle" strokeColor="green" percent={totalIncomeTurnoverPercent.toFixed(0)} />
                                <Progress type="circle" strokeColor="red" percent={totalExpenseTurnoverPercent.toFixed(0)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <h4>Category Wise Income</h4>
                    {categories.map(category => {
                        const amount = allTransactions.filter(transaction => transaction.type === 'income' && transaction.category === category).reduce((acc, transaction) => acc + transaction.amount, 0);
                        return (
                            amount > 0 && (
                                <div className="card shadow-sm mb-3" key={category}>
                                    <div className="card-body">
                                        <h6>{category}</h6>
                                        <Progress percent={((amount / totalIncomeTurnover) * 100).toFixed(0)} />
                                    </div>
                                </div>
                            )
                        );
                    })}
                </div>
                <div className="col-md-6">
                    <h4>Category Wise Expense</h4>
                    {categories.map(category => {
                        const amount = allTransactions.filter(transaction => transaction.type === 'expense' && transaction.category === category).reduce((acc, transaction) => acc + transaction.amount, 0);
                        return (
                            amount > 0 && (
                                <div className="card shadow-sm mb-3" key={category}>
                                    <div className="card-body">
                                        <h6>{category}</h6>
                                        <Progress percent={((amount / totalExpenseTurnover) * 100).toFixed(0)} />
                                    </div>
                                </div>
                            )
                        );
                    })}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Analytics;
