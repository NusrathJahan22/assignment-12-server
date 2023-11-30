const express = require('express')
const cors = require('cors');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRITE_KEY)
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())




const uri = "mongodb+srv://surveyDB:8GSHmDOLxk6vbwQB@cluster0.dinkriz.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const survey = client.db('surveyDB').collection('survey')
        const users = client.db('surveyDB').collection('users')
        const payment = client.db('surveyDB').collection('payment')
        const cart1 = client.db('surveyDB').collection('cart1')

        // app.post('/jwt', async (req, res) => {
        //     const user = req.body;
        //     const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' }).payment
        //     res.send({ token })
        // })

        // app.post('/create-payment-intent', async (req, res) => {
        //     const { price } = req.body;
        //     const amount = parseInt(price * 100);
        //     const paymentIntent = await stripe.paymentIntents.create({
        //         amount: amount,
        //         currency: 'usd',
        //         payment_method_type: ['card']
        //     });
        //     res.send({
        //         clientSecret: payment.cilent_secret
        //     })
        // });

        // app.get('/payment/:email', verifyToken, async (req, res) => {
        //     const query = { email: req.params.email }
        //     if (req.params.email !== req.decoded.email) {
        //         return res.status(403).send({ message: 'forbidden assess' })
        //     }
        //     const result = await payment.find(query).toArray();
        //     res.send(result)
        // })

        // app.post('/payment', async (req, res) => {
        //     const payment = req.body;
        //     const paymentResult = await payment.insertOne(payment)

        //     // carefully delete each item from the cart
        //     console.log('payment info', payment)
        //     const query = {
        //         _id: {
        //             $in: payment.cartIds.map(id => new ObjectId(id))
        //         }
        //     }
        //     const deleteResult = await survey.deleteMany(query)
        //     res.send(paymentResult, deleteResult)

        // })


        app.post("/users", async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const existingUser = await users.findOne(query)
            if (existingUser) {
                return res.send({ message: "user already exist", insertedId: null })
            }
            const result = await users.insertOne(user);
            console.log(result)
            res.send(result)
        })

        app.get('/users', async (req, res) => {
            const result = await users.find().toArray()
            res.send(result)
        })
        app.get('/cart1', async (req, res) => {
            const result = await cart1.find().toArray()
            res.send(result)
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await users.deleteOne(query)
            res.send(result)
        })
        app.patch('/users/admin/:id' ,async(req,res)=>{
            const id =req.params.id
            const query= {_id: new ObjectId(id)}
            const updateDoc={
                $set:{
                    role:'admin'
                }
            }
            const result=await users.updateOne(query,updateDoc)
            res.send(result)
        })

        app.get('/survey', async (req, res) => {
            const result = await survey.find().toArray()
            res.send(result)
        })

        app.post("/survey", async (req, res) => {
            const user = req.body;
            //   console.log(user);
            const result = await survey.insertOne(user);
            console.log(result);
            res.send(result);
        });



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("server is rannig...")
})

app.listen(port, () => {
    console.log(`Simple Crud is Running on port ${port}`);
});
