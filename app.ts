import express from 'express';
import morgan from 'morgan';
import indexRouter from './src/routes/index';
import { PORT } from './config/constants';
import { DatabaseInitializer } from './src/service/database-initializer';

const app = express();
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', indexRouter);

app.listen(PORT, async () => {

    try {
        await DatabaseInitializer.start()
    } catch (error) {
        console.log(`Could not initialize database. Exiting process...`);
        process.exit(1);
    }


    console.info(`=================================`);
    console.info(`App listening on the port ${PORT}`);
    console.info(`=================================`);
});


process.on('SIGINT', async () => {
    console.log('SIGINT');
    process.exit();
});
process.on('exit', async () => {
    console.log('exit');
    await DatabaseInitializer.close();
    process.exit();
});

export default app;