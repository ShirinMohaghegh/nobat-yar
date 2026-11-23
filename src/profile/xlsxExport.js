// Small standards-compliant XLSX writer: no extra runtime dependency.
// Uses inline Unicode strings, RTL worksheet view, frozen header, and a Tahoma font.
import { displaySections, dateFa, fa } from './profileData.js'
const utf8 = text => new TextEncoder().encode(text)
const xml = text => String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;')
const u16 = (n,arr) => {arr.push(n&255,(n>>8)&255)}
const u32 = (n,arr) => {arr.push(n&255,(n>>8)&255,(n>>16)&255,(n>>24)&255)}
const crcTable = Array.from({length:256}, (_,n)=>{for(let j=0;j<8;j++)n=n&1?0xEDB88320^(n>>>1):n>>>1;return n>>>0})
const crc32 = bytes => {let c=0xFFFFFFFF;for(const b of bytes)c=crcTable[(c^b)&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0}
function zip(files) {
  const local=[], directory=[]
  let offset=0
  for(const [name, body] of files) {
    const filename=utf8(name), contents=utf8(body), crc=crc32(contents)
    const header=[]; u32(0x04034b50,header);u16(20,header);u16(0x800,header);u16(0,header);u16(0,header);u16(0,header);u32(crc,header);u32(contents.length,header);u32(contents.length,header);u16(filename.length,header);u16(0,header)
    const localPart=new Uint8Array([...header,...filename,...contents]);local.push(localPart)
    const dir=[];u32(0x02014b50,dir);u16(20,dir);u16(20,dir);u16(0x800,dir);u16(0,dir);u16(0,dir);u16(0,dir);u32(crc,dir);u32(contents.length,dir);u32(contents.length,dir);u16(filename.length,dir);u16(0,dir);u16(0,dir);u16(0,dir);u16(0,dir);u32(0,dir);u32(offset,dir);directory.push(new Uint8Array([...dir,...filename]));offset+=localPart.length
  }
  const directorySize=directory.reduce((a,p)=>a+p.length,0)
  const end=[];u32(0x06054b50,end);u16(0,end);u16(0,end);u16(directory.length,end);u16(directory.length,end);u32(directorySize,end);u32(offset,end);u16(0,end)
  return new Blob([...local,...directory,new Uint8Array(end)],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
}
const cell=(address,value,style=0)=>`<c r="${address}" s="${style}" t="inlineStr"><is><t xml:space="preserve">${xml(value)}</t></is></c>`
export function downloadProfileXlsx(profile) {
  const rows = [['پرونده‌ی من', 'نوبت‌یار'], ['تاریخ خروجی',dateFa(new Date().toISOString().slice(0,10))]]
  const sections=displaySections(profile), merges=[]
  for (const section of sections) {
    rows.push([section.title, ''])
    merges.push(`A${rows.length}:B${rows.length}`)
    for (const row of section.rows) rows.push([row.label, row.value])
  }
  const sectionRows = new Set(merges.map(m=>Number(m.match(/^A(\d+)/)[1])))
  const rowXml=rows.map(([label,value],i)=>{
    const number=i+1, style=sectionRows.has(number)?2:i===0?1:0
    return `<row r="${number}" ht="${style?27:23}" customHeight="1">${cell(`A${number}`,label,style)}${cell(`B${number}`,value,style)}</row>`
  }).join('')
  const sheet=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0" rightToLeft="1"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="22"/><cols><col min="1" max="1" width="34" customWidth="1"/><col min="2" max="2" width="58" customWidth="1"/></cols><sheetData>${rowXml}</sheetData><mergeCells count="${merges.length}">${merges.map(ref=>`<mergeCell ref="${ref}"/>`).join('')}</mergeCells></worksheet>`
  const files = [
    ['[Content_Types].xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`],
    ['_rels/.rels',`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`],
    ['xl/workbook.xml',`<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView/></bookViews><sheets><sheet name="پرونده" sheetId="1" r:id="rId1"/></sheets></workbook>`],
    ['xl/_rels/workbook.xml.rels',`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`],
    ['xl/styles.xml',`<?xml version="1.0" encoding="UTF-8"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Tahoma"/></font><font><b/><sz val="11"/><name val="Tahoma"/><color rgb="FF1F6272"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFE1F4ED"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"><alignment horizontal="right" vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0"><alignment horizontal="right" vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0"><alignment horizontal="right" vertical="center" wrapText="1"/></xf></cellXfs></styleSheet>`],
    ['xl/worksheets/sheet1.xml',sheet],
  ]
  const url=URL.createObjectURL(zip(files)), a=document.createElement('a');a.href=url;a.download='nobat-yar-profile.xlsx';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)
}
