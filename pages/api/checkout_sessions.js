import { connect } from '../../config/db';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
export default async function handler(req, res) {

  const pool = await connect();
  switch (req.method) {
    case 'POST':
      return await savePaymenet(req, res, pool);

    case 'PUT':
      return await updatePaymenet(req, res, pool);
  }
}

const savePaymenet = async (req, res, pool) => {

  if (req.method === 'POST') {
    try {
      const { id } = req.body;
      await pool?.connect();
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        // line_items: [
        //   {
        //     // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        //     price: 'price_1M9yu9B9I3lJqpuMVeRFl1yB',
        //     quantity: 1,
        //   },
        // ],
        line_items: [
          {
            price_data: {
              currency: req.body.currency[0],
              unit_amount: (req.body.total) * 100,
              product_data: {
                name: "Invoice",
              },
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/invoice/?success=true&Invoice_Id=${id}`,
        cancel_url: `${req.headers.origin}/invoice/?canceled=true&Invoice_Id=${id}`,

      });

      const paymentIntent = await stripe.paymentIntents.confirm(session.id);
       console.log(paymentIntent)

      return res.status(200).json(session.url)

    } catch (err) {
      return res.status(err.statusCode || 500).json(err.message);

    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

const updatePaymenet = async (req, res, pool) => {
  try {

    const { Invoice_Id } = req.body;

    const [rows] = await pool.query(`UPDATE invoice SET PaymentMethod_Id = 2 WHERE Id = ${Invoice_Id}`);

    await pool?.end();

    return res.status(200).json(rows);
  }
  catch {
    await pool?.end();

    return res.status(400);

  }
}



