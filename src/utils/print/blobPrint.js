import watermark from 'watermark-h5'
import {
    permison
} from "@/store/permison";
const permisonData = permison()
//预览/打印  
export const printFun = (ctx, filetype) => {
    const content = ctx;
    console.log(ctx);
    let url = window.URL.createObjectURL(
        new Blob([content], {
            type: btype(filetype)
        })
    );
    var date = new Date().getTime();
    var ifr = document.createElement("iframe");
    var hea = document.createElement("head")
    hea.innerHTML = '<meta http-equiv="Content-Type" content="text/html; charset=gbk" />'
    ifr.style.frameborder = "no";
    ifr.style.display = "none";
    ifr.style.pageBreakBefore = "always";
    ifr.setAttribute("id", "printPdf" + date);
    ifr.setAttribute("name", "printPdf" + date);
    ifr.appendChild(hea)
    ifr.src = url;
    document.body.appendChild(ifr);
    doPrint("printPdf" + date);
    window.URL.revokeObjectURL(ifr.src); // 释放URL 对象
}
const doPrint = (val) => {
    var ordonnance = document.getElementById(val).contentWindow;
    setTimeout(() => {
        ordonnance.print();
        document.ready = function () {
            watermark.init({
                parentDomName: 'iframe',
                show: true,
                color: 'rgba(0, 0, 0, .2)',
                title: 12345,
                width: 200,
                height: 200,
                fontNum: 15,
                rotate: -25,
                zIndex: 9999
            })
        }
    }, 100);
}

//new Blob() 文件流下载文件不同文件类型的 type 值

function btype(ctx) {
    return {
        "xls": "application/vnd.ms-excel",
        "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "doc": "application/msword",
        "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "pdf": "application/pdf",
        "png": "image/png",
        "gif": "image/gif",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "jfif": "image/jpeg",
    } [ctx]
}