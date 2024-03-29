/**
 * Chat Controller
 *
 * @author Nils Dehl <mail@nils-dehl.de>
 */
Ext.regController('Chat', {
	/**
	 * Index action
	 *
	 * @return {void}
	 */
	
	index: function() {
		
	//	if (!this.socket) {
	///		this.initSocketConnection();
	//	}


		this.showChat();
	},

	/**
	 * init the socket connection to the node.js server
	 * using user settings
	 *
	 */
	initSocketConnection: function() {
		this.chatStore = new App.Store.Chat();
		this.configStore = Ext.StoreMgr.get('ConfigStore');
		var settings = this.configStore.getAt(0);

		this.socket = new App.util.Socketio(settings.get('server'), {port: 4000});
		this.socket.connect();

		// Event Listener
		this.socket.on(
			'connect',
			this.registerUser,
			this
		);

		this.socket.on(
			'message',
			this.addMessageToChatStore,
			this
		);

		App.on(
			'newMsg',
			this.sendMessageToServer,
			this
		);
	},

	sendMessageToServer: function(msg){
		this.socket.send(msg);
	},

	addMessageToChatStore: function(message) {
		this.chatStore.add(message);
	},

	registerUser: function() {
		var settings = this.configStore.getAt(0);
		var user = {
			username: settings.get('username'),
			facebookphoto: settings.get('facebookphoto')
		};
		this.socket.send(user);
	},
	
	connected: function(){
		console.log('controller chat connected');
		console.log('connection_ MUC' + connection_.NS_MUC);
		
		connection_.joined = false;
	    connection_.participants = {};

	    connection_.con.send($pres().c('priority').t('-1'));
	   	connection_.con.addHandler(connection_.on_presence, null,"presence");
	    connection_.con.addHandler(connection_.on_public_message, null,"message", "groupchat");
	    connection_.con.addHandler(connection_.on_private_message,null, "message", "chat");
	
		connection_.con.send(
	        $pres({
	            to: connection_.room + "/" + connection_.nickname
	        }).c('x', {xmlns: connection_.NS_MUC}));
	},
	
	InitConnection: function(options){
		connection_ = new App.util.Strophe(options.url, options.username, options.password);
		//this.connection_.connect();
		//console.log("connection started");
		//this.connect(options.url, options.username, options.password);
	},
	
	
	
	showChat: function() {
		Ext.dispatch({
			controller: 'Chat',
			action    : 'index'
		});
	},
	

	

	/**
	 * Show chat view
	 */
	showChat: function() {
		
		this.viewChat = new App.View.GroupChat();
		this.application.viewport.setActiveItem(
			this.viewChat,
			{
				type: 'flip',
				duration:400
			}
		);

		this.viewChat.query('#settingsButton')[0].on(
				'tap',
				this.showConfig,
				this
		);

	},

	/**
	 * Show config View
	 */
	showConfig: function() {
		Ext.dispatch({
			controller: 'Viewport',
			action    : 'showConfig'
		});
	}
});