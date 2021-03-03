const Product = require('../models/product')
const slugify = require('slugify')

exports.create = async(req, res) => {
    try{
        console.log(req.body);
        req.body.slug = slugify(req.body.title);
        const newProduct = await new Product(req.body).save()
        await res.json(newProduct);
    }
    catch (err) {
        console.log(err);
        //res.status(400).send("Create product failed");
        await res.status(400).json({
            err: err.message,
        })
    }
};

exports.listAll = async (req, res) => {
    let products = await Product.find({})
        .limit(parseInt(req.params.count))
        .populate('category')
        .populate('subs')
        .sort([['createAt', 'desc']])
        .exec();
    await res.json(products);
};

exports.remove = async(req, res) => {
    try{
        const deleted = await Product.findOneAndRemove({slug: req.params.slug}).exec();
        await res.json(deleted);
    }
    catch(err){
        console.log(err)
        return res.status(400).send('Product delete failed')
    }
}

exports.read = async(req, res) => {
    const product = await Product.findOne({slug: req.params.slug})
        .populate('category')
        .populate('subs')
        .exec();
    await res.json(product);
}

exports.update = async (req, res) => {
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const updated = await Product.findOneAndUpdate(
            {slug: req.params.slug},
            req.body,
            {new: true}
            ).exec();
        await res.json(updated);
    }
    catch (err) {
        console.log('PRODUCT UPDATE ERROR ----> ',err)
        /*return res.status(400).send('Product update failed')*/
        await res.status(400).json({
            err: err.message,
        });
    }
}
//WITHOUT PAGINATION

/*exports.list = async(req, res) => {
    try{
        // createdAt/updatedAt, desc/asc, 3
        const {sort, order, limit} = req.body
        const products = await Product.find({})
            .populate('category')
            .populate('subs')
            .sort([[sort, order]])
            .limit(limit)
            .exec();

        await res.json(products);
    }
    catch(err){
        console.log(err)
    }
};*/

exports.list = async(req, res) => {
    try{
        // createdAt/updatedAt, desc/asc, 3
        const {sort, order, page} = req.body;
        const currentPage = page || 1
        const perPage = 3

        const products = await Product.find({})
            .skip((currentPage - 1) * perPage)
            .populate('category')
            .populate('subs')
            .sort([[sort, order]])
            .limit(perPage)
            .exec();

        await res.json(products);
    }
    catch(err){
        console.log(err)
    }
};

exports.productsCount = async (req, res) => {
    let total = await Product.find({}).estimatedDocumentCount().exec();
    await res.json(total);
};