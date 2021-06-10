import {app} from './app';
import {connect} from 'mongoose';
import {ErrorMessage} from './messages/errors.message';
import {InfoMessage} from './messages/info.message';

// Connect to the database
const mongoDBURL = process.env.MONGODB_URL;
if (mongoDBURL) {
    connect(mongoDBURL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log(InfoMessage.INFO_DATABASE_CONNECTED);
} else {
    throw new Error(ErrorMessage.ERROR_MISSING_MONGDB_URL)
}

// Start the server
const PORT = 8000;
app.listen(PORT, () => {
    console.log(InfoMessage.INFO_SERVER_STARTED.replace('{0}', PORT + ''));
});