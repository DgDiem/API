// kết nối collection author

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId; // khóa chính id

const authorSchema = new Schema({
  name: { type: String, require: true }, // require true là bắt buộc ---- fasle là ko bắt buộc
  description: { type: String, require: false },
});

module.exports =
  mongoose.models.author || mongoose.model("author", authorSchema); // kiển tra xem nó tồn tại cái model chưa, nếu chưa thì thêm vào
