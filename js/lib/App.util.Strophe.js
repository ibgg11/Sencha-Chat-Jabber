Ext.ns('App.util');
/**
 * Socket.io  wrapper class
 * @class App.util.Socketio
 * @extends Ext.util.Observable
 */
App.util.Strophe = Ext.extend(Ext.util.Observable, {

	constructor: function(url, username, pass){


		App.util.Strophe.superclass.constructor.call(
			this
		);
		
		var that = this;
		
		con = null;
		connection = null;
	    room = null;
	    nickname = null;
	    NS_MUC = "http://jabber.org/protocol/muc";
	    joined = null;
	    participants = null;

		nickname = username;
		room = "mtvn@conference.afrogjumps.com";

		username = username+"@afrogjumps.com";
			
		this.con = new Strophe.Connection(url);
	    this.con.connect(username, pass, that.connectCallback);
		this.addEvents('custom_event');
	},
		// disconnecting from server
		disconnect: function(){
		    if(con){
		        con.disconnect();
		    }
		},

		room_joined: function(){
			console.log('room_joined');

			joined = true;
		 //   $('#leave').removeAttr('disabled');
		 //   $('#room-name').text(Groupie.room);
		    this.add_message("<div class='notice'>*** Room joined.</div>")
		},

		user_joined: function(ev, nick){
			console.log('user_joined');
		    var message = {user:'cueca', message:'joined'};
			chatStore.add(message);

		},

		user_left: function(ev, nick){

			console.log('user_left');

		    var message = {user:'cueca', message:'joined'};
			chatStore.add(message);
		},

		on_presence: function (presence) {

			console.log('on_presence = ' +presence);

	       	var from = Ext.get(presence).getAttribute('from');
	        var room1 = Strophe.getBareJidFromJid(from);
			console.log('on_presence from '+from);

	        return true; 

	    },

	    on_public_message: function (message) {
			console.log('on_public_message');

	      /*  var from = $(message).attr('from');
	        var room = Strophe.getBareJidFromJid(from);
	        var nick = Strophe.getResourceFromJid(from);

	        // make sure message is from the right place
	        if (room === room) {
	            // is message from a user or the room itself?
	            var notice = !nick;

	            // messages from ourself will be styled differently
	            var nick_class = "nick";
	            if (nick === nickname) {
	                nick_class += " self";
	            }

	            var body = $(message).children('body').text();

	            var delayed = $(message).children("delay").length > 0  ||
	                $(message).children("x[xmlns='jabber:x:delay']").length > 0;

	            // look for room topic change
	            var subject = $(message).children('subject').text();
	            if (subject) {
	                $('#room-topic').text(subject);
	            }

	            if (!notice) {
	                var delay_css = delayed ? " delayed" : "";

	                var action = body.match(/\/me (.*)$/);
	                if (!action) {
	                    this.add_message(
	                        "<div class='message" + delay_css + "'>" +
	                            "&lt;<span class='" + nick_class + "'>" +
	                            nick + "</span>&gt; <span class='body'>" +
	                            body + "</span></div>");
	                } else {
	                    this.add_message(
	                        "<div class='message action " + delay_css + "'>" +
	                            "* " + nick + " " + action[1] + "</div>");
	                }
	            } else {
	                this.add_message("<div class='notice'>*** " + body +
	                                    "</div>");
	            }
	        }

	        return true; */
	    },

	    add_message: function (msg) {

		console.log('add_message');
	        // detect if we are scrolled all the way down
	        //var chat = $('#chat').get(0);
	      /*  var at_bottom = chat.scrollTop >= chat.scrollHeight - 
	            chat.clientHeight;

	        $('#chat').append(msg);

	        // if we were at the bottom, keep us at the bottom
	        if (at_bottom) {
	            chat.scrollTop = chat.scrollHeight;
	        } */
	    },

	    on_private_message: function (message) {
			console.log('on_private_message');

	      /*  var from = $(message).attr('from');
	        var room = Strophe.getBareJidFromJid(from);
	        var nick = Strophe.getResourceFromJid(from);

	        // make sure this message is from the correct room
	        if (room === this.room) {
	          var body = $(message).children('body').text();
	            this.add_message("<div class='message private'>" +
	                                "@@ &lt;<span class='nick'>" +
	                                nick + "</span>&gt; <span class='body'>" +
	                                body + "</span> @@</div>");

	        }

	        return true; */
	    },

		//Callback function to see the connection state
		connectCallback: function (status) {

		    var stat=''; // <---- this is the var i want to add a listener to

		    if (status === Strophe.Status.CONNECTED) {
				console.log('connected');

				Ext.dispatch({
					controller: 'Chat',
					action    : 'connected'
				});

			/*	console.log('connected2');

				//Ext.Msg.alert('Sucess', stat);

		        console.log('CONNECTED TO SERVER!');
		        stat='CONNECTED TO SERVER!';
				participants = {};

				joined = false;

		  		con.send($pres().c('priority').t('-1'));



				console.log('chat room ', room);
				console.log('NS_MUC ', NS_MUC);

			    con.send(
			        $pres({
			            to: room + "/" + nickname
			        }).c('x', {xmlns: NS_MUC})); 

			   	con.addHandler(this.on_presence, null,"presence");
			    con.addHandler(this.on_public_message, null,"message", "groupchat");
			    con.addHandler(this.on_private_message,null, "message", "chat");  */

		    }else if (status === Strophe.Status.DISCONNECTED){
		        console.log('DISCONNECTED');
		        stat='DISCONNECTED';
	        	Ext.Msg.alert('Error', stat);
		    }else if (status === Strophe.Status.AUTHENTICATING ){
		        console.log('Attempting to AUTHENTICATE');
		        stat='Attempting to AUTHENTICATE ';
	        	Ext.Msg.alert('', stat);
		    }else if (status === Strophe.Status.DISCONNECTING ){
		        console.log('DISCONNECTING');
		        stat='DISCONNECTING';
	        	Ext.Msg.alert('', stat);
		    }else if (status === Strophe.Status.CONNFAIL  ){
		        console.log('Problem while establishing connection');
		        stat='Problem while establishing connection';
		        Ext.Msg.show({
	                 title: stat,
	                 msg: '',
	                 icon: Ext.MessageBox.ERROR
	             });
		    }else if (status === Strophe.Status.AUTHFAIL ){
		        console.log('error during authentification');
		        stat='Error during authentification';
		        Ext.Msg.show({
	                 title: stat,
	                 msg: '',
	                 icon: Ext.MessageBox.ERROR
	             });
		    }else if (status === Strophe.Status.CONNECTING ){
		        console.log('Trying to connect');
		        stat='Trying to connect';
	        	Ext.Msg.alert('Error', stat);
		    }else{
				stat  = "Unknown error";
		        console.log('Unknown error');
	        	Ext.Msg.alert('Error', stat)

		    }
		},
});
Ext.reg('App.util.Strophe', App.util.Strophe);