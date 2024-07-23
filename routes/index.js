var express = require('express');
var router = express.Router();
const productController = require('../mongo/product.controller')

// show sản phẩm ở trang chủ
router.get('/', async(req, res, next) =>{
  try {
      const product = await productController.gettAll();
      // return res.status(200).json({Product: product})
    // const aothun = await productController.getByCategory("65f7f82dfc13ae6bbf510e5d");
    // const aokhoac = await productController.getByCategory("65f7f82dfc13ae6bbf510e5e");
    // const balo = await productController.getByCategory("65f7f82dfc13ae6bbf510e5f");
    // const quan = await productController.getByCategory("65f7f82dfc13ae6bbf510e60");

    // return res.render("index", { product,aothun, aokhoac,balo,quan });
      // return res.render('index', {product : product})
    return res.status(200).json( product)
  } catch (error) {
      console.log('Load sản phẩm không thành công', error);
      res.status(500).json({mess : error})
  }
})



// bấm vào sản phẩm ở trang chủ chuyển qua trang chi tiết
router.get("/index/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productController.getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.render("product-detail", { product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});







// router.get('/aokhoac', async(req, res, next) =>{
//   try {

//     const aokhoac = await productController.getByCategory("65f7f82dfc13ae6bbf510e5e");
//     // return res.render("index", { product,aothun, aokhoac,balo,quan });
//       // return res.render('index', {product : product})
//     return res.status(200).json({ aokhoac : aokhoac})
//   } catch (error) {
//       console.log('Load sản phẩm không thành công', error);
//       res.status(500).json({mess : error})
//   }
// })
// router.get('/quan', async(req, res, next) =>{
//   try {

//     const quan = await productController.getByCategory("65f7f82dfc13ae6bbf510e60");
//     // return res.render("index", { product,aothun, aokhoac,balo,quan });
//       // return res.render('index', {product : product})
//     return res.status(200).json({ quan : quan})
//   } catch (error) {
//       console.log('Load sản phẩm không thành công', error);
//       res.status(500).json({mess : error})
//   }
// })

// router.get('/balo', async(req, res, next) =>{
//   try {

//     const balo = await productController.getByCategory("65f7f82dfc13ae6bbf510e5f");
//     // return res.render("index", { product,aothun, aokhoac,balo,quan });
//       // return res.render('index', {product : product})
//     return res.status(200).json({ balo : balo})
//   } catch (error) {
//       console.log('Load sản phẩm không thành công', error);
//       res.status(500).json({mess : error})
//   }
// })


// router.get("/", async (req, res) => {
//   try {
//     // const productAll = await productController.getAll();
//     const aothun = await productController.getByCategory("65f7f82dfc13ae6bbf510e5d");
//     const aokhoac = await productController.getByCategory("65f7f82dfc13ae6bbf510e5e");
//     const balo = await productController.getByCategory("65f7f82dfc13ae6bbf510e5f");
//     const quan = await productController.getByCategory("65f7f82dfc13ae6bbf510e60");
//     return res.render("index", { aothun, aoPolo, aokhoac,balo,quan });
//   } catch (error) {
//     res.status(500).json({ message: error });
//   }
// })





module.exports = router;
