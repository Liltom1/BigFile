//web Woker浏览器的多线程脚本
//web worker 是运行在后台的js 不会阻塞页面
//可以进行计算 可以进行IO操作 但是不能进行DOM操作
//web worker 不能访问window对象 不能访问document对象
//self 代表当前的worker web worker 的全局作用域
self.importScripts('../spark-md5.min.js') //加载外部脚本 这些脚本代码可以在worker中执行
console.log(self,'self');

self.onmessage = function (e) {
    console.log(e.data, 'e.data')
    const { chunks, filename } = e.data;
    const spark = new self.SparkMD5.ArrayBuffer(); //计算MD5
    let currentChunk = 0;
    //需要把blob 转成 ArrayBuffer
    function loadNext() {
        const reader = new FileReader(); //各种格式转换base64 blob arraybuffer file
        reader.onload = function (e) {
            spark.append(e.target.result); //将数据 （每个切片）添加到spark中 MD5实例中
            currentChunk++;
            if (currentChunk < chunks.length) {
                loadNext();
            } else {
                //web Worker 可以发送消息给主线程
                self.postMessage({
                    filename,
                    hash: spark.end(), //递归完成后 整个文件会生成MD5  一整个文件的md5
                })
            }
        }
        //读取文件 将文件转化为ArrayBuffer处理
        //1.在处理大文件时，将文件读取为ArrayBuffer 比DataURL或Blob更加高效，可以减少内存的使用和提高计算速度‌
        //2.所以在MD5加密时也采用md5中SparkMD5.ArrayBuffer()的方法来加密
        //3.分片读取完后都会触发reader.onload方法 在此方法中,需要做的是,利用spark.append方法在MD5计算过程中添加数据,继续递归调用下个分片,添加到md5实例中
        //4.当所有分片都读取完后,调用spark.end()方法获取最终的MD5值
        reader.readAsArrayBuffer(chunks[currentChunk]); 
    }
    loadNext()
}
