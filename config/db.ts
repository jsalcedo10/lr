import {createPool, createConnection} from "mysql2/promise";
// //DEVELOP
//     /*const pool = createPool({
//         host: "mysql5044.site4now.net",
//         user: "a7af99_cdev",
//         password: "Devise2021#",
//         port: 3306,
//         database: "db_a7af99_cdev",
//         connectionLimit : 1000
//     });*/

// //PRODUCTION
//     const connect=async()=>{
//         try {
//             await createPool({ 
//                 host: "mysql5044.site4now.net",
//                 user: "a7af99_chasepr",
//                 password: "Devise2021#",
//                 port: 3306,
//                 database: "db_a7af99_chasepr",
//             });
//             // console.log('Connect');
//         } catch (error) {
//             console.log(error);
//             process.exit(1);
//         }
//     }
// // const pool = createPool({ 
// //     host: "mysql5044.site4now.net",
// //     user: "a7af99_chasepr",
// //     password: "Devise2021#",
// //     port: 3306,
// //     database: "db_a7af99_chasepr",
// // });

// export {pool,connect};

const config = {

	//vercel
   host: "localhost",
   database: "lrdb2",
   user: "root",
   password: "devise123",
   port: 3306,
   connectionLimit: 10,
  waitForConnections : true,
//   host: "localhost",
//    database: "localhost",
//    user: "root",
//    password: "devise123",
//    port: 3306,
//    connectionLimit: 10,
//   waitForConnections : true,

    //Local
// host: "mysql5044.site4now.net",
// database: "db_a7af99_testjj",
// user: "a7af99_testjj",
// password: "Devise2021#",
// port: 3306,
// connectionLimit: 10,
// waitForConnections : true,

	//Production
	//host: "localhost",
	//database: "chase",
	//user: "devise",
	//password: "Devise2021#",
	//port: 3306,
	//connectionLimit: 10,
	//waitForConnections : true,
	//Production test
	// host: "localhost",
	// database: "chaseTest2",
	// user: "devise",
	// password: "Devise2021#",
	// port: 3306,
	// connectionLimit: 10,
	// waitForConnections : true,

}
let countConnections = 0;

export async function connect() {
		try {
			let pool: any;	

			countConnections ++;

			if(countConnections < 10){
				pool = await createConnection(config);
				return pool;
			}
			else{
				countConnections = 0;
				return connect();
			}
		}
		catch( err ) {
			let pool: any;	

			if(countConnections >= 10){
				countConnections = 0;
				await pool?.end();
				await pool?.destroy();
				return connect();
			}
			else{
					{
						try{
							await pool?.end()
							await pool?.destroy()
							pool = await createConnection(config);
							//await pool?.connect()
							return pool;
						}
						catch(err){
							return connect()
							//return pool;
						}
					}

			}
		}
};