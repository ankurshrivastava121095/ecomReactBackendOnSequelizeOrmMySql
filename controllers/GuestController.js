const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const UserModel = require('../models/User');
const CartModel = require('../models/Cart');
const jwt = require('jsonwebtoken');

class GuestController {
    static register = async (req, res) => {
        try {
            const {
                name,
                userName,
                phone,
                email,
                password,
                role,
                dob,
                city,
                state,
                country,
                postalCode,
            } = req.body;

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            const user = await UserModel.create({
                name: name,
                userName: userName,
                phone: phone,
                email: email,
                password: hashPassword,
                role: role,
                dob: dob,
                city: city,
                state: state,
                country: country,
                postalCode: postalCode,
            });

            res.status(201).json({
                status: 'success',
                message: 'Registration Successful!',
                user,
            });
        } catch (err) {
            res.status(401).json({ status: 'failed', message: err.message });
        }
    };

    static login = async (req, res) => {
        try {
            const { email, password, cartItems } = req.body;
            // console.log(req.body);

            if (email && password) {
                const user = await UserModel.findOne({
                    where: { email },
                });

                if (user) {
                const isPasswordMatched = await bcrypt.compare(password, user.password);

                    if (isPasswordMatched) {
                        // check user in cart starts
                        if (user.role == 'customer' && cartItems.length != 0) {
                            await Promise.all(cartItems.map(async (cartItem) => {
                                const productId = parseInt(cartItem.productId, 10);
                                const [existingCartItem, created] = await CartModel.findOrCreate({
                                    where: {
                                        userId: user.id,
                                        productId: productId,
                                    },
                                    defaults: {
                                        quantity: cartItem.quantity,
                                        productName: cartItem.productName,
                                        productPrice: cartItem.productPrice,
                                        productImage: cartItem.productImage,
                                    },
                                });
                            
                                if (!created) {
                                    // Update existing cart item
                                    await existingCartItem.update({
                                        quantity: existingCartItem.quantity + cartItem.quantity,
                                    });
                                }
                            }));
                        }
                        // check user in cart ends

                        const carts = await CartModel.findAll({
                            where: { userId: user.id },
                        });
                        const cartProducts = carts.length !== 0 ? carts : [];

                        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY);

                        res.cookie('token', token);

                        res.status(201).json({
                            status: 'success',
                            message: 'Login Successfully with Web Token!',
                            token,
                            user,
                            cartProducts,
                        });
                    } else {
                        res.status(401).json({ status: 'failed', message: 'Invalid password' });
                    }
                } else {
                    res.status(401).json({ status: 'failed', message: 'User not Found!' });
                }
            } else {
                res.status(401).json({ status: 'failed', message: 'All Fields are required!' });
            }
        } catch (err) {
            res.status(401).json({ status: 'failed', message: err.message });
        }
    };

    static logout = async (req, res) => {
        try {
            res.clearCookie('token');

            res.status(201).json({ success: true, message: 'Logged Out' });
        } catch (err) {
            res.status(401).json({ status: 'failed', message: err.message });
        }
    }
}

module.exports = GuestController;