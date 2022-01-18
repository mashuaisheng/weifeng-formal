import FileSaver from 'file-saver';
import XLSX from 'xlsx';
import xlsxStyle from 'xlsx-style';
import XSU from './xlsxStyle.utils';

// tableId 表格id，title导出文件名称
const toExcel = (function(tableId, title) {
  return new Promise((resolve, reject) =>{
    let wb = XLSX.utils.table_to_book(document.getElementById(tableId), {sheet:"Sheet JS"});

    var sheet = wb.SheetNames[0]

    // wb样式处理，调用xlsxStyle.utils方法
    XSU.setAlignmentHorizontalAll(wb, sheet, 'center'); // 垂直居中
    XSU.setAlignmentVerticalAll(wb, sheet, 'center'); // 水平居中
    XSU.setAlignmentWrapTextAll(wb,sheet,true); // 自动换行
    XSU.setBorderDefaultAll(wb, sheet);//设置所有单元格默认边框

    // 列宽设置 1wch为1英文字符宽度
    var width = [{wch: 8}, {wch: 10}, {wch: 8}, {wch: 20}, {wch: 8}, {wch: 20}];
    XSU.setColWidth(wb,sheet,width);
    
    // 设置A1单元格title默认样式 必须最后设置 否则可能会被其他覆盖
    XSU.setTitleStylesDefault(wb,sheet);

    var wbout = xlsxStyle.write(wb, {
      bookType: "xlsx",
      bookSST: false, 
      type: 'binary'
    });

    try {
      FileSaver.saveAs(
        //Blob 对象表示一个不可变、原始数据的类文件对象。
        //Blob 表示的不一定是JavaScript原生格式的数据。
        //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
        //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
        new Blob([XSU.s2ab(wbout)], { 
          type: "application/octet-stream;charset=utf-8"
        }),
        // 设置导出文件名称
        title + '.xlsx'
      );
    } catch (e) {
      if (typeof console !== "undefined") console.log(e, wbout);
    }
    resolve(wbout)
  })
})

export default toExcel
