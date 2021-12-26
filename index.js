const express = require('express');
const fs= require('fs');
const app = express();
app.get('/',function(req,res){
    res.sendFile(__dirname+"/index.html");
});
app.get('/video',function(req,res){
    const range=req.headers.range;
    if(!range)
    {
        res.status(400).send("Requires Range header");
    }
    const videoPath="videoplayback.mp4";
    const videosize=fs.statSync("videoplayback.mp4").size;

    const ChunkSize=10**6;//1MB
    const start=Number(range.replace(/\D/g,""));
    const end=Math.min(start+ChunkSize,videosize-1);

    const contentLength = end - start +1;
    const headers={
        "Content-Range": `bytes ${start}-${end}/${videosize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
    res.writeHead(206,headers);

    const videostream=fs.createReadStream(videoPath,{start,end});
    videostream.pipe(res);
});
app.listen(8000,function(err){
    if(err)
    console.log("error in running server");
    else
    console.log("Server Running");
})