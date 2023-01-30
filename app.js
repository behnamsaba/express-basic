const express = require("express");
const ExpressError = require('./express-error');
const app = express();


app.use(express.json());


function retriveNums(str){
    let strArr = str.split(',');
    return strArr.map(e => {
        return parseInt(e);
    })
}


app.get("/",function(req,res){
    return res.send("hello world");
});

app.get('/mean', function(req,res,next){
    try{
        if(! req.query.nums) {
            throw new ExpressError('nums are required',400);

        }
        let nums = retriveNums(req.query.nums);
        if(nums.includes(NaN)){
            throw new ExpressError('all input must be numbers',400);
        }
        let sum = nums.reduce((a,b) => {
            return a + b;
        })
        const resObj = {
            "response": {
                "operation": "mean",
                "value": sum / nums.length
              }
        }
        return res.json(resObj);
    }catch(e){
        next(e);
    }
})

app.get('/median', function(req,res,next){
    try{
        if(! req.query.nums) {
            throw new ExpressError('nums are required',400);
        
        }
        let value;
        let sortedNums = retriveNums(req.query.nums).sort((a,b) => {
            return a-b;
        });
        if(sortedNums.includes(NaN)){
            throw new ExpressError('all input must be numbers',400);
        }
        
        if(sortedNums.length % 2 === 0){
            value = (sortedNums[sortedNums.length/2]+ sortedNums[(sortedNums.length/2) - 1]) / 2;
        }else{
            value = sortedNums[Math.floor(sortedNums.length/2)];
        }
    
        const resObj = {
            "response": {
                "operation": "median",
                "value": value
              }
        }
    
        return res.json(resObj);

    }catch(e){
        next(e)
    }

})

app.get('/mode',function(req,res,next){
    try{
        if(! req.query.nums) {
            throw new ExpressError('nums are required',400);

        }

        let nums = retriveNums(req.query.nums);
        if(nums.includes(NaN)){
            throw new ExpressError('all input must be numbers',400);
        }
    
        let counts = {}
        nums.forEach(function(e) {
          if(counts[e] === undefined) {
            counts[e] = 0
          }
          counts[e] += 1
        })
        console.log(counts);
        let mostFrequent = Math.max(...(Object.values(counts)));
        let mode;
        if(mostFrequent === 1){
            throw new ExpressError('All elements are unique',400);
        }else{
            for(x in counts){
                if(counts[x] === mostFrequent){
                    mode = x;
        
                }
            }
        }
    
        const resObj = {
            "response": {
                "operation": "mode",
                "value": mode
              }
        }
    
        return res.json(resObj);

    }catch(e){
        next(e);
    }

});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
  
    return res.json({
      error: err,
      message: err.message
    });
  });

app.listen(3000,function(){
    console.log("APP ON PORT 3000");
});

