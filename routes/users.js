var express = require('express');
var router = express.Router();
const usersController = require('../mongo/user.controller');
const checktoken = require('../helper/checktoken');
const jwt = require('jsonwebtoken'); // Import thư viện jsonwebtoken

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });


router.get('/', async(req, res) =>{
  try {
      const users = await usersController.gettAll()
      return res.status(200).json({LoadUsers: users})
  } catch (error) {
      console.log('Load user không thành công', error);
      res.status(500).json({mess : error})
  }
})


// them user mơi

router.post('/', async(req, res)=>{
  try {
      const body = req.body
      const result = await usersController.register(body)
      return res.status(200).json(result)
  } catch (error) {
      console.log('Thêm user không thành công', error);
      res.status(500).json({mess : error})
  }
})




// viết routing cho lấy sp theo key
//http://localhost:3000/product/key/value
// router.get('/:key/:value', async(req, res) =>{
//     try {
//         const {key , value} = req.params
//         const pro = await productController.getByKey(key, value)
//         return res.status(200).json({Productkey : pro})
//     } catch (error) {
//         console.log('lỗi lấy sp theo key', error);
//         return res.status(500).json({mess: error})
//     }
// })



//routing cập nhật sản phẩm theo id
router.put('/:id', async (req, res ) =>{
  try {
      const {id} = req.params;
      const body = req.body;
      const userUpdate = await usersController.updateById(id, body);
      return res.status(200).json({userUpdate : userUpdate});

  } catch (error) {
      console.log('lỗi update user ', error);
      return res.status(500).json({mess: error})
  }
})


//routing xóa danh mục theo id

router.delete('/:id', async(req, res) => {
  try {
      const {id} = req.params; // lấy đượccái id mà người dùng gửi lên
      const userDel = await usersController.remove(id);
      console.log('Xóa user thành công');
      return res.status(200).json({UserDelete: userDel});
  } catch (error) {
      console.log('lỗi xóa user theo id', error);
      return res.status(500).json({mess: error})
  }
})


router.post('/login', async(req, res)=>{
  try {
    const body = req.body
    const result = await usersController.login(body)
    return res.status(200).json(result)
  } catch (error) {
    console.log('lỗi đăng nhập', error);
    return res.status(500).json({mess: error})
  }
})
router.post('/refresh-token', async(req, res) => {
  try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
          throw new Error('Refresh token không tồn tại');
      }

      // Xác thực refreshToken
      jwt.verify(refreshToken, 'refresh_token_secret', (error, decoded) => {
          if (error) {
              throw new Error('Refresh token không hợp lệ');
          } else {
              // Tạo accessToken mới
              const user = decoded;
              const accessToken = jwt.sign(
                  { _id: user._id, email: user.email, role: user.role },
                  'access_token_secret',
                  { expiresIn: '1m' }
              );

              // Trả về accessToken mới
              return res.status(200).json({ user , accessToken: accessToken , refreshToken : refreshToken });
          }
      });
  } catch (error) {
      console.log('Lỗi refresh token:', error);
      return res.status(500).json({ mess: error.message });
  }
});

module.exports = router;
