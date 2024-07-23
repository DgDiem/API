

// kết nối collection categories

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId // khóa chính id

const categorySchema = new Schema({
    // id : {type : ObjectId, required : true},
    name : {type : String, require : true}, // require true là bắt buộc ---- fasle là ko bắt buộc
    description : {type : String, require : true},

})

module.exports = mongoose.models.categories || mongoose.model('categories', categorySchema) // kiển tra xem nó tồn tại cái model chưa, nếu chưa thì thêm vào