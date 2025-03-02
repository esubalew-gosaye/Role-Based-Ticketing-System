import cron from 'node-cron';

// Define a job that runs every minute

cron.schedule('*/5 * * * * *', () => {
    console.log('Running Cron Job', new Date().getSeconds());
});

// Define a job that runs every 15 seconds

cron.schedule('*/15 * * * *', () => {
    console.log('Running Cron Job (Every 15 seconds)');
});