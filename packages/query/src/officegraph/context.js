module.exports = {
    log : function (txt,p1,p2,p3){
        console.log(txt,p1 ? p1: "",p2 ? p2: "",p3 ? p3: "")
    },
    done : function (err){
        if (err){
            console.log(err);
         //   process.exit(1)
        }else
        {
           console.log("Result",this.res)
        //   process.exit(0)
    }
    }
    
}
