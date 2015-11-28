var View = require('ampersand-view');
var InputView = require('ampersand-input-view');
var _ = require('underscore');

//an internally used view that is used to draw each radio button
var ButtonView = View.extend({
    template:
        '<div><input type="radio"><span data-hook="text"></span></div>',
    props: {
        text: ['string', true, ''],
        checked: ['boolean', false, false],
        value: ['any', true],
        name: ['string', true],
        disabled: ['boolean', false, false]
    },
    bindings: {
        'text': {
            type: 'text',
            hook: 'text'
        },
        'checked': {
            type: 'booleanAttribute',
            selector: 'input',
            name: 'checked'
        },
        'value': {
            type: 'attribute',
            selector: 'input',
            name: 'value'
        },
        'name': {
            type: 'attribute',
            selector: 'input',
            name: 'name'
        },
        'disabled': {
            type: 'booleanAttribute',
            selector: 'input',
            name: 'disabled'
        }
    }
});

module.exports = InputView.extend({
    template: [
        '<div class="form-group"><label data-hook="label"></label>',
        '<div class="radio-buttons"></div>',
        '<input type="hidden" data-hook="main">',
        '<div data-hook="message-container">',
        '<div data-hook="message-text" class="alert alert-danger"></div>',
        '</div>',
        '</div>'
    ].join(''),

    props: {
        buttons: 'array'
    },
    
    ButtonView: ButtonView,

    initialize: function(opts) {
        
        if (opts.buttonView) {
            this.ButtonView = opts.buttonView;
        }
        
        //force the input type to hidden. Doing it here since there is an event on type change
        this.type = 'hidden';
        InputView.prototype.initialize.apply(this);
    },

    render: function () {
        InputView.prototype.render.apply(this);
        
        var viewOptions = {
            text: this.buttons[i].text,
            value: this.buttons[i].value,
            checked: this.buttons[i].checked,
            disabled: this.buttons[i].disabled,
            name: this.name + '-doNotUseDirectly'
        };
        
        if (this.collection && this.collection.isCollection) {
            this.renderCollection(this.collection, this._initializeCollectionSubview, '.radio-buttons', viewOptions);
        } else {
            for(var i = 0; i < this.buttons.length; i++) {
                this.renderSubview(new this.ButtonView(viewOptions), '.radio-buttons');
                if (this.buttons[i].checked) {
                    this.inputValue = this.buttons[i].value;
                }
            }
        }
    },

    events: _.extend({}, InputView.prototype.events, {
        'click input[type=radio]': 'radioClickHandler'
    }),

    radioClickHandler: function(e) {
        this.inputValue = e.target.value;
    },
    
    _initializeCollectionSubview: function(config) {
        var view = new this.ButtonView(config);
        
        if (view.checked) {
            this.inputValue = view.value;
        }
        
        return view;
    }
});

module.exports.ButtonView = ButtonView;
