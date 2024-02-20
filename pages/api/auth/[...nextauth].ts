import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import {connect} from "../../../config/db"
import Cookies from 'js-cookie';
import { RowDataPacket } from 'mysql2';
import axios from 'axios';
import  {db}  from '../../../database';

export default NextAuth({
  
  providers: [

    Credentials({
      name: 'Custom Login',
      credentials: {
        Email: { label: 'Mail:', type: 'email', placeholder: 'correo@google.com'  },
        Password: { label: 'Password:', type: 'password', placeholder: 'Password'  },
      },
      async authorize(credentials) {
        try{

          const pool=await connect()
          await pool?.connect();
          const [rows] = await pool.execute(`SELECT Id, UserName as Name, Entity_Id, Email, Password, (CASE WHEN IsAdmin = true THEN 1 ELSE 0 END) AS IsAdmin FROM user WHERE Email = '${credentials!.Email}' AND Password = '${credentials!.Password}'`);
          
          await pool?.end();
          const Id = ((rows as RowDataPacket[])[0].Id);
          const Name = ((rows as RowDataPacket[])[0].Name);
          const Email = ((rows as RowDataPacket[])[0].Email);
          const Password = ((rows as RowDataPacket[])[0].Password);
          const IsAdmin = ((rows as RowDataPacket[])[0].IsAdmin);

          return {Id, Email, Name, Password, IsAdmin};
          
        }
        finally{

          const pool=await connect()
          await pool?.end();

        }
      }
    })

  ],

  // Custom Pages
  pages: {
    signIn: '/auth/login?p=',
    newUser: '/auth/register'
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Callbacks
  jwt: {
     //secret: process.env.JWT_SECRET_SEED, // deprecated
  },
  
  session: {
    maxAge: 2592000, /// 30d
    strategy: 'jwt',
    updateAge: 86400, // cada día
  },


  callbacks: {

    async jwt({ token, account, user }) {
      if ( account ) {
        token.accessToken = account.access_token;

        switch( account.type ) {

          case 'oauth': 
          //await db.connect();
            const pool=await connect()
            try
            {
              await pool?.connect();

              token.user = await pool.execute(`SELECT * FROM user WHERE Email = '${user?.email}' AND UserName = '${user?.name}'`);

            }
            finally
            {
              await pool?.end();
            }
            //token.user = await axios.post(`${'/api/user/login'}`, {Email, UserName}).then(res => res.data);
            
            // await db.disconnect();
          break;

          case 'credentials':
            token.user = user;
          break;
        }

      }

      return token;
    },


    async session({ session, token, user }){

      session.accessToken = token.accessToken;
      session.user = token.user as any;
      return session;
    }
    
  }

});