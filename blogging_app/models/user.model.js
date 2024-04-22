const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const { createTokenForUser } = require('../service/auth');
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    fullName : { type : String, required : true },
    email : { type : String, required : true, unique: true },
    password : { type : String, required : true },
    profileImgURL : { type : String, default : "/images/defaultAvatar.png" },
    role: { type : String , enum : ["USER", "ADMIN"],  default : "USER"}
}, 
    {timestamps : {createdAt : 'created_at', updatedAt: 'updated_at'}
})

// hash the password before the user is saved
userSchema.pre('save', function hashPassword(next) {
    const user = this;
    // hash the password only if the password has been changed or user is new
    if (!user.isModified('password')) {
      next();
      return;
    }
  
    // generate the hash
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
        if (err) {
            next(err);
            return;
        }
        // change the password to the hashed version
        user.password = hash;
        next();
    });
});

// Comparing Passwords
userSchema.statics.comparePasswordAndGenerateToken = async function(email, password) {
    
    const self = this;
    const user = await self.findOne({ email });
    if(!user) throw new Error('User not found!');

    const isMatched = await bcrypt.compare(password, user.password);
    if(!isMatched) throw new Error('Incorrect password!');
    const token = createTokenForUser(user);
    return token;
}

const User = mongoose.model('user', userSchema);

module.exports = User;