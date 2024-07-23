// kết nối collection publish

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId; // khóa chính id

const publishSchema = new Schema({
  name: { type: String, require: true }, // require true là bắt buộc ---- fasle là ko bắt buộc
  description: { type: String, require: true },
});

module.exports =
  mongoose.models.publish || mongoose.model("publish", publishSchema); // kiển tra xem nó tồn tại cái model chưa, nếu chưa thì thêm vào
