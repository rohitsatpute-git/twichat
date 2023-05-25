const mongoose=require('mongoose');

const counterschema=new mongoose.Schema({
    activeusers:{
        type:Number
    }
        ,
    totalviews:{
        type:Number
    }
});

const Counter= mongoose.model('Counter',counterschema);

module.exports=Counter;
