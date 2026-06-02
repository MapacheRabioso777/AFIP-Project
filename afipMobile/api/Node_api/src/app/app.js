import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import userRouter from "../routers/user.router.js";
import accountRouter from '../routers/account.router.js';
import categoryRouter from '../routers/category.router.js';
import expenseRouter from '../routers/expense.router.js';
import incomeRouter from '../routers/income.router.js';
import goalRouter from '../routers/goal.router.js';
import budgetRouter from '../routers/budget.router.js';
import debtRouter from '../routers/debt.router.js';
import debtPaymentRouter from '../routers/debtPayment.js';


const app = express();
app.use(morgan('dev'));

app.use(cors());

app.use(express.json());
app.use('/api/v1', userRouter); //estructura basica para poder consultar
app.use('/api/v1', accountRouter);
app.use('/api/v1', categoryRouter);
app.use('/api/v1', expenseRouter);
app.use('/api/v1', incomeRouter);
app.use('/api/v1', goalRouter);
app.use('/api/v1', budgetRouter);
app.use('/api/v1', debtRouter);
app.use('/api/v1', debtPaymentRouter);

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Endpoint not found'
    });
    console.error("Endpoint not found");
});

export default app;
