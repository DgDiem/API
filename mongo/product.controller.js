const productModel = require("./product.model");
const categoryModel = require("./categories.model");
const publishModel = require("./publish.model");
const authorModel = require("./author.model");
module.exports = {
  insert,
  gettAll,
  updateById,
  remove,
  getNew,
  getById,
  search,
  getHot,
  getRelated,
  getDecrease,
  getAscending,
  getSale,
};

// Thêm sản phẩm
async function insert(body) {
  try {
    const {
      name,
      publish,
      author,
      image1,
      image2,
      image3,
      image4,
      price1,
      price2,
      description,
      quantity,
      sale,
      hot,
      view,
      category,
    } = body;

    // Tìm và kiểm tra danh mục
    const categoryFind = await categoryModel.findById(category);
    if (!categoryFind) {
      throw new Error("Không tìm thấy danh mục");
    }
    const publishFind = await publishModel.findById(publish);
    if (!publishFind) {
      throw new Error("Không tìm thấy publish");
    }
    const authorFind = await authorModel.findById(author);
    if (!authorFind) {
      throw new Error("Không tìm thấy publish");
    }
    // Tạo đối tượng sản phẩm mới
    const proNew = new productModel({
      name,

      image1,
      image2,
      image3,
      image4,
      price1,
      price2,
      description,
      quantity,
      sale,
      hot,
      view,
      category: {
        categoryId: categoryFind._id,
        categoryName: categoryFind.name,
      },
      publish: {
        publishId: publishFind._id,
        publishName: publishFind.name,
      },
      author: {
        authorId: authorFind._id,
        authorName: authorFind.name,
      },
    });

    // Lưu vào cơ sở dữ liệu
    const result = await proNew.save();
    return result;
  } catch (error) {
    console.log("Lỗi", error);
    throw error;
  }
}

//Hiển thị tất cả sản phẩm
async function gettAll() {
  try {
    const result = await productModel.find().limit(16);
    return result;
  } catch (error) {
    console.log("Thêm sản phẩm không thành công", error);
    throw error;
  }
}

// Sửa sản phẩm
async function updateById(id, body) {
  try {
    const pro = await productModel.findById(id);
    if (!pro) {
      throw new Error("Không tìm thấy sản phẩm");
    }
    const {
      name,
      publish,
      author,
      image1,
      image2,
      image3,
      image4,
      price1,
      price2,
      description,
      quantity,
      category,
    } = body;

    let cateFind = null;
    if (category) {
      cateFind = await categoryModel.findById(category);
      if (!cateFind) {
        throw new Error("Không tìm thấy danh mục");
      }
    }

    const cateUpdate = cateFind
      ? {
          categoryId: cateFind._id,
          categoryName: cateFind.name,
        }
      : pro.category;

    const result = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        publish,
        author,
        image1,
        image2,
        image3,
        image4,
        price1,
        price2,
        description,
        quantity,
        category: cateUpdate,
      },
      { new: true }
    );
    return result;
  } catch (error) {
    console.log("Sửa sản phẩm không thành công", error);
    throw error;
  }
}

// Xóa sản phẩm
async function remove(id) {
  try {
    const result = await productModel.findByIdAndDelete(id);
    return result;
  } catch (error) {
    console.log("Lỗi xóa sản phẩm theo id", error);
    throw error;
  }
}

// Sản phẩm mới nhất
async function getNew() {
  try {
    const result = await productModel.find().sort({ _id: -1 }).limit(4);
    return result;
  } catch (error) {
    console.log("Lỗi sản phẩm mới nhất", error);
    throw error;
  }
}

//Sản phẩm hot
async function getHot() {
  try {
    const result = await productModel.find({ hot: 1 }).limit(4);
    return result;
  } catch (error) {
    console.log("Lỗi sản phẩm hot", error);
    throw error;
  }
}

//Sản phẩm sale
async function getSale() {
  try {
    const result = await productModel.find({
      price2: { $ne: null, $exists: true, $ne: "" },
      $expr: { $lt: ["$price2", "$price1"] },
    });
    return result;
  } catch (error) {
    console.log("Lỗi sản phẩm sale", error);
    throw error;
  }
}

//Chi tiết sản phẩm
async function getById(id) {
  try {
    const proId = await productModel.findById(id);
    return proId;
  } catch (error) {
    console.log("LỖI LAAYS CHI TIẾT SP", error);
    throw error;
  }
}

// Sản phẩm liên quan
async function getRelated(id) {
  try {
    // Tìm sản phẩm với productId được cung cấp
    const product = await productModel.findById(id);
    // Trích xuất categoryId từ sản phẩm tìm được
    const categoryId = product.category.categoryId;

    // Tìm tất cả các sản phẩm trong cùng một category
    const relatedProducts = await productModel
      .find({
        "category.categoryId": categoryId,
        _id: { $ne: id }, // loại trừ sản phẩm hiện tại
      })
      .limit(4);
    console.log("Related Products in controller:", relatedProducts); // Kiểm tra kết quả trả về từ database

    return relatedProducts;
  } catch (error) {
    console.log("Lỗi lấy sản phẩm liên quan", error);
    throw error;
  }
}

//Tìm kiếm sản phẩm theo  tên
async function search(name) {
  try {
    const result = await productModel.find(
      {
        name: { $regex: name, $options: "i" }, // i :không phân biệt hoa thường
      },
      {
        name: 1,
        image1: 1,
        author: 1,
        publish: 1,
        price1: 1,
        price2: 1,
      }
    );
    return result;
  } catch (error) {
    console.log("Lỗi lấy sp", error);
    throw error;
  }
}

//Lọc giá giản phẩm giảm dần
async function getDecrease() {
  try {
    const result = await productModel.find().sort({ price: -1 }); // -1 laf giamr daanf
    return result;
  } catch (error) {
    console.log("Lỗi lấy sp", error);
    throw error;
  }
}

//Lọc giả sản phẩm tăng dần
async function getAscending() {
  try {
    const result = await productModel.find().sort({ price: 1 });
    return result;
  } catch (error) {
    console.log("Lỗi lấy sp theo key", error);
    throw error;
  }
}
