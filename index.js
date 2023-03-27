const yaml = require("yaml")
const fs = require("fs");
const {mergeRecursive} = require("@calvin-coomer/fns");
const config = {};
let _configPath = null;

function loadConfig(path = './config.yaml') {
    _configPath = path
    let data = fs.readFileSync(path).toString()
    data = yaml.parse(data)
    Object.assign(config, data)
    const extraConfigPath = [...process.argv]
        .find(str => (str || '').toLowerCase().includes('extraconfig:'))
    if (extraConfigPath) {
        const path = extraConfigPath
            .substring(12, extraConfigPath.length)
            .replace(/^"|^'|"$|'$/gm, "")
            .trim()
        let extraConfigData = fs.readFileSync(path).toString()
        extraConfigData = yaml.parse(extraConfigData)
        mergeRecursive(config, extraConfigData)
    }
}

function setConfigProperty(key, value) {
    let data = fs.readFileSync(_configPath).toString()
    data = yaml.parse(data)
    data[key] = value;
    fs.writeFileSync(_configPath, yaml.stringify(data))
}

module.exports = {
    loadConfig,
    config,
    setConfigProperty
}