const express=require('express');
const app=express();
const session=require('express-session')
const path=require('path')
const bcrypt=require('bcryptjs');
const mongoose=require('mongoose');
const methodoverride=require('method-override');
const multer=require('multer');
const flash=require('connect-flash');
const credentails=require('./credential.js');
const Counter=require('./models/counter.js');
const Profile=require('./models/profiles');

var Twit=require('twit');

var T=new Twit({
    consumer_key:credentails.consumer_key,
    consumer_secret:credentails.consumer_secret,
    access_token:credentails.access_token,
    access_token_secret:credentails.access_token_secret
})
var tweets;

const gettweets=(nametweet)=>{

 return new Promise((resolve,reject)=>{

T.get('search/tweets',{q:nametweet ,count:1000, lang:'en',result_type:'recent',tweet_mode:'extended',exclude_replies:true,exclude:'retweets'},function(err,data,response){
 if(err){
    console.log('error',err);
 }else{
    
    resolve(data.statuses)
 }
})
})
}





mongoose.connect('mongodb+srv://admin-rohit:Test1234@cluster0.zpcsj.mongodb.net/quizapp');
app.set('view engine','ejs');
app.use(flash());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));
app.use(methodoverride('_method'));
app.use(session({
    secret:'notagoodsecret',
    resave:false,
    saveUninitialized:false
}));



const Storage=multer.diskStorage({
    destination:"./public/uploads",
    filename:(req,file,cb)=>{
        cb(null,Date.now() +path.extname(file.originalname));
    }
})

const upload=multer({
    storage:Storage
})




app.get('/login',async (req,res)=>{
        var ress=await Counter.find({});
        var totalviews=ress[0].totalviews;
        await Counter.updateOne({_id:ress[0].id},{totalviews:totalviews+1});
    res.render('login',{message:"",totalviews:totalviews});
})
app.get('/logout/:id',async(req,res)=>{
    var ress=await Counter.find({});
    var activeusers=ress[0].activeusers;
    await Counter.updateOne({_id:ress[0].id},{activeusers:activeusers-1});
    req.session.destroy();
    res.redirect('/login')
})
app.get('/home/:id',async(req,res)=>{
    if(req.session.userid){
        var {id}=req.params;
        var user;
        const users=await Profile.find({})
        for(let u of users){
            if(u.id==id) {
                user=u;
            }
        }
        var nametweet="india";
        tweets=await gettweets(nametweet);
        res.render('home',{id,user,tweets});
    }
    else res.redirect('login')
})
app.post('/home',async(req,res)=>{
    if(req.session.userid){
        var ress=await Counter.find({});
        var activeusers=ress[0].activeusers;
        var found=await Profile.find({});
        const {username,password}=req.body;
        var ok=0;
        var user;
        for(let f of found){
            if(f.username==username && await bcrypt.compare(password,f.password)){
                ok=1;
               found=f;
            }
        }
        user=found;
        const id=found.id;
        req.session.userid=id;
        var nametweet="india";
        tweets=await gettweets(nametweet);
        res.render('home',{id,user,tweets,activeusers});

    }else{
    const {username,password}=req.body;
    var found=await Profile.find({});
    var ok=0;
    var user;
    for(let f of found){
        if(f.username==username && await bcrypt.compare(password,f.password)){
            ok=1;
            found=f;
        }
        }
    
    if(ok===0){
         res.render('login',{message:"Invalid username/password"})
    }
    else {

        var ress=await Counter.find({});
        var activeusers=ress[0].activeusers;
        await Counter.updateOne({_id:ress[0].id},{activeusers:activeusers+1});
        
        user=found;
        const id=found.id;
        req.session.userid=id;
        var nametweet="india";
        tweets=await gettweets(nametweet);
        res.render('home',{id,user,tweets,activeusers});
        }
    }
})

app.get('/signup',(req,res)=>{
    res.render('signup.ejs',{message:""});
})

app.post('/signup',async (req,res)=>{
    const {username,password,email,epass}= req.body;
    const users=await Profile.find({});
    var usernames=[];
    for(let u of users){
        usernames.push(u.username)
    }
    if(password!=epass){
         res.render('signup',{message:"Password doesn't match"});
    }
    else if(password==""){
        res.render('signup',{message:"Password can't be empty"})
    }
    else if(usernames.includes(username.toString())){
        res.render('signup',{message:"Username already exits"});
    }
    else{
    const salt=await bcrypt.genSalt(10);
    const hashedpass=await bcrypt.hash(password,salt);
    await Profile.insertMany({username:username,password:hashedpass,email:email});
    var user=await Profile.find({username:username,password:hashedpass});
    const id=user[0].id
    req.session.userid=id;
    user=user[0];
    var nametweet="india";
    tweets=await gettweets(nametweet);
    res.render('home',{id,user,tweets});
    }
})

app.post('/newtweets/:id',async(req,res)=>{
    var {s}=req.body;
    if(s=='') {
        const {id}=req.params;
        const user=await Profile.findOne({id:id})
        nametweet='india';
        tweets=await gettweets(nametweet);
        res.render('home',{user,id,tweets});
    }
    else{
    const {id}=req.params;
    const user=await Profile.findOne({id:id})
    nametweet=s;
    tweets=await gettweets(nametweet);
    res.render('home',{user,id,tweets})
    }
})

app.get('/addfriend/:id',async(req,res)=>{
    if(req.session.userid){
    const {id}=req.params
    const users=await Profile.find({});
    const user=await Profile.findById(id);
    const fary=user.friends;
    const friends=[];
    for(let f of fary ) {
        friends.push(f.id);
    }
    res.render('userlist',{id,users,friends,user});
}
else res.render('login',{message:""})
})

app.post('/:id/add/:toad',async(req,res)=>{
    if(req.session.userid){
    const {id,toad}=req.params;
    await Profile.findByIdAndUpdate(id,{$push:{friends:{id:toad}}});
    const users=await Profile.find({});
    const user=await Profile.findById(id);
    const fary=user.friends;
    const friends=[];
    for(let f of fary ) {
        friends.push(f.id);
    }
    res.render('userlist',{id,users,friends,user});

   }
   else res.redirect('login')
})

app.delete('/:id/remove/:todel',async(req,res)=>{
    if(req.session.userid){
    const {id,todel}=req.params;
    await Profile.findByIdAndUpdate(id,{$pull:{friends:{id:todel}}});
    const users=await Profile.find({});
    const user=await Profile.findById(id);
    const fary=user.friends;
    const friends=[];
    for(let f of fary ) {
        friends.push(f.id);
    }
    res.render('userlist',{id,users,friends,user});
    }
    else res.redirect('login')})

app.get('/msg/:id',async(req,res)=>{
    if(req.session.userid){
    const {id}=req.params;
    const user=await Profile.findById(id);
    const users=await Profile.find({});
    const chats=user.chats;
    var chatsid=[];
    for(let c of chats){
        chatsid.push(c.id);
    }
    res.render('allchats',{id,users,chatsid,chats,user})
    }
    else res.redirect('login')
})

app.get('/chats/:id/:fid',async(req,res)=>{
    if(req.session.userid){
    const {id,fid}=req.params;
    const user=await Profile.findById(id);
    const farry=user.chats;
    var chatary=[];
    for(let friend of farry) {
        if(friend.id==fid) chatary=friend.chats;
    }
    res.render('chats',{chatary,id,fid,user});
}
else res.redirect('login')
})

app.patch('/:id/send/:fid',async(req,res)=>{
    if(req.session.userid){
    const {id,fid}=req.params;
    const {msg}=req.body;
    var user=await Profile.findById(id);
    var chatary=user.chats;
    var changed=false;
    for(let i=0; i<chatary.length; i++){
        if(chatary[i].id==fid) {
            changed=true;
            chatary[i].chats.push({sender:"own",msg:msg});
            await Profile.findByIdAndUpdate(id,{$set:{chats:chatary}});
            chatary=chatary[i].chats;
        }
    }
    if(changed==false) {
        chatary.push({id:fid,chats:[{sender:"own",msg:msg}]});
        await Profile.findByIdAndUpdate(id,{$set:{chats:chatary}});
        chatary=[{sender:"own",msg:msg}];
    } 
    
    
    var user=await Profile.findById(fid);
    var chatar=user.chats;
    var changed=false;
    for(let i=0; i<chatar.length; i++){
        if(chatar[i].id==id) {
            changed=true;
            chatar[i].chats.push({sender:"other",msg:msg});
            await Profile.findByIdAndUpdate(fid,{$set:{chats:chatar}});
        }
    }
    if(changed==false) {
        chatar.push({id:id,chats:[{sender:"other",msg:msg}]});
        await Profile.findByIdAndUpdate(fid,{$set:{chats:chatar}});
    }

    res.render('chats',{chatary,id,fid,user})
}
else res.redirect('login')
})

app.post('/setdp/:id',upload.single('img'),async(req,res)=>{
    if(req.session.userid){
    const {id}=req.params;
    const newimg={isavail:true,src:req.file.filename};
    await Profile.findByIdAndUpdate(id,{$set:{img:newimg}});
    const user=await Profile.findById(id)
    var nametweet="india";
    tweets=await gettweets(nametweet);
    res.render('home',{user,id,tweets})
    }
    else res.redirect('/login');
})

app.get('/viewdp/:img/:id',async(req,res)=>{
    if(req.session.userid){
    const {img,id}=req.params;
    const user=await Profile.findOne({id:id});
    res.render('viewdp',{img,user,id});
    }
    else res.redirect('/login')
})

let port = 3000;


app.listen(port,()=>{
    console.log("listening on port 3000");
});
