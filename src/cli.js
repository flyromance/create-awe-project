import minimist from "minimist";
import semver from "semver";
import pkgJson from "../package.json";

const { version, name, engines } = pkgJson;
const currentNodeVersion = process.version; // 'vx.x.x'

// { _: [], ...}
const { _, ...params } = minimist(process.argv.slice(2), {
  alias: {
    v: "version",
    h: "help",
    s: "source",
  },
  default: {
    source: "gitee",
  },
});
const cmd = _[0];

console.log(_, params);

// 查看帮助
if (params.help || !cmd) {
  const helpMessage = `
$: awe-project --help or -h // 查看帮助
$: awe-project --version or -v // 查看版本
$: awe-project list --source xxx or -s xxx // 查询指定源所拥有的模板
$: awe-project init/create <template-name> <dir-name> --source xxx or -s xxx // 下载指定模板
`;
  console.log(helpMessage);
  process.exit(0);
}

// 查看包版本
if (params.version) {
  console.log(`${name} ${version}`);
  process.exit(0);
}

// 检查node版本
const needCheckNodejsVersion = engines && engines.node;
if (
  needCheckNodejsVersion &&
  !semver.satisfies(currentNodeVersion, engines.node)
) {
  console.log(
    `wanted node version is ${engines.node}，but current node version is ${currentNodeVersion}`
  );
  process.exit(0);
}

const validCommands = ["list", "create", "init"];

// 检查是否是支持的命令
if (!validCommands.includes(cmd)) {
  const msg = `
command ${cmd} is not supported.
we only support ${validCommands.join(", ")}.
`;
  console.log(msg);
  process.exit(0);
}

// 懒加载命令处理方法
const commandMap = {
  list: async () => {
    const { list } = await import("./list");
    list();
  },
  create: async () => {
    const { create } = await require("./create");
    create();
  },
};

// 命令别名
commandMap.init = commandMap.create;

try {
  commandMap[cmd](params);
} catch (e) {
  console.log(e);
}
