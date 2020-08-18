import ValidateUtils from 'models/common/utils/validate.js';
import validate from 'validate.js';
import { classAdd, classRemove, } from 'static/src/js/utils/style.js';
import WebLanguageUtils from 'static/src/js/utils/language.js';
import LanguageUtils from 'models/common/utils/language.js';
import { host, } from 'settings/server/config.js';

export default class DefaultDataManagement {
    constructor ( opt ) {
        opt = opt || {};

        if (
            !ValidateUtils.isDomElement( opt.bodyFormDOM ) ||
            !ValidateUtils.isDomElement( opt.refreshDOM ) ||
            !ValidateUtils.isDomElement( opt.loadingDOM ) ||
            !ValidateUtils.isDomElement( opt.cardsDOM ) ||
            !WebLanguageUtils.isSupportedLanguageId( opt.languageId ) ||
            !ValidateUtils.isValidString( opt.table )
        )
            throw new TypeError( 'invalid arguments' );

        this.config = {
            languageId:   opt.languageId,
            table:        opt.table,
            idColumn:   opt.idColumn,
        };

        this.status = {
            dataId:      -1,
            patchButton: null,
        };

        this.constraints = opt.constraints;
        this.deletePreview = opt.deletePreview;

        const checkButtonQuerySelector = method => ` #form-${ opt.table }-${ method } > .form-input__button > .button__check`;
        const cancelButtonQuerySelector = method => ` #form-${ opt.table }-${ method } > .form-input__button > .button__cancel`;
        const errorMessageQuerySelector = method => ` #form-${ opt.table }-${ method } > .form-input__content > .content__error-message`;
        const inputQuerySelector = method => `input[ method = ${ method }][table = ${ opt.table }]`;
        const formQuerySelector = method => `#form-${ opt.table }-${ method }`;

        this.DOM = {
            patch: {
                checkButton:  opt.bodyFormDOM.querySelector( checkButtonQuerySelector( 'patch' ) ),
                cancelButton: opt.bodyFormDOM.querySelector( cancelButtonQuerySelector( 'patch' ) ),
                errorMessage: opt.bodyFormDOM.querySelector( errorMessageQuerySelector( 'patch' ) ),
                input:        opt.bodyFormDOM.querySelectorAll( inputQuerySelector( 'patch' ) ),
                form:         opt.bodyFormDOM.querySelector( formQuerySelector( 'patch' ) ),
            },
            post: {
                checkButton:  opt.bodyFormDOM.querySelector( checkButtonQuerySelector( 'post' ) ),
                cancelButton: opt.bodyFormDOM.querySelector( cancelButtonQuerySelector( 'post' ) ),
                errorMessage: opt.bodyFormDOM.querySelector( errorMessageQuerySelector( 'post' ) ),
                input:        opt.bodyFormDOM.querySelectorAll( inputQuerySelector( 'post' ) ),
                form:         opt.bodyFormDOM.querySelector( formQuerySelector( 'post' ) ),
            },
            delete: {
                checkButton:  opt.bodyFormDOM.querySelector( checkButtonQuerySelector( 'delete' ) ),
                cancelButton: opt.bodyFormDOM.querySelector( cancelButtonQuerySelector( 'delete' ) ),
                preview:      opt.bodyFormDOM.querySelector( `#form-${ opt.table }-delete > .form-input__content > .content__delete-preview` ),
                form:         opt.bodyFormDOM.querySelector( formQuerySelector( 'delete' ) ),
            },
            formBackground: opt.bodyFormDOM,
            cards:          {
                cards: opt.cardsDOM,
            },
            postButtons:   Array.from( opt.postButtonsDOM ).map( ( node ) => {
                const buttonId = node.getAttribute( 'data-id' );
                if ( buttonId === null )
                    throw new Error( 'DOM attribute `data-id` not found.' );
                return {
                    node,
                    id:   Number( buttonId ),
                };
            } ),
            patchButtons: Array.from( opt.patchButtonsDOM ).map( ( node ) => {
                const buttonId = node.getAttribute( 'data-id' );
                if ( buttonId === null )
                    throw new Error( 'DOM attribute `data-id` not found.' );
                return {
                    node,
                    id:   Number( buttonId ),
                };
            } ),
            deleteButtons: Array.from( opt.deleteButtonsDOM ).map( ( node ) => {
                const buttonId = node.getAttribute( 'data-id' );
                if ( buttonId === null )
                    throw new Error( 'DOM attribute `data-id` not found.' );
                return {
                    node,
                    id:   Number( buttonId ),
                };
            } ),
            refresh: opt.refreshDOM,
            loading: opt.loadingDOM,
        };
    }

    renderLoading () {
        classAdd( this.DOM.refresh, 'refresh--hidden' );
        classRemove( this.DOM.loading, 'loading--hidden' );
        classAdd( this.DOM.cards.cards, 'cards--hidden' );
    }

    renderSuccess () {
        classAdd( this.DOM.refresh, 'refresh--hidden' );
        classAdd( this.DOM.loading, 'loading--hidden' );
        classRemove( this.DOM.cards.cards, 'cards--hidden' );
    }

    subscribeCancelButton () {
        const methods = [ 'post',
            'patch',
            'delete', ];
        methods.forEach( ( method ) => {
            this.DOM[ method ].cancelButton.addEventListener( 'click', ( element ) => {
                element.preventDefault();
                this.hideForm();
            } );
        } );
    }

    subscribePostButton () {
        this.showPostForm();
    }

    subscribePostCheckButton () {
        this.DOM.post.checkButton.addEventListener( 'click', async ( e ) => {
            e.preventDefault();

            const isValid = await this.dataValidation( 'post' );

            if ( isValid ) {
                const data = await this.formatFormData( 'post' );
                fetch( `${ host }/user/profile`, {
                    method:   'POST',
                    body:   JSON.stringify( {
                        profileId:     this.config.profileId,
                        add:       {
                            [ this.config.table ]: [
                                data,
                            ],
                        },
                    } ),
                } )
                .then( () => {
                    this.hideForm();
                    this.renderLoading();
                } )
                .then( () => {
                    this.renderSuccess();
                } );
            }
        } );
    }

    subscribePatchButton ( element ) {
        Promise.all( LanguageUtils.supportedLanguageId.map( languageId => this.fetchData( languageId ) ) )
        .then( ( data ) => {
            this.status.dataId = element.target.getAttribute( 'data-id' );
            this.status.patchButton = element.target;

            const tableData = data.map( ( i18nData ) => {
                const dict = {};
                i18nData[ this.config.table ].forEach( ( row ) => {
                    dict[ row[ this.config.idColumn ] ] = row;
                } );
                return dict;
            } );

            return tableData;
        } )
        .then( ( data ) => {
            const dataId = element.target.getAttribute( 'data-id' );
            this.showPatchForm( LanguageUtils.supportedLanguageId.map( languageId => data[ languageId ][ dataId ] ) );
        } );
    }

    subscribePatchCheckButton () {
        this.DOM.patch.checkButton.addEventListener( 'click', async ( e ) => {
            e.preventDefault();
            const isValid = await this.dataValidation( 'patch' );

            if ( isValid ) {
                const data = await this.formatFormData( 'patch' );
                fetch( `${ host }/user/profile`, {
                    method:   'POST',
                    body:   JSON.stringify( {
                        profileId:     this.config.profileId,
                        update:       {
                            [ this.config.table ]: [
                                data,
                            ],
                        },
                    } ),
                } )
                .then( () => {
                    this.hideForm();
                    this.renderLoading();
                } )
                .then( () => {
                    this.renderSuccess();
                } );
            }
        } );
    }

    subscribeDeleteButton ( e ) {
        this.fetchData( this.config.languageId )
        .then( ( data ) => {
            this.status.dataId = e.target.getAttribute( 'data-id' );
            const rowData = data[ this.config.table ].find(
                item => item[ this.config.idColumn ] === Number( e.target.getAttribute( 'data-id' ) )
            );

            this.DOM.delete.preview.innerHTML = this.deletePreview( rowData );
        } )
        .then( () => {
            this.showDeleteForm();
        } );
    }

    subscribeDeleteCheckButton () {
        this.DOM.delete.checkButton.addEventListener( 'click', ( e ) => {
            e.preventDefault();
            fetch( `${ host }/user/profile`, {
                method:   'POST',
                body:   JSON.stringify( {
                    profileId:     this.config.profileId,
                    delete:    {
                        [ this.config.table ]: this.status.dataId,
                    },
                } ),
            } )
            .then( () => {
                this.hideForm();
                this.renderLoading();
            } )
            .then( () => {
                this.renderSuccess();
            } );
        } );
    }

    queryApi ( languageId ) {
        return `${ host }/api/faculty/facultyWithId/${ this.config.profileId }?languageId=${ languageId }`;
    }

    async fetchData ( languageId ) {
        try {
            const res = await fetch( this.queryApi( languageId ) );
            if ( !res.ok )
                throw new Error( 'No faculty found' );

            return res.json();
        }
        catch ( err ) {
            throw err;
        }
    }

    setPatchFormValue ( data ) {
        Array.from( this.DOM.patch.input ).forEach( ( element ) => {
            const columnName = element.getAttribute( 'column' );
            const languageId = element.getAttribute( 'languageId' );
            element.value = data[ languageId ][ columnName ];
        } );
    }

    showPatchForm ( data ) {
        Array.from( this.DOM.patch.input ).forEach( ( element ) => {
            const columnName = element.getAttribute( 'column' );
            const languageId = element.getAttribute( 'languageId' );
            element.value = data[ languageId ][ columnName ];
        } );
        this.DOM.patch.errorMessage.innerHTML = '';
        classAdd( this.DOM.formBackground, 'form--active' );
        classAdd( this.DOM.patch.form, 'form-input--active' );
    }

    showPostForm () {
        Array.from( this.DOM.post.input ).forEach( ( element ) => {
            element.value = '';
        } );
        classAdd( this.DOM.formBackground, 'form--active' );
        classAdd( this.DOM.post.form, 'form-input--active' );
    }

    showDeleteForm () {
        classAdd( this.DOM.formBackground, 'form--active' );
        classAdd( this.DOM.delete.form, 'form-input--active' );
    }

    hideForm () {
        classRemove( this.DOM.formBackground, 'form--active' );
        classRemove( this.DOM.patch.form, 'form-input--active' );
        classRemove( this.DOM.post.form, 'form-input--active' );
        classRemove( this.DOM.delete.form, 'form-input--active' );
    }

    async dataValidation ( method ) {
        const isValid = new Promise( ( res ) => {
            let errorMessage = '';
            Array.from( this.DOM[ method ].input ).forEach( ( element ) => {
                const message = validate.single( element.value, this.constraints[ element.name ] );
                if ( ValidateUtils.isValidArray( message ) ) {
                    errorMessage = message[ 0 ];
                    element.focus();
                }
            } );
            res( errorMessage );
        } )
        .then( ( errorMessage ) => {
            if ( errorMessage === '' )
                return true;

            this.DOM[ method ].errorMessage.innerHTML = errorMessage;
            return false;
        } );

        return isValid;
    }

    async formatFormData ( method ) {
        const data = {
            i18n: Array.from( LanguageUtils.supportedLanguageId ).map( id => ( { language: id, } ) ),
        };
        Array.from( this.DOM[ method ].input ).forEach( ( element ) => {
            if ( element.getAttribute( 'input-type' ) === 'i18n-text' )
                data.i18n[ element.getAttribute( 'languageid' ) ][ element.getAttribute( 'column' ) ] = element.value;


            else
                data[ element.name ] = element.value;
        } );

        return data;
    }

    async exec () {
        this.renderLoading();

        fetch( `${ host }/user/id`, {
            credentials: 'include',
            method:      'post',
        } )
        .then( res => res.json() )
        .then( ( res ) => {
            this.config.profileId = res.roleId;
        } )
        .then( () => {
            this.renderSuccess();
            this.subscribeCancelButton();
            this.subscribePostCheckButton();
            this.subscribeDeleteCheckButton();
            this.subscribePatchCheckButton();
            this.DOM.deleteButtons.forEach( ( element ) => {
                element.node.addEventListener( 'click', ( node ) => {
                    this.subscribeDeleteButton( node );
                } );
            } );
            this.DOM.postButtons.forEach( ( element ) => {
                element.node.addEventListener( 'click', () => {
                    this.subscribePostButton();
                } );
            } );
            this.DOM.patchButtons.forEach( ( element ) => {
                element.node.addEventListener( 'click', ( node ) => {
                    this.subscribePatchButton( node );
                } );
            } );
        } );
    }
}