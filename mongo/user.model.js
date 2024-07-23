// kết nối collection categories

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId // khóa chính id

const userSchema = new Schema({
    name : {type : String, require : true}, // require true là bắt buộc / fasle là ko bắt buộc
    pass : {type : String , require : true}, 
    phone :{type : String, require : true},
    email : {type : String , require : true}, 
    address : {type : String , require : true}, 
    role : {type : Number , require : true , default : 0}, 
  
})

module.exports = mongoose.models.users || mongoose.model('users', userSchema) // kiển tra xem nó tồn tại cái model chưa, nếu chưa thì thêm vàos