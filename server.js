import express from 'express';
import mainRouter from './routes';

const app = express();
const port = process.env.PORT || 5000;

mainRouter(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;