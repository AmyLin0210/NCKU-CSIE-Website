import degreeUtils from 'models/faculty/utils/degree.js';
import WebLanguageUtils from 'static/src/js/utils/language.js';
import publicationCategoryUtils from 'models/faculty/utils/publication-category.js';
import { editPageType, } from 'static/src/js/components/user/edit-page.js';
import nationUtils from 'models/faculty/utils/nation.js';
import deepFreeze from 'deep-freeze';

const dataEditPageConfig = Object.freeze( {
    profile: {
        name: [
            editPageType( {
                type:        'text',
                dbTableItem: 'name',
                i18n:        true,
            } ),
        ],
        officeAddress: [
            editPageType( {
                type:        'text',
                dbTableItem: 'officeAddress',
                i18n:        true,
            } ),
        ],
        labName: [
            editPageType( {
                type:        'text',
                dbTableItem: 'labName',
                i18n:        true,
            } ),
        ],
        labAddress:  [
            editPageType( {
                type:        'text',
                dbTableItem: 'labAddress',
                i18n:        true,
            } ),
        ],
        labTel:  [
            editPageType( {
                type:        'text',
                dbTableItem: 'labTel',
                i18n:        false,
            } ),
        ],
        labWeb:  [
            editPageType( {
                type:        'text',
                dbTableItem: 'labWeb',
                i18n:        false,
            } ),
        ],
        officeTel: [
            editPageType( {
                type:        'text',
                dbTableItem: 'officeTel',
                i18n:        false,
            } ),
        ],
        email:    [
            editPageType( {
                type:        'text',
                dbTableItem: 'email',
                i18n:        false,
            } ),
        ],
        fax:    [
            editPageType( {
                type:        'text',
                dbTableItem: 'fax',
                i18n:        false,
            } ),
        ],
        personalWeb:  [
            editPageType( {
                type:        'text',
                dbTableItem: 'personalWeb',
                i18n:        false,
            } ),
        ],
        nation: [
            editPageType( {
                type:         'dropdown',
                dbTableItem:  'nation',
                dropdownItem: nationUtils.i18n[ WebLanguageUtils.currentLanguageId ],
                util:         nationUtils,
            } ),
        ],
    },
    education: [
        editPageType(
            {
                type: 'time',
            }
        ),
        editPageType(
            {
                type:        'localTopic',
                dbTableItem: 'degree',
            }
        ),
        editPageType(
            {
                type:         'dropdown',
                dbTableItem:  'degree',
                dropdownItem: degreeUtils.i18n[ WebLanguageUtils.currentLanguageId ],
                util:         degreeUtils,
            }
        ),
        editPageType(
            {
                type:        'localTopic',
                dbTableItem: 'nation',
            }
        ),
        editPageType(
            {
                type:         'dropdown',
                dbTableItem:  'nation',
                dropdownItem: nationUtils.i18n[ WebLanguageUtils.currentLanguageId ],
                util:         nationUtils,
            }
        ),
        editPageType(
            {
                type:        'localTopic',
                dbTableItem: 'school',
            }
        ),
        editPageType(
            {
                type:        'text',
                dbTableItem: 'school',
                i18n:        true,
            }
        ),
        editPageType(
            {
                type:        'localTopic',
                dbTableItem: 'major',
            }
        ),
        editPageType(
            {
                type:        'text',
                dbTableItem: 'major',
                i18n:        true,
            }
        ),
    ],
    experience: [
        editPageType(
            {
                type: 'time',
            }
        ),
        editPageType(
            {
                type:        'localTopic',
                dbTableItem: 'organization',
            }
        ),
        editPageType(
            {
                type:        'text',
                dbTableItem: 'organization',
                i18n:        true,
            }
        ),
        editPageType(
            {
                type:        'localTopic',
                dbTableItem: 'department',
            }
        ),
        editPageType(
            {
                type:        'text',
                dbTableItem: 'department',
                i18n:        true,
            }
        ),
        editPageType(
            {
                type:        'localTopic',
                dbTableItem: 'title',
            }
        ),
        editPageType(
            {
                type:        'text',
                dbTableItem: 'title',
                i18n:        true,
            }
        ),
    ],
    title: [
        editPageType(
            {
                type: 'time',
            }
        ),
        editPageType(
            {
                type:        'text',
                dbTableItem: 'title',
                i18n:        true,
            }
        ),
    ],
    specialty: [
        editPageType(
            {
                type:        'text',
                dbTableItem: 'specialty',
                i18n:        true,
            }
        ),
    ],
    award: [
        editPageType(
            {
                type:        'localTopic',
                dbTableItem: 'time-detail',
            }
        ),
        editPageType(
            {
                type:         'timeDetail',
                dbTableYear:  'receivedYear',
                dbTableMonth: 'receivedMonth',
                dbTableDate:   'receivedDay',
            }
        ),
        editPageType(
            {
                type:        'localTopic',
                dbTableItem: 'award',
            }
        ),
        editPageType(
            {
                type:        'text',
                dbTableItem: 'award',
                i18n:        true,
            }
        ),
    ],
    publication: [
        editPageType(
            {
                type:        'localTopic',
                dbTableItem: 'issueYear',
            }
        ),
        editPageType(
            {
                type:        'text',
                dbTableItem: 'issueYear',
                i18n:        false,
            }
        ),
        editPageType(
            {
                type:        'localTopic',
                dbTableItem: 'category',
            }
        ),
        editPageType( {
            type:         'dropdown',
            dbTableItem:  'category',
            dropdownItem: publicationCategoryUtils.i18n[ WebLanguageUtils.currentLanguageId ],
            util:         publicationCategoryUtils,
        } ),
        editPageType(
            {
                type:        'localTopic',
                dbTableItem: 'title',
            }
        ),
        editPageType(
            {
                type:        'text',
                dbTableItem: 'title',
                i18n:        true,
            }
        ),
        editPageType(
            {
                type:        'localTopic',
                dbTableItem: 'authors',
            }
        ),
        editPageType(
            {
                type:        'text',
                dbTableItem: 'authors',
                i18n:        true,
            }
        ),
        editPageType(
            {
                type:        'checkbox',
                dbTableItem: 'international',
            }
        ),
        editPageType(
            {
                type:        'checkbox',
                dbTableItem: 'refereed',
            }
        ),
    ],
    conference: [
        editPageType(
            {
                type:        'localTopic',
                dbTableItem: 'hostYear',
            }
        ),
        editPageType(
            {
                type:        'text',
                dbTableItem: 'hostYear',
                i18n:        false,
            }
        ),
        editPageType(
            {
                type:        'localTopic',
                dbTableItem: 'conference',
            }
        ),
        editPageType(
            {
                type:        'text',
                dbTableItem: 'conference',
                i18n:        true,
            }
        ),
        editPageType(
            {
                type:        'localTopic',
                dbTableItem: 'title',
            }
        ),
        editPageType(
            {
                type:        'text',
                dbTableItem: 'title',
                i18n:        true,
            }
        ),
    ],
} );

deepFreeze( dataEditPageConfig );
export default dataEditPageConfig;