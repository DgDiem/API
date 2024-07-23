// thực hiện thao tác CRUD với monggo

// const productModel = require('./product.model')
const publishModel = require("./publish.model");
const productModel = require("./product.model");
// const categoriesModel = require('./categories.model');
module.exports = {
  gettAll,
  insert,
  updateById,
  getBypublish,
  getpublishByName,
  deleteCate,
  getById,
}; // ,, getByKey, updateById, remove

// xử lí dữ liệu ở contronller

async function gettAll() {
  try {
    const result = await publishModel.find();
    return result;
  } catch (error) {
    console.log("Lỗi lấy sp", error);
    throw error;
  }
}

async function getBypublish(publish) {
  try {
    const productspublish = await productModel.find({
      "publish.publishId": publish,
    });
    return productspublish;
  } catch (error) {
    console.log("Lỗi lấy sản phẩm  theo ID danh mục", error);
    throw error;
  }
}

async function getpublishByName(publishName) {
  try {
    const publish = await publishModel.findOne({ name: publishName });
    return publish;
  } catch (error) {
    throw error;
  }
}

// thêm danh mục

async function insert(body) {
  try {
    const { name, description } = body;
    console.log("publish Name:", name);
    console.log("publish Mô tả:", description);

    const cateNew = new publishModel({ name, description });
    const result = await cateNew.save();
    return result;
  } catch (error) {
    console.error("Lỗi:", error);
    throw error;
  }
}

// cập nhật danh mục theo id

async function updateById(id, body) {
  try {
    const cate = await publishModel.findById(id);
    if (!cate) {
      throw new Error("Không tìm thấy danh mục");
    }
    const { name, description } = body;
    const result = await publishModel.findByIdAndUpdate(id, {
      name,
      description,
    });
    return result;
  } catch (error) {
    console.log("lỗi update", error);
    throw error;
  }
}

// xóa danh mục theo id
async function deleteCate(id) {
  try {
    // kiểm tra xem trong danh mục có sản phẩm nào không
    const pros = await productModel.find({ "publish.publishId": id });
    if (pros.length > 0) {
      return { mess: "Danh mục có sản phẩm không thể xóa" };
    } else {
      const result = await publishModel.findByIdAndDelete(id);
      return result;
    }
  } catch (error) {
    console.log("LỖI XÓA DANH MỤC THEO ID", error);
    throw error;
  }
}

// xóa danh mục theo id
// async function remove(id) {
//     try {
//         const result = await publishModel.findByIdAndDelete(id);
//         return result;
//     } catch (error) {
//         console.log('LỖI XÓA DANH MỤC THEO ID', error);
//         throw error;
//     }

// }

async function getById(id) {
  try {
    const proId = await publishModel.findById(id);
    return proId;
  } catch (error) {
    console.log("LỖI LAAYS CHI TIẾT SP", error);
    throw error;
  }
}
