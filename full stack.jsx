const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const registerCompany = async (companyName, ownerName, ownerEmail, rollNo, accessCode) => {
    try {
        const response = await axios.post('http://20.244.56.144/test/register', {
            companyName,
            ownerName,
            ownerEmail,
            rollNo,
            accessCode
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to register company');
    }
};

const getAuthToken = async (companyName, clientID, clientSecret, ownerName, ownerEmail, rollNo) => {
    try {
        const response = await axios.post('http://20.244.56.144/test/auth', {
            companyName,
            clientID,
            clientSecret,
            ownerName,
            ownerEmail,
            rollNo
        });
        return response.data.access_token;
    } catch (error) {
        throw new Error('Failed to obtain authorization token');
    }
};
app.get('/categories/:categoryname/products', async (req, res) => {
    try {
        const { companyname, categoryname } = req.params;
        const { top, minPrice, maxPrice, sort } = req.query;

        // Fetch products from the test server
        const response = await axios.get(`http://20.244.56.144/test/companies/${companyname}/categories/${categoryname}/products`, {
            params: {
                top,
                minPrice,
                maxPrice,
                sort
            }
        });

        const productsWithId = response.data.map(product => ({
            ...product,
            productId: uuidv4()
        }));

        res.json(productsWithId);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/categories/:categoryname/products/:productid', async (req, res) => {
    try {
        const { categoryname, productid } = req.params;

     
        const productDetails = {
            productId: productid,
            productName: 'Sample Product',
            price: 100,
            rating: 4.5,
            discount: 10,
            availability: 'yes'
        };

        res.json(productDetails);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    try {
        // Register and get authorization token for the company
        const { companyName, clientID, clientSecret, ownerName, ownerEmail, rollNo, accessCode } = await registerCompany('goMart', 'Rahul', 'rahul@abc.edu', '1', 'FKDLjg');
        const authToken = await getAuthToken(companyName, clientID, clientSecret, ownerName, ownerEmail, rollNo);
        console.log(`Server is running on port ${PORT}`);
        console.log(`Authorization token: ${authToken}`);
    } catch (error) {
        console.error(error.message);
    }
});
