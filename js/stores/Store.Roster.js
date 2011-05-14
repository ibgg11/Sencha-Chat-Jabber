Ext.ns('App.Store');

App.Store.Roster = [{
    text: 'User 1'
},
{
    text: 'User 1'
},
{
    text: 'User 1'
},
{
    text: 'User 1'
}
];

Ext.regModel('Demo', {
    fields: [
        {name: 'text',        type: 'string'}
    ]
});

App.Store.RosterStore = new Ext.data.TreeStore({
    model: 'Demo',
    root: {
        items: App.Store.Roster
    },
    proxy: {
        type: 'ajax',
        reader: {
            type: 'tree',
            root: 'items'
        }
    }
});