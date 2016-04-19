Ext.define("WICreator", {
    extend: 'Rally.app.App',
    settingsScope: 'workspace',
    componentCls: 'app',
    logger: new Rally.technicalservices.Logger(),
    defaults: { margin: 10 },
    items: [
        {xtype:'container',itemId:'selector_box'},
        {xtype:'container',itemId:'display_box'}
    ],

    integrationHeaders : {
        name : "WICreator"
    },

     //this.getSetting('testCaseType');
    config: {
        defaultSettings: {
            parentFeature:'',
            usName:'',
            tagsOfUS:[],
            planEst:'',
            showGrid:false
        }
    },

    getSettingsFields: function() {
        var me = this;
        me.kanbanProcessField = 'ScheduleState';

        return  [
            {
                name: 'showGrid',
                xtype: 'rallycheckboxfield',
                boxLabelAlign: 'after',
                fieldLabel: '',
                margin: '0 0 25 200',
                boxLabel: 'Show Grid<br/><span style="color:#999999;"><i>Tick to show the grid of User Stories for the Feature selected</i></span>'
            },
            {
                name: 'parentFeature',
                xtype: 'rallycombobox',
                fieldLabel: 'Parent Feature',
                labelWidth: 125,
                labelAlign: 'left',
                minWidth: 200,
                margin: 10,
                autoExpand: false,
                alwaysExpanded: false,
                allowNoEntry:true,                
                store:me.parentFeatures,
                readyEvent: 'ready'
            },
            {
                name: 'usName',
                xtype: 'textfield',
                fieldLabel: 'Default User Story Name',
                labelWidth: 125,
                labelAlign: 'left',
                minWidth: 200,
                margin: 10
            },
            {
                xtype: 'rallytagpicker',
                name: 'tagsOfUS',
                fieldLabel: 'Tags',
                labelAlign: 'left',
                labelWidth: 125,
                minWidth: 200,
                margin: 10
            },
            {
                name: 'planEst',
                xtype: 'textfield',
                fieldLabel: 'Plan Estimate',
                labelWidth: 125,
                labelAlign: 'left',
                minWidth: 50,
                margin: 10
            },
            {
                name: 'kanbanProcessField',
                itemId:'kanbanProcessField',
                xtype: 'rallyfieldcombobox',
                fieldLabel: 'Kanban Process',
                labelWidth: 125,
                labelAlign: 'left',
                minWidth: 200,
                margin: '10 10 10 10',
                autoExpand: false,
                alwaysExpanded: false,                
                model: 'HierarchicalRequirement',
                bubbleEvents: ['kanbanProcessFieldChange'],
                listeners: {
                    ready: function(field_box) {
                        me._filterOutWthString(field_box.getStore(),'Kanban Process');
                    },
                    change: function(field_box) {
                        this.fireEvent('kanbanProcessFieldChange',field_box);
                    }
                },                
                readyEvent: 'ready'
            },
            {
                name: 'kanbanProcessFieldValue',
                itemId:'kanbanProcessFieldValue',
                xtype: 'rallyfieldvaluecombobox',
                fieldLabel: 'Kanban Process Value',
                labelWidth: 125,
                labelAlign: 'left',
                minWidth: 200,
                margin: '10 10 10 10',
                autoExpand: true,
                alwaysExpanded: true,                
                model: 'HierarchicalRequirement',
                field: 'ScheduleState',
                emptyText:me.getSetting('kanbanProcessFieldValue'),
                handlesEvents: {
                    kanbanProcessFieldChange: function(chk){
                        this.field = chk.value;
                    }
                },
                readyEvent: 'ready'                
            },
            {
                name: 'classOfServiceField',
                itemId:'classOfServiceField',
                xtype: 'rallyfieldcombobox',
                fieldLabel: 'Class of Service',
                labelWidth: 125,
                labelAlign: 'left',
                minWidth: 200,
                margin: '10 10 10 10',
                autoExpand: false,
                alwaysExpanded: false,                
                model: 'HierarchicalRequirement',
                bubbleEvents: ['classOfServiceFieldChange'],
                listeners: {
                    ready: function(field_box) {
                        me._filterOutWthString(field_box.getStore(),'Class of Service');
                    },
                    change: function(field_box) {
                        this.fireEvent('classOfServiceFieldChange',field_box);
                    }
                },                
                readyEvent: 'ready'
            },
            {
                name: 'classOfServiceFieldValue',
                itemId:'classOfServiceFieldValue',
                xtype: 'rallyfieldvaluecombobox',
                fieldLabel: 'Class of Service Value',
                labelWidth: 125,
                labelAlign: 'left',
                minWidth: 200,
                margin: '10 10 10 10',
                autoExpand: false,
                alwaysExpanded: false,                
                model: 'HierarchicalRequirement',
                field: 'ScheduleState',
                handlesEvents: {
                    classOfServiceFieldChange: function(chk){
                        this.field = chk.value;
                    }
                },
                readyEvent: 'ready'                
            },
            {
                name: 'storyTypeField',
                itemId:'storyTypeField',
                xtype: 'rallyfieldcombobox',
                fieldLabel: 'Story Type',
                labelWidth: 125,
                labelAlign: 'left',
                minWidth: 200,
                margin: '10 10 10 10',
                autoExpand: false,
                alwaysExpanded: false,                
                model: 'HierarchicalRequirement',
                bubbleEvents: ['storyTypeFieldChange'],
                listeners: {
                    change: function(field_box) {
                        this.fireEvent('storyTypeFieldChange',field_box);
                    }
                },                
                readyEvent: 'ready'
            },
            {
                name: 'storyTypeFieldValue',
                itemId:'storyTypeFieldValue',
                xtype: 'rallyfieldvaluecombobox',
                fieldLabel: 'Story Type Value',
                labelWidth: 125,
                labelAlign: 'left',
                minWidth: 200,
                margin: '10 10 10 10',
                autoExpand: false,
                alwaysExpanded: false,                
                model: 'HierarchicalRequirement',
                field: 'ScheduleState',
                handlesEvents: {
                    storyTypeFieldChange: function(chk){
                        this.field = chk.value;
                    }
                },
                readyEvent: 'ready'                
            }

        ];

    },

    _filterOutWthString: function(store,filter_string) {

        console.log('store >>',store);
        var app = Rally.getApp();
        
        store.filter([{
            filterFn:function(field){ 
                var attribute_definition = field.get('fieldDefinition').attributeDefinition;
                var attribute_type = null;
                if ( attribute_definition ) {
                    attribute_name = attribute_definition.Name;
                }
                if ( attribute_name.indexOf(filter_string) > -1) {
                        return true;
                }
                return false;
            } 
        }]);
    },


    launch: function() {
        var me = this;

        Rally.data.ModelFactory.getModel({
            type: 'UserStory',
            success: function(model){
                me.model = model;
                me._addUSForm();
                me._getFeaturesAndStories();
            
            },
            scope: me
        });


    },

    _getFeaturesAndStories: function(){
        var deferred = Ext.create('Deft.Deferred');
        var me = this;

        var feature_model_filter = [{property:'Project.ObjectID',value:me.getContext().get('project').ObjectID}];
        var model_filters = [{property:'PortfolioItem',value:me.getSetting('parentFeature')}];
        var field_names = ['Name','ScheduleState','Project','Owner','Feature','PlanEstimate'];
                
        var promises = [];


        Deft.Promise.all([me._loadAStoreWithAPromise('PortfolioItem/Feature',['ObjectID','Name'],feature_model_filter),me._loadAStoreWithAPromise('UserStory', field_names,model_filters)],me).then({
                    success: function(results){
                        me.parentFeatures = results[0];
                        if(me.getSetting('showGrid') == true || me.getSetting('showGrid') == "true" ){
                            me._displayGrid(results[1],field_names);
                        }
                    },
                    scope: me
        });
        return deferred;
    }, 

    _addUSForm: function(){
        var me = this;
        var selector_box = me.down('#selector_box');
            selector_box.removeAll();
        var currentTime = Ext.Date.format(new Date(), 'm/d/Y g:i:s A');
        var usn =  me.getSetting('usName')+ ' ' + currentTime;
        selector_box.add({
                xtype: 'textfield',
                itemId:'userStoryName',
                name: 'name',
                fieldLabel: 'User Story Name',
                width:400,
                value:usn,
                allowBlank: false  // requires a non-empty value
        });

        selector_box.add({
            xtype: 'rallybutton',
            text: 'Create',
            // width: 200,
            margin:10,
            cls: 'primary',
            listeners: {
                click: me._createUserStories,
                scope: me
            }
        });

    },
    _getTags: function(){
        var tags = this.getSetting('tagsOfUS') || [];
        if (!(tags instanceof Array)){
            tags = tags.split(',');
        }
        return tags;
    },
    _createUserStories: function(){
        //Create a defect record, specifying initial values in the constructor
        var me = this;
        //console.log('Feature >>',me.getSetting('parentFeature'));

        var userSotryRec = {
            Name: me.down('#userStoryName').value,
            ScheduleState:'Defined',
            Project:me.getContext().get('project'),
            Owner:me.getContext().get('user'),
            PortfolioItem:me.getSetting('parentFeature'),
            PlanEstimate:me.getSetting('planEst')
        }

        userSotryRec[me.getSetting('kanbanProcessField')] = me.getSetting('kanbanProcessFieldValue');
        userSotryRec[me.getSetting('classOfServiceField')] = me.getSetting('classOfServiceFieldValue');
        userSotryRec[me.getSetting('storyTypeField')] = me.getSetting('storyTypeFieldValue');

        var record = Ext.create(me.model, userSotryRec);

        record.save({
            callback: function(result, operation) {
                if(operation.wasSuccessful()) {
                    //Get the new defect's objectId
                    var objectId = result.get('ObjectID');

                    var tags = result.getCollection('Tags');
                    tags.load({
                        callback: function() {
                            Ext.Array.each(me._getTags(),function(tag){
                                tags.add(tag);
                            });
                            tags.sync({
                                callback: function() {
                                    //success!
                                }
                            });
                        },
                        scope:me
                    });


                    if(me.getSetting('showGrid') == true || me.getSetting('showGrid') == "true" ){
                        var model_filters = [{property:'PortfolioItem',value:me.getSetting('parentFeature')}];
                        var field_names = ['Name','ScheduleState','Project','Owner','Feature','PlanEstimate']

                        this._loadAStoreWithAPromise('UserStory', field_names,model_filters).then({
                            scope: this,
                            success: function(store) {
                                this._displayGrid(store,field_names);
                            },
                            failure: function(error_message){
                                alert(error_message);
                            }
                        }).always(function() {
                            me.setLoading(false);
                        });
                    }

                    // change the value of User Story name txt box with current time.
                        var currentTime = Ext.Date.format(new Date(), 'm/d/Y g:i:s A');
                        var usn =  me.getSetting('usName')+ ' ' + currentTime;
                        me.down('#userStoryName').setValue(usn);    

                }
            },
            scope:me
        });

    },


    _loadWsapiRecords: function(config){
        var deferred = Ext.create('Deft.Deferred');
        var me = this;
        var default_config = {
            model: 'Defect',
            fetch: ['ObjectID']
        };
        this.logger.log("Starting load:",config.model);
        Ext.create('Rally.data.wsapi.Store', Ext.Object.merge(default_config,config)).load({
            callback : function(records, operation, successful) {
                if (successful){
                    deferred.resolve(records);
                } else {
                    me.logger.log("Failed: ", operation);
                    deferred.reject('Problem loading: ' + operation.error.errors.join('. '));
                }
            }
        });
        return deferred.promise;
    },

    _loadAStoreWithAPromise: function(model_name, model_fields, model_filters){
        var deferred = Ext.create('Deft.Deferred');
        var me = this;
        this.logger.log("Starting load:",model_name,model_fields);
          
        Ext.create('Rally.data.wsapi.Store', {
            model: model_name,
            fetch: model_fields,
            filters: model_filters,
            sorters: [
                {
                    property: 'DragAndDropRank',
                    direction: 'ASC'
                }
            ]
        }).load({
            callback : function(records, operation, successful) {
                if (successful){
                    deferred.resolve(this);
                } else {
                    me.logger.log("Failed: ", operation);
                    deferred.reject('Problem loading: ' + operation.error.errors.join('. '));
                }
            }
        });
        return deferred.promise;
    },
    
    _displayGrid: function(store,field_names){
        this.down('#display_box').removeAll();
        this.down('#display_box').add({
            xtype: 'rallygrid',
            store: store,
            columnCfgs: field_names
        });
    },
    
    getOptions: function() {
        return [
            {
                text: 'About...',
                handler: this._launchInfo,
                scope: this
            }
        ];
    },
    
    _launchInfo: function() {
        if ( this.about_dialog ) { this.about_dialog.destroy(); }
        this.about_dialog = Ext.create('Rally.technicalservices.InfoLink',{});
    },
    
    isExternal: function(){
        return typeof(this.getAppId()) == 'undefined';
    },
    
    //onSettingsUpdate:  Override
    onSettingsUpdate: function (settings){
        this.logger.log('onSettingsUpdate',settings);
        // Ext.apply(this, settings);
        this.launch();
    }
});
