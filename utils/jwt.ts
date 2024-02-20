import jwt from 'jsonwebtoken';

export const signToken = (_id: string, _email: string, _isAdmin : string) => {
    debugger
    if (!process.env.JWT_SECRET_SEED) {

        throw new Error('THERES NO SEED- check it out');
    }

    return jwt.sign(
        { _id, _email, _isAdmin },
        process.env.JWT_SECRET_SEED,
        { expiresIn: '12h' }
    )
}

export const signTokenStripe = (_clientSecret: string) => {

    if (!process.env.STRIPE_SECRET_KEY) {

        throw new Error('THERES NO SEED- check it out');
    }
    return jwt.sign(
        { _clientSecret },
        process.env.STRIPE_SECRET_KEY,
        { expiresIn: '240s' }
    )
}


export const employeeToken =
    (
        _FirstName: string,
        _id: string,
        _LastName: string,
        _CreatedAt: string,
        _Active: string,
        _Phone: string,
        _Contract: number,
        _Email: string,
        _Entity: number,
        _Department: number,
        _Position: string) => {
        if (!process.env.JWT_SECRET_SEED_EMPLOYEE) {
            throw new Error('THERES NO SEED- check it out');
        }

        return jwt.sign(
            {
                _FirstName,
                _id,
                _LastName,
                _CreatedAt,
                _Active,
                _Phone,
                _Contract,
                _Email,
                _Entity,
                _Department,
                _Position
            },
            process.env.JWT_SECRET_SEED_EMPLOYEE,
            { expiresIn: '1h' }
        )
    }

export const isValidToken = (token: string): Promise<string> => {
    if (!process.env.JWT_SECRET_SEED) {
        throw new Error('THERE IS NOT SEED');
    }

    if (token.length <= 10) {
        return Promise.reject('JWT NOT VALID');
    }

    return new Promise((resolve, reject) => {

        try {
            jwt.verify(token, process.env.JWT_SECRET_SEED || '', (err, payload) => {
                if (err) return reject('JWT NOT VALID');

                const { _id } = payload as { _id: string };

                resolve(_id);

            })
        } catch (error) {
            reject('JWT NOT VALID');
        }


    })

}

export const isAdmin = (token: string): Promise<string> => {
    if (!process.env.JWT_SECRET_SEED) {
        throw new Error('THERE IS NOT SEED');
    }

    if (token.length <= 10) {
        return Promise.reject('JWT NOT VALID');
    }

    return new Promise((resolve, reject) => {

        try {
            jwt.verify(token, process.env.JWT_SECRET_SEED || '', (err, payload) => {
                if (err) return reject('JWT NOT VALID');

                const { _isAdmin } = payload as { _isAdmin: string };

                resolve(_isAdmin);

            })
        } catch (error) {
            reject('JWT NOT VALID');
        }


    })

}

export const isValidTokenSecret = (tokenSecret: string): Promise<string> => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('THERE IS NOT SEED');
    }

    if (tokenSecret.length <= 10) {
        return Promise.reject('JWT NOT VALID');
    }

    return new Promise((resolve, reject) => {

        try {
            jwt.verify(tokenSecret, process.env.STRIPE_SECRET_KEY || '', (err, payload) => {
                if (err) return reject('JWT NOT VALID');

                const { _id } = payload as { _id: string };

                resolve(_id);

            })
        } catch (error) {
            reject('JWT NOT VALID');
        }


    })

}