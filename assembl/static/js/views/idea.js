define(['backbone', 'underscore', 'zepto', 'models/idea', 'app'],
function(Backbone, _, $, Idea, app){
    'use strict';

    var DATA_LEVEL = 'data-idealist-level',
        PREVIOUS_VALUE = 'previous-value';

    /**
     * Given the .idealist-label, returns the right offsetTop
     * @param  {.idealist-label} el
     * @param  {Number} [top=0] Initial top
     * @return {Number}
     */
    function getTopPosition(el, top){
        top = top || 0;

        if( el.offsetParent.id === 'wrapper' ){
            return top + el.offsetTop;
        } else {
            return getTopPosition(el.offsetParent, el.offsetTop);
        }

    }

    var IdeaView = Backbone.View.extend({
        /**
         * Tag name
         * @type {String}
         */
        tagName: 'div',

        /**
         * The template
         * @type {[type]}
         */
        template: app.loadTemplate('idea'),

        /**
         * The label element
         * @type {HTMLSpanElement}
         */
        label: null,

        /**
         * The text field
         * @type {HTMLInputElement}
         */
        field: null,

        /**
         * The title element
         * @type {HTMLSpanElement}
         */
        title: null,

        /**
         * The render
         * @return {IdeaView}
         */
        render: function(){
            var data = this.model.toJSON(),
                doc = document.createDocumentFragment();

            this.el.setAttribute(DATA_LEVEL, data.level);
            this.$el.addClass('idealist-item');

            this.$el.html(this.template(data));

            this.label = this.$('.idealist-label').get(0);
            this.field = this.$('.idealist-field');
            this.title = this.$('.idealist-title');

            this.$('.idealist-children').append( this.getRenderedChildren() );

            return this;
        },

        /**
         * Returns all children rendered
         * @return {Array<HTMLDivElement>}
         */
        getRenderedChildren: function(){
            var children = this.model.get('children'),
                ret = [];

            if( this.model.get('hasChildren') === true ){
                _.each(children, function(idea, i){
                    var ideaView = new IdeaView({model:idea});

                    ret.push( ideaView.render().el );
                });
            }

            return ret;
        },

        /**
         * add an item as child
         * @param  {string} html
         */
        addChild: function(html){
            var idea = new Idea.Model({
                subject: html,
                level: this.model.get('level') + 1
            });

            this.model.addChild(idea);
        },

        /**
         * Remove the states related to drag
         */
        clearDragStates: function(){
            this.label.classList.remove('is-dragover');
            this.label.classList.remove('is-dragover-below');
        },

        /**
         * Changes the interface to edit-title mode
         */
        startEditTitle: function(){
            var val = this.title.hide().text();
            this.title.data(PREVIOUS_VALUE, val);

            this.field.show().val(val).focus();
        },

        /**
         * Save the edition of a title
         */
        saveEditTitle: function(){
            var val = this.field.hide().val();
            this.title.data(PREVIOUS_VALUE, '').text(val).show();
            this.model.set('subject', val);
        },

        /**
         * Cancels the edition of a title ()
         */
        cancelEditTitle: function(){
            var val = this.title.data(PREVIOUS_VALUE);
            this.title.text(val).show();
            this.field.hide();
        },

        /**
         * The events
         * @type {Object}
         */
        events: {
            'mousedown': 'onClick',
            'click [type=checkbox]': 'onCheckboxClick',
            'click .idealist-title': 'startEditTitle',
            'keydown .idealist-field': 'onFieldKeyPress',
            'blur .idealist-field': 'saveEditTitle',
            'click .idealist-label-arrow': 'toggle',
            'dragleave .idealist-label': 'clearDragStates',
            'dragover .idealist-label': 'onDragOver',
            'drop .idealist-label': 'onDrop'
        },

        onClick: function(ev){
            if( ev.which !== 3 ){
                return;
            }

            //app.showContextMenu()
        },

        /**
         * @event
         */
        onFieldKeyPress: function(ev){
            if( ev.which === 13 ){
                this.saveEditTitle();
            } else if ( ev.which === 27 ) {
                this.cancelEditTitle();
            }
        },

        /**
         * @event
         */
        onDragOver: function(ev){
            if( ev ){
                ev.preventDefault();
                ev.stopPropagation();
            }
            this.clearDragStates();

            var top = getTopPosition(this.label),
                below = top + 30,
                cls = ev.clientY >= below ? 'is-dragover-below' : 'is-dragover';

            this.label.classList.add( cls );
        },

        /**
         * @event
         */
        onDrop: function(ev){
            if( ev ){
                ev.preventDefault();
                ev.stopPropagation();
            }

            this.clearDragStates();
            var li = app.getDraggedSegment();

            if( li ){
                this.addChild( 'oi' ); // li.innerText
            }

            this.render();
        },

        /**
         * Toggle show/hide an item
         * @event
         * @param  {Event} ev
         */
        toggle: function(ev){
            if( ev ){
                ev.stopPropagation();
            }

            if( this.$el.hasClass('is-open') ){
                this.model.set('isOpen', false);
                this.$el.removeClass('is-open');
            } else {
                this.model.set('isOpen', true);
                this.$el.addClass('is-open');
            }
        },

        /**
         * @event
         */
        onCheckboxClick: function(ev){
            // var chk = ev.currentTarget;

            // if( chk.checked ){
            //     this.$el.addClass('is-selected');
            // } else {
            //     this.$el.removeClass('is-selected');
            // }
        }
    });

    /**
     * States
     */
    IdeaView.prototype.states = {
        hidden: 'is-hidden',
        optioned: 'is-optioned',
        selected: 'is-selected',
        open: 'is-open'
    };

    return IdeaView;
});
