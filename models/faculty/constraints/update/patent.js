const nationUtils = require('../../utils/nation.js');
const ValidateUtils = require('../../../common/utils/validate.js');

const PatentValidationConstraints = {
    nation: {
        presence: false,
        type:     {
            type: value => nationUtils.isSupportedId( value ),
        },
    },
    certificationNumber: {
        presence: false,
        type:       'string',
        length:   {
            maximum: 100,
        },
    },
    applicationDate: {
        presence: false,
        type:     {
            type: value => ValidateUtils.isValidDate( value ),
        },
    },
    issueDate: {
        presence: false,
        type:     {
            type: value => ValidateUtils.isValidDate( value ),
        },
    },
    expireDate: {
        presence: false,
        type:     {
            type: value => ValidateUtils.isValidDate( value ),
        },
    },
};

module.exports = PatentValidationConstraints;
