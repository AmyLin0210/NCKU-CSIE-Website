const I18nUtils = require('../../common/utils/i18n.js');
const { defaultOption, i18n, map, } = require('../maps/education-columns.js');

const educationColumnsUtils = new I18nUtils( {
    defaultOption,
    i18n,
    map,
} );

module.exports = educationColumnsUtils;
