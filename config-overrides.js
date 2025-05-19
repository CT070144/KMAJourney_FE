/* config-overrides.js */
// Nạp thêm cấu hình tùy chỉnh cho webpack

const { override, useBabelRc } = require("customize-cra");

module.exports = override(useBabelRc());
