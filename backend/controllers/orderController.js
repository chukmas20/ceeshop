const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler")

// Create new Order
exports.newOrder = asyncHandler(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

//get single order
 exports.getSingleOrder = asyncHandler(async(req, res)=>{
     const order = await Order.findById(req.params.id).populate("user","name email");

     if(!order){
         return res.status(404).json({
             success:false,
             message:"Order not found"
         })
     }
     res.status(200).json({
         success:true,
         order
     })
 })

 //get logged in user orders
 exports.myOrders = asyncHandler(async(req, res)=>{
    const orders = await Order.find({user: req.user._id})

    res.status(200).json({
        success:true,
        orders
    })
})

 //get all orders --Admin
 exports.getAllOrders = asyncHandler(async(req, res)=>{
    const orders = await Order.find()

    let totalAmount = 0;

    orders.forEach((order)=>{
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
})

//update order status --Admin
exports.updateOrder = asyncHandler(async(req, res)=>{
    const order = await Order.findById(req.params.id)

    if(!order){
        return res.status(404).json({
            success:"false",
            message:"Order not found"
        }) 
    }

    if(order.orderStatus === "Delivered"){
        return res.status(400).json({
            success:"false",
            message:"Order has been delivered"
        })
    }

   if(req.body.status === "Shipped"){
    order.orderItems.forEach( async(o)=>{
        await  updateStock(o.product, o.quantity)
     })
   }

    order.orderStatus = req.body.status

    if(req.body.status ==="Delivered"){
        order.deliveredAt = Date.now()
    }
   
     await order.save({validateBeforeSave: false})
       res.status(200).json({
        success:true,
   })
})

async function updateStock(id, quantity){
    const product = await Product.findById(id)
    product.Stock-= quantity;

    await product.save({validateBeforeSave: false})
}

//Delete orders --Admin
exports.deleteOrder = asyncHandler(async(req, res)=>{
    const order = await Order.findById(req.params.id)

  if(!order){
       return res.status(404).json({
           success:false,
           message:"Order not found"
       })
  }

   await order.remove();

    res.status(200).json({
        success:true,
    })
})
