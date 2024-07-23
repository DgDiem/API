// kết nối collection categories

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId; // khóa chính id

const productSchema = new Schema({
  name: { type: String, required: true },
  image1: { type: String, required: true },
  image2: { type: String, required: false },
  image3: { type: String, required: false },
  image4: { type: String, required: false },
  price1: { type: Number, required: true },
  price2: { type: Number, required: false },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  sale: { type: Number, required: false },
  hot: { type: Number, required: false },
  view: { type: Number, required: false },
  publish: {
    type: {
      publishId: { type: ObjectId, required: true },
      publishName: { type: String, required: true },
    },
    required: true,
  },
  author: {
    type: {
      authorId: { type: ObjectId, required: true },
      authorName: { type: String, required: true },
    },
    required: true,
  },
  category: {
    type: {
      categoryId: { type: ObjectId, required: true },
      categoryName: { type: String, required: true },
    },
    required: true,
  },
});

module.exports =
  mongoose.models.pros || mongoose.model("products", productSchema); // kiển tra xem nó tồn tại cái model chưa, nếu chưa thì thêm vàos
