import encrypt from 'mongoose-encryption';
import mongoose from 'mongoose';

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema  = new mongoose.Schema({
    userName: String,
    userPassword: String
});

const secret = "SomeSecretStringCode";
userSchema.plugin(encrypt, { secret: secret ,encryptedFields: ['userPassword']});

const User = new mongoose.model("User",userSchema);

const user =  await User.findOne({userName: "1@2.com"});
console.log(user.userName);
console.log(user.userPassword);

mongoose.connection.close();