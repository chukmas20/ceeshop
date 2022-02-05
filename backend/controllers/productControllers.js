const Product = require("../models/productModel")
const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");





// Create Product -- Admin
exports.createProduct = asyncHandler(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get All Product (Admin)
exports.getAdminProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// // create product
// exports.createProduct = asyncHandler(async (req, res) =>{
//     req.body.user = req.user.id
//     const product  = await Product.create(req.body)
//     res.status(201).json({
//         success:true,
//         product
//     })
// })
// get all products
exports.getAllProducts = asyncHandler(async (req, res) =>{
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
     
    let products = await apiFeature.query;

    let filteredProductsCount = products.length;
  
    apiFeature.pagination(resultPerPage);
  
    products = await apiFeature.query.clone();

    res.status(200).json({
      success: true,
      products,
      productsCount,
      resultPerPage,
      filteredProductsCount,
    });
   
  })

//get Product details
exports.getProductDetails = asyncHandler(async (req, res)=>{
    const product = await Product.findById(req.params.id)

    if(!product){
        return  res.status(500).json({
            success: false,
            message:"product not found",
            // productsCount
        })
        
    }
    res.status(200).json({
        success:true,
        product
    })
})

//update product --admin only

exports.updateProduct = asyncHandler(async(req, res) =>{
    
    let product = await Product.findById(req.params.id)
    if(!product){
        return res.status(500).json({
            success: false,
            message:"product not found"
        })
    }

    // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

    product = await Product.findByIdAndUpdate(req.params.id, req.body,
          {new:true, runValidators:true, useFindAndModify:false}
    )
     res.status(200).json({
         success:true,
         product
     })
})

// Delete Product

exports.deleteProduct = asyncHandler(async(req, res)=>{
    const product = await Product.findById(req.params.id)
    if(!product){
        return res.status(500).json({
            success: false,
            message:"Product not found"
        })
    }

     // Deleting Images From Cloudinary
     for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }


    await product.remove();
    res.status(200).json({
        success:true,
        message:"Product Removed successfully"
    })
})

//Create new review or update review

exports.createProductReview = asyncHandler(async(req,res)=>{
    const {rating, comment, productId} = req.body;
     const review ={
         user:req.user._id,
         name:req.user.name,
         rating:Number(rating),
         comment
     }
     const product = await Product.findById(productId);

     const isReviewed = product.reviews.find(
       (rev) => rev.user.toString() === req.user._id.toString()
     );
   
     if (isReviewed) {
       product.reviews.forEach((rev) => {
         if (rev.user.toString() === req.user._id.toString())
           (rev.rating = rating), (rev.comment = comment);
       });
     } else {
       product.reviews.push(review);
       product.numOfReviews = product.reviews.length;
     }
   
     let avg = 0;
   
     product.reviews.forEach((rev) => {
       avg += rev.rating;
     });
   
     product.ratings = avg / product.reviews.length;
   
     await product.save({ validateBeforeSave: false });
   
     res.status(200).json({
       success: true,
     });
})

//Get all product reviews

exports.getAllProductReviews = asyncHandler(async(req,res)=>{
    const product = await Product.findById(req.query.id)

    if(!product){
        return res.status(404).json({
            success:false,
            message:"Product not found"            
        })
    }
    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
})

// Delete Review

exports.deleteReview = asyncHandler(async(req, res)=>{
    const product = await Product.findById(req.query.productId);

    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });

})
