var express = require("express");
var router = express.Router();
const productController = require("../mongo/product.controller");
const multer = require("multer");
const checktoken = require("../helper/checktoken");
const upload = require("../helper/upload");
const path = require("path");

// Thêm sản phẩm
// Thêm sản phẩm phải có Formdata ,multipart/form-data, và input file
// Thêm hình : mỗi hình một input có name là image1234 => Hình sẽ được lưu trong public/images của backend
router.post(
  "/",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const body = req.body;

      // Kiểm tra nếu image1 có tồn tại
      if (!req.files["image1"]?.length) {
        return res.status(400).json({ mess: "Bắt buộc phải có hình ảnh 1" });
      }

      body.image1 = req.files["image1"][0].filename;
      body.image2 = req.files["image2"]?.[0]?.filename || null;
      body.image3 = req.files["image3"]?.[0]?.filename || null;
      body.image4 = req.files["image4"]?.[0]?.filename || null;

      const result = await productController.insert(body);
      return res.status(200).json(result);
    } catch (error) {
      console.log("Thêm sản phẩm không thành công", error);
      res.status(500).json({ mess: error.message });
    }
  }
);

//Router Hiển thị tất cả sản phẩm
router.get("/", async (req, res) => {
  try {
    const product = await productController.gettAll();
    return res.status(200).json({ Product: product });
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

//Router hiển thị sản phẩm mới nhất
router.get("/new", async (req, res) => {
  try {
    const product = await productController.getNew();
    return res.status(200).json(product);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

//Router hiển thị sản phẩm nhiều lượt xem
router.get("/view", async (req, res) => {
  try {
    const product = await productController.getProView();
    return res.status(200).json(product);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

//Router Sửa sản phẩm
router.put(
  "/:id",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const body = req.body;

      // Kiểm tra xem có tệp tin ảnh được gửi lên hay không
      if (req.files) {
        if (req.files["image1"]) body.image1 = req.files["image1"][0].filename;
        if (req.files["image2"]) body.image2 = req.files["image2"][0].filename;
        if (req.files["image3"]) body.image3 = req.files["image3"][0].filename;
        if (req.files["image4"]) body.image4 = req.files["image4"][0].filename;
      }

      // Cập nhật sản phẩm chỉ với các trường được gửi lên
      const proUpdate = await productController.updateById(id, body);
      return res.status(200).json({ ProductUpdate: proUpdate });
    } catch (error) {
      console.log("Lỗi update sản phẩm theo id", error);
      return res.status(500).json({ mess: error.message });
    }
  }
);

//Router xóa sản phẩm

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params; // lấy đượccái id mà người dùng gửi lên
    const proDel = await productController.remove(id);
    console.log("Xóa sp thành công");
    return res.status(200).json({ ProducDelete: proDel });
  } catch (error) {
    console.log("lỗi xóa sp theo id", error);
    return res.status(500).json({ mess: error });
  }
});

//Router hiển thị sản phẩm mới nhất
router.get("/new", async (req, res) => {
  try {
    const product = await productController.getNew();
    return res.status(200).json(product);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

//Router hiển thị sản phẩm hot
router.get("/hot", async (req, res) => {
  try {
    const product = await productController.getHot();
    return res.status(200).json(product);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

//Router chi tiết sản phẩm
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; // lấy được cái id mà người dùng gửi lên
    const pro = await productController.getById(id);
    // return pro
    return res.status(200).json(pro);
  } catch (error) {
    console.log("lỗi lay chi tiet sp", error);
    return res.status(500).json({ mess: error });
  }
});

//Router hiển thị sản phẩm liên quan
router.get("/related/:id/related", async (req, res) => {
  try {
    const { id } = req.params; // Lấy id của sản phẩm từ URL
    console.log("Product ID:", id); // Kiểm tra xem id đã được lấy đúng chưa
    const relatedProducts = await productController.getRelated(id);
    console.log("Related Products:", relatedProducts); // Kiểm tra kết quả trả về từ controller
    return res.status(200).json(relatedProducts);
  } catch (error) {
    console.log("Lỗi lấy sản phẩm liên quan theo danh mục", error);
    return res.status(500).json({ message: error.message });
  }
});

//Router tìm kiếm sản phẩm
router.get("/search/:name", async (req, res) => {
  try {
    const name = req.params.name; // Lấy tên sản phẩm từ route param
    const pro = await productController.search(name); // Gọi hàm search với tên sản phẩm
    return res.status(200).json(pro);
  } catch (error) {
    console.log("Lỗi tìm kiếm sản phẩm", error);
    return res.status(500).json({ mess: error });
  }
});

//Router lọc sản phẩm tăng dần
//http://localhost:3000/products/sort/asc
router.get("/sort/asc", async (req, res) => {
  try {
    const product = await productController.getAscending();
    return res.status(200).json(product);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

//Router lọc sản phẩm giảm dần
//http://localhost:3000/products/sort/desc
router.get("/sort/desc", async (req, res) => {
  try {
    const product = await productController.getDecrease();
    return res.status(200).json(product);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

//Router sản phẩm sale
//http://localhost:3000/products/sort/sale
// Sản phẩm sale dựa vào giá, nếu sản phẩm nào có price 2 thì mới show
router.get("/sort/sale", async (req, res) => {
  try {
    const products = await productController.getSale();
    return res.status(200).json({ ProductsSale: products });
  } catch (error) {
    console.log("Load sản phẩm sale không thành công", error);
    res.status(500).json(error);
  }
});

module.exports = router;
