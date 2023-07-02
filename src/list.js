function list() {
  const availiableTemplates = ["a", "b"];
  console.log(`
    ${availiableTemplates.map(i => '* ' + i + ';\n')}
`);
}

export {
  list,
}

export default list;
