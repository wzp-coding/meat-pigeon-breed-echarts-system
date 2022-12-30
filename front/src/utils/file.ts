import XLSX from "xlsx";
import { isPlainObject } from "lodash";
/* 把blob转dataurl */
export function readBlobAsDataURL(data: any) {
    return new Promise((res) => {
        const fileReader = new FileReader();
        fileReader.onload = function (e) {
            res(e.target?.result);
        };
        fileReader.readAsDataURL(data);
    });
}


interface Data {
    data: object[],
    option?: object
}
/**
 * 1.{ data: [], option: {}}
 * 2.[{},{},{}]
 * 3.[{ data: [], option: {}}, { data: [], option: {}}]
 * 4.[[{},{},{}], [{},{},{}]]
 * 统一格式化成 第三种格式
 */
const isObjectArrArr = (data: Data[] | object[] | object[][]): data is object[][] => Array.isArray(data[0]);
const isDataArray = (data: Data[] | object[]): data is Data[] => 'data' in data[0];
const formatData = (data: Data | Data[] | object[] | object[][]): Data[] => {
    if ('data' in data) {
        return [data]
    }
    if (isObjectArrArr(data)) {
        return data.map(data => ({ data, option: {} }))
    }
    if (isDataArray(data)) {
        return data;
    }
    return [{ data, option: {} }]
}

const formatColsWidths = (colsWidths: number[] | number[][]): number[][] => {
    const isArrArr = (colsWidths: number[] | number[][]): colsWidths is number[][] => Array.isArray(colsWidths[0]);
    if (isArrArr(colsWidths)) {
        return colsWidths;
    }
    return [colsWidths];
}
// 导出xlsx文件
export function downloadExl(data: Data | Data[] | object[] | object[][], type: 'xlsx' | 'csv' | 'ods' | 'xlsb' | 'fods' | 'xls', name: string, merges = undefined, sheetNames?: string[], colsWidths?: number[] | number[][]) {
    const wopts = {
        xlsx: { bookType: "xlsx", bookSST: false, type: "binary" },
        csv: { bookType: "csv", bookSST: false, type: "binary" },
        ods: { bookType: "ods", bookSST: false, type: "binary" },
        xlsb: { bookType: "xlsb", bookSST: false, type: "binary" },
        fods: { bookType: "fods", bookSST: false, type: "binary" },
        xls: { bookType: "biff2", bookSST: false, type: "binary" },
    }; // 这里的数据是用来定义导出的格式类型
    const wopt = wopts[type];
    const s2ab = (s: string) => {
        if (typeof ArrayBuffer !== "undefined") {
            const buf = new ArrayBuffer(s.length);
            let view = new Uint8Array(buf);
            for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
            return buf;
        } else {
            const buf = new Array(s.length);
            for (let i = 0; i !== s.length; ++i) buf[i] = s.charCodeAt(i) & 0xff;
            return buf;
        }
    };
    const saveAs = (obj: any, fileName: string) => {
        // 当然可以自定义简单的下载文件实现方式
        let tmpa = document.createElement("a");
        tmpa.download = fileName || "下载";
        tmpa.href = URL.createObjectURL(obj); // 绑定a标签
        tmpa.click(); // 模拟点击实现下载
        setTimeout(function () {
            // 延时释放
            URL.revokeObjectURL(obj); // 用URL.revokeObjectURL()来释放这个object URL
        }, 100);
    };
    // 处理多个 sheets 数
    const datas = formatData(data);
    const SheetNames = sheetNames ? sheetNames : datas.map((_, i) => `Sheet${i + 1}`);
    const wb: any = { SheetNames, Sheets: {}, Props: {} };
    datas.forEach((data, i) => {
        let realData = data.data;
        let realOption = isPlainObject(data) ? data?.option : {};
        const xlsData = XLSX.utils.json_to_sheet(realData, realOption); // 通过json_to_sheet转成单页(Sheet)数据
        xlsData["!merges"] = merges;
        colsWidths && (xlsData["!cols"] = formatColsWidths(colsWidths)[i].map(n => ({ wpx: n })));
        wb.Sheets[SheetNames[i]] = xlsData;
    });
    saveAs(
        new Blob([s2ab(XLSX.write(wb, wopt as any))] as any, {
            type: "application/octet-stream",
        }),
        `${name || "新建下载文件"}.${type}`
    );
}

// 导入并解析excel数据
export function excelToData(file: Blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const workbook = XLSX.read(e.target?.result, {
                type: 'array'
            });
            const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });
            resolve(data);
        };
        reader.readAsArrayBuffer(file);
    })
}