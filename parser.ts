// const fs = require('fs');
//
// const file = fs.readFileSync('./database-dump.yml', 'utf-8').toString();
//
// // const input = file.split('\n');
//
// const lines = file.split('\n');
// // const stack: any = [];
// const currentObject = {};
// // const currentIndent = 0;
//
// console.log('lines', lines);
// const map = new Map();
//
// for (let i = 0; i < lines.length; i++) {
//   const line = lines[i];
//   const [indent, content] = line.match(/^(\s*)(.*)/).slice(1);
//   if (!content.length) {
//     continue;
//   }
//   const indentLevel = indent.length / 2; // Assuming 2 spaces for each level of indentation
//
//   // map.set(indentLevel, obj);
//
//   let parent = currentObject;
//
//   for (let i = 0; i < indentLevel; i++) {
//     parent = parent[map.get(i)];
//     if (parent && parent[parent.length - 1].hasOwnProperty(content)) {
//       parent.push({});
//     }
//     parent = parent[parent.length - 1];
//   }
//
//   if (content.includes('=')) {
//     const [key, value] = content.split('=').map((str) => str.trim());
//     parent[key] = value;
//   } else {
//     const obj = parent[content] || {};
//     parent[content] = [obj];
//     map.set(indentLevel, content);
//   }
// }
//
// console.log(JSON.stringify(currentObject, null, 2));
