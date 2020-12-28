import Product from '../models/product-model.js';
import mongoose from 'mongoose';

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createProduct = async (req, res) => {
    const product = req.body;
    const newProduct = new Product(product);
    const checkProduct = await Product.findById(product._id);
    try {
        if (checkProduct) {
            await Product.findByIdAndUpdate( product._id , product, { new: true } );
            res.status(201).json(product);
        }
        else {
            await newProduct.save();
            res.status(201).json(product);
        }        
    } catch (error) {
        console.log(error.message);
        res.status(409).json({ message: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No product with id: ${id}`);
    }
    await Product.findOneAndDelete({ _id: id });
    res.json({ message: "Product deleted successfully." });
}

export const envShow = (req, res) => {
    res.json(process.env.JWT_SECRET)
}