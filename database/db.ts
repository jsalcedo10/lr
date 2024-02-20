//import {pool} from '../config/db';
import {connect} from "../config/db"

/**
 * 0 = disconnected
 * 1 = connected
 * 2 = connecting
 * 3 = disconnecting
 */
const mysqlConnection = {
    isConnected: 0
}



export const connect2 = async() => {

    const pool= await connect();

    if ( mysqlConnection.isConnected ) {
        return;
    }
    if (pool.listenerCount.length > 0 ) 
    {
        await pool.end()
        return;
    }

    await pool;
    
    mysqlConnection.isConnected = 1;
}

export const disconnect = async() => {
    const pool= await connect();

    if ( mysqlConnection.isConnected === 0 ) return;

    await pool.end();

    mysqlConnection.isConnected = 0;

}