import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
// import { jwt } from '../../utils';


export async function middleware( req: NextRequest | any, ev: NextFetchEvent ) {

    /*const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if ( !session ) {
        const requestedPage = req.page.name;
        return NextResponse.redirect(`${req.nextUrl.origin}/auth/login?p=${ requestedPage }`);
    }


    if ( session.user.IsAdmin != 1  ) {
        return NextResponse.redirect(`${req.nextUrl.origin}`);
    }

    return NextResponse.next();*/

}