function init() {
    noConnection = false;
    env = new Object();
    setVirtualMessage();
    env.following = new Array();
    env.Nofollowing = new Array();
    env.messages = new Array();
    env.following_online = new OnlineFriends();
}

function indexOfMessage(mid){
    for (var i = 0; i < (env.messages).length; i++) {
        if ((env.messages)[i].id === mid) return i;
    }
    return -1;
}

function OnlineFriends(logins) {
    if (this.tab == undefined) {
        this.tab = new Array();
    } else {
        this.tab = logins;
    }
}

OnlineFriends.prototype.ajout = function(login) {
    this.tab.push(login);
}

OnlineFriends.prototype.getHtml = function() {
    var t = '<div class="Online_Friends"><div id="title_online">Online Friends</div><div id="online_list">';

    this.tab.forEach(function(fr) {
        t = t + '<div class="online_items"><img id="profile" src= "./TWISTER/empty-profile.png" /><a id="profile_name" href="javascript:void(0);" onClick="javascript:makeMainPanel(' + fr.id + ', undefined, \'' + fr.login + '\')" >' + fr.login + '</a><div class="icon"></div></div>';
    });

    t = t + '</div></div>';

    return t;
}

function Message(id, id_auteur, login, texte, date, comments) {
    this.id = id;
    this.id_auteur = id_auteur;
    this.login = login;
    this.texte = texte;
    this.date = date;
    if (comments == undefined) {
        comments = [];
    }
    this.comments = comments;
}

Message.prototype.getHtml = function() {
	var indice = indexOfMessage(this.id);
    if (this.id_auteur == env.id) {
        var s = "<div class= \"un_message\" id=\"m"+this.id+"\"><div class=\"photo-profile\"><img id=\"profile_message\" src= \"./TWISTER/empty-profile.png\" /><div id=\"profile_name_message\"><a href=\"javascript:void(0);\" onClick=\"javascript:makeMainPanel(0, undefined, undefined);\">" + this.login + "</a><span id=\"d\"> on "+ this.date + "</span></div></div><div id = \"form\"><div class=\"center-data\">" + this.texte + "</div><div id=\"comments\"><div id=\"show_element\" class = \"comments_item\"><a id=\"show\" href=\"javascript:void(0);\" onClick=\"javascript:show_comments("+this.id+","+indice+");\">Show Comments</a></div><div class = \"comments_item\"><a href=\"javascript:void(0);\" onClick=\"javascript:deleteMessage(" + this.id + ")\">Delete Post</a></div></div></div></div>";
    } else {
        var s = "<div class= \"un_message\" id=\"m"+this.id+"\"><div class=\"photo-profile\"><img id=\"profile_message\" src= \"./TWISTER/empty-profile.png\" /><div id=\"profile_name_message\"><a href=\"javascript:void(0);\" onClick=\"javascript:makeMainPanel(" + this.id_auteur + ", undefined, '" + this.login + "')\">" + this.login + "</a><span id=\"d\"> on " + this.date + "</span></div></div><div id = \"form\"><div class=\"center-data\">" + this.texte + "</div><div id=\"comments\"><div id=\"show_element\" class = \"comments_item\"><a id=\"show\" href=\"javascript:void(0);\" onClick=\"javascript:show_comments("+this.id+","+indice+");\">Show Comments</a></div></div></div></div>";
    }
    return s;
}

function MessagePrive(id, id_auteur, login, texte, date) {
    this.id = id;
    this.id_auteur = id_auteur;
    this.login = login;
    this.texte = texte;
    this.date = date;
}

MessagePrive.prototype.getHtml = function() {
	var indice = indexOfMessage(this.id);
    if (this.id_auteur == env.id) {
        var s = "<div class= \"un_message\" id=\"m"+this.id+"\"><div class=\"photo-profile\"><img id=\"profile_message\" src= \"./TWISTER/empty-profile.png\" /><div id=\"profile_name_message\"><a href=\"javascript:void(0);\" onClick=\"javascript:makeMainPanel(0, undefined, undefined);\">" + this.login + "</a><span id=\"d\"> on "+ this.date + "</span></div></div><div id = \"form\"><div class=\"center-data\">" + this.texte + "</div></div></div>";
    } else {
        var s = "<div class= \"un_message\" id=\"m"+this.id+"\"><div class=\"photo-profile\"><img id=\"profile_message\" src= \"./TWISTER/empty-profile.png\" /><div id=\"profile_name_message\"><a href=\"javascript:void(0);\" onClick=\"javascript:makeMainPanel(" + this.id_auteur + ", undefined, '" + this.login + "')\">" + this.login + "</a><span id=\"d\"> on " + this.date + "</span></div></div><div id = \"form\"><div class=\"center-data\">" + this.texte + "</div></div></div>";
    }
    return s;
}

/*retourne l'indice du commentaire dont l'id est idComment du message courant*/
Message.prototype.indexComment = function(idComment){
	
	for(var i = 0; i< this.comments.length; i++){
		if(this.comments[i].id == idComment){
			return i;
		}
	}
	return -1;
}

function Commentaire(id, id_auteur, login_auteur, texte, date) {
    this.id = id;
    this.id_auteur = id_auteur;
    this.login_auteur = login_auteur;
    this.texte = texte;
    this.date = date;
}

/*retourne le code html du commentaire*/
Commentaire.prototype.getHtml = function(indexM){
	
	/*on donne a la balise comment-element un id cidComment (par exemple c0, c1 ...)*/
	var comment = '<div class="comment-element" id="c'+this.id+'"> \
	<div class="photo-profile"> \
		<img id="profile_message" src= "./TWISTER/empty-profile.png" /> \
		<div id="profile_name_message">';
	if(this.id_auteur == env.id){
		comment +=	'<a href="javascript:void(0);" onClick="javascript:makeMainPanel(0, undefined, undefined);">';
	}
	else{
		comment += '<a href="javascript:void(0);" onClick="javascript:makeMainPanel(' + this.id_auteur + ', undefined, \'' + this.login_auteur + '\');">';
	}
	
	comment +=	'' + this.login_auteur;
	comment +=	'</a> \
	<span id="d"> \
	on ' + this.date +  '\
	</span> \
	</div> \
	</div> \
	<div class="comment-text">';
	
	/*si le commentaire ou le message concerné appartient à l'utilsiateur, il a droit à effacer le commentaire*/
	if((this.id_auteur == env.id) || (env.id == (env.messages)[indexM].id_auteur)){
		comment += '<a id="com-del" href="javascript:void(0);" onClick="javascript:deleteComment('+this.id+','+indexM+');">' + this.texte + ' \
		</a></div> ';
	}
	else{
		comment += '' + this.texte + ' \
		</div> ';
	}
	
	comment += '</div> ';
	
	return comment;
}

/*suuprimer un commentaire: indexMessage est l'indice du message dans env.messages*/
function deleteComment(idComment, indexMessage){
	var answer = confirm("Delete Comment ?");
	
	var m = (env.messages)[indexMessage];
	
	if(answer){
		var indice = m.indexComment(idComment);
		
		if(indice != -1){
			
			$.ajax({
		        type: "GET",
		        url: "comments/DeleteComment",
		        data: "key=" + env.key +  "&idMessage=" + m.id + "&idComment=" + idComment,
		        dataType: "text",
		        success: function(rep) {
		            if (rep.message == undefined) {
		            	
		            	var tmp = "body #m"+m.id+ " #center-comments #c"+idComment;
		    			$(tmp).remove();
		    			m.comments.splice(indice, 1);
		                
		            } else {
		                alert(rep.message);
		            }
		        },
		        error: function(jqXHR, textStatus, errorThrown) {
		            alert(textStatus);
		        }
		    });
		}
	}
}

/*ajouter un commentaire - submit du formulaire add comment*/
function submit_add_comment(mid){
	var test = "body #m"+mid+ " #addc #mont";
	var texte = $(test).val();
	if(texte.length == 0){
		return;
	}
	
	var tmp = "body #m"+mid+ " #addc";
	$(tmp).submit();
}

/*fonction afin d'activer le compteur de caractère dans le cadre d'ajout de commentaire*/
function abComments(idm) {
	
	var tmp3 = "body #m"+idm+ " #addc #mont";
	
	var remaining = "body #m"+idm+ " #addc #remainingC";

    $(tmp3).keydown(function() {

        var l = $(this).val().length;

        if (l > 200) {
            return false;
        }
        $(remaining).text(200 - l);
    });
}


/*afficher le code html des commentaires d'un message*/
function show_comments(id, index){
	
	var m = (env.messages)[index];
	
	var c = '<div class="center-data" id="center-comments">';
	
	for(var i=0; i< (m.comments).length; i++){	 
		c += (m.comments)[i].getHtml(index);
	}
	
	c = c + '</div>';
	 
	 /*on selectionne le message concerne*/
	 var tmp = "body #m"+id+ " .center-data";
	 $(tmp).after(c);
	 
	 /*on remplace le bouton "show comments" par "hide comments" puisqu'on a affiché les commentaire*/
	 var tmp2 = "body #m"+id+ " #show"
	 $(tmp2).html("Hide Comments");
	 $(tmp2).attr("onClick","javascript:hide_comments("+id+","+index+")");
	 
	 
	 /*pour l'ajout d'un commentaire*/
	 var addcom = '<form method="get" action="javascript:function q(){ return;}"  onSubmit="javascript:addComment(this,'+index+')" id="addc"> \
		 			<div id="addm"> \
						<textarea id="mont" name="contenu" maxlength="200" placeholder="Leave Your Comment..." required></textarea> \
					<span id="remainingC"> \
						200 \
					</span> \
					</div> \
				</form>';
	 
	 
	 var tmp3 = "body #m"+id+ " #center-comments";
	 $(tmp3).after(addcom);
	 
	 var tmp4 = "body #m"+id+ " #show_element";
		 
	 var addc = '<div id="add_element" class = \"comments_item\"><a id=\"adc\" href=\"javascript:void(0);\" onClick=\"javascript:submit_add_comment('+id+');\">Add Comment</a></div>';
	 
	 $(tmp4).after(addc);
	 
	 abComments(id);
	
	 
}

/*ajout d'un commentaire*/
function addComment(form, indexMessage){
	 var m = (env.messages)[indexMessage];
	
	 /*le servlet addComment renvoie l'objet commentaire direct afin de l'ajouter au code html sans difficulté*/
	 $.ajax({
	        type: "GET",
	        url: "comments/AddComment",
	        data: "key=" + env.key + "&login=" + env.login + "&idMessage=" + m.id + "&comment=" + form.contenu.value,
	        dataType: "text",
	        success: function(rep) {
	            if (rep.message == undefined) {
	            	/*on ajoute le commentaire au message concerne*/
	            	var com = JSON.parse(rep, revival_message).Comment;
	                (m.comments).push(com);
	                
	                /*on ajoute son code html au message concerne aussi*/
	                var comment = com.getHtml(indexMessage);
					
					var tmp = "body #m"+ m.id+ " #center-comments";
					$(tmp).append(comment);
					
					var test = "body #m"+m.id+ " #addc #mont";
					$(test).val('');
					
	                
	            } else {
	                alert(rep.message);
	            }
	        },
	        error: function(jqXHR, textStatus, errorThrown) {
	            alert(textStatus);
	        }
	    });
}

/* fonction pour replier les commentaires*/
function hide_comments(id, index){
	/*on remplace le bouton "hide comments" par "show comments"*/
	var tmp2 = "body #m"+id+ " #show"
	$(tmp2).html("Show Comments");
	$(tmp2).attr("onClick","javascript:show_comments("+id+","+index+")");
	
	/*on retire le code html des commentaires*/
	var tmp = "body #m"+id+ " #center-comments";
	$(tmp).remove();
	
	var tmp3 = "body #m"+id+ " #addc";
	$(tmp3).remove();
	
	var tmp4 = "body #m"+id+ " #add_element";
	$(tmp4).remove();
}

/*on a jamais utilisé cet objet*/
function Auteur(id, login) {
    this.id = id;
    this.login = login;
}


function setVirtualMessage() {
    localbd = [];
    follows = [];
    var user1 = { "id": 1, "login": "toto" };
    var user2 = { "id": 2, "login": "titi" };
    var user3 = { "id": 3, "login": "tutu" };
    follows[1] = new Set();
    follows[1].add(2);

    follows[2] = new Set();
    follows[2].add(3);

    online = new OnlineFriends(["lolo", "lili", "loulou", "hahahhahahahahaha"]);

    var com1 = new Commentaire(2, user3, "Comment 1", new Date());
    var com2 = new Commentaire(3, user1, "Comment 2", new Date());
    var com3 = new Commentaire(4, user2, "Comment 3", new Date());

    localbd[1] = new Message(1, user1, "Message 1", new Date(), [com1, com2]);
    localbd[2] = new Message(2, user1, "Message 2", new Date());
    localbd[3] = new Message(3, user1, "Message 2", new Date());
    localbd[4] = new Message(4, user1, "Message 2", new Date());
    localbd[5] = new Message(5, user1, "Message 2", new Date(), [com3]);
    localbd[6] = new Message(6, user1, "Message 2", new Date());
    localbd[7] = new Message(7, user1, "Message 2", new Date());
}


function addMessage(form) {
    var contenu = form.contenu.value;

    $.ajax({
        type: "GET",
        async: false,
        url: "message/NewMessage",
        data: "key=" + env.key + "&login=" + env.login + "&message=" + contenu,
        dataType: "JSON",
        success: function(rep) {
            if (rep.message == undefined) {
                makeMainPanel(-1, undefined, undefined);
            } else {
                alert(rep.message);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        }
    });
}

/*afin de faire le compteur de caracteres pour ajouter un message*/
function ab() {

    $("#mont").keydown(function() {

        var l = $(this).val().length;

        if (l > 300) {
            return false;
        }
        $("#remainingC").text(300 - l);
    });
}

/*query maintenant sert pour recherche par mots cles*/
function makeMainPanel(fromId, query, login, searchFriends) {

    //alert("la");

    env.messages = new Array();

    //On charge la page de home
    if (fromId == undefined) {
        fromId = -1;
    }

    env.fromId = fromId;
    env.query = query;
    
    if(login != undefined){
    	env.login_user = login;
    }
    else{
    	env.login_user = undefined;
    }

    /*sert pour la bar de recherche*/
    if(env.checkUsers == undefined){
    	env.checkUsers = true;
    }
    
    if(searchFriends == undefined){
	    var post_message = "";
	    var profile = "";
	
	    //ON CHARGE LA HOME DE L'UTILISATEUR
	    if (env.fromId < 0) {
	        post_message = '<form method="get" action="javascript:function q(){ return;}"  onSubmit="javascript:addMessage(this)"><div id=\"addm\"><textarea id="mont" name="contenu" maxlength="300" placeholder=\"WHATS ON YOUR MIND?\" required></textarea><span id="remainingC">300</span></div><div id=\"submit_button\"><input type=\"submit\" value=\"Post Message\" /></div></form>';
	    }
	
	    //ON CHARGE UNE PAGE DE PROFIL
	    else {
	        profile = getVarProfileHtml(login);
	    }
	
	
	    tmp = "<div id = \"messages\">" + post_message;
	
	    completeMessages(env.key, fromId, undefined);
	    
	    env.checkUsers = true;
    }
    else{
    	tmp = '<div id = "messages">';
    	for(i=0; i< env.friendsCherches.length; i++){
    		if((env.friendsCherches[i].id != env.id)){
    			var t = '<div class="photo-profile"><img id="profile_message" src= "./TWISTER/empty-profile.png" /><div id="profile_name_message"><a href="javascript:void(0);" onClick="javascript:makeMainPanel('+(env.friendsCherches)[i].id+', undefined, \''+ (env.friendsCherches)[i].login+'\');">' + (env.friendsCherches)[i].login + '</a></div></div><br/><br/>';
    			tmp = tmp + t;
    		}
    	}
    	tmp = tmp + '</div>';
    }
	    
    $("body").html('<div id="loaded"></div>');
    if (env.fromId < 0) {
        $("body #loaded").load("home_page.html");
    } else {
        $("body #loaded").load("profile_page.html");
    }

    $("body").append(profile);
    
    if(searchFriends != undefined){
    	alert("Pour follow/Unfollow quelqu'un, accédez au profil de l'utilisateur !");
    	$("body #loaded header").append(tmp);
    }

    getFollowingOnline();
}



function completeMessages(fromKey, fromId, idMin) {

    var m = "";
    
    /*si idMin est undefined, on let met à 0*/
    if(idMin == undefined){
    	var d = "key=" + env.key + "&idMin=0&nb=10";
    }
    else{
    	var d = "key=" + env.key + "&idMin=" + idMin + "&nb=10";
    }
    
    if(env.checkUsers == true){
    	d = d + "&idUtilisateurs=";

	    /*si fromId == -1, donc on charge la page du home*/
	    if (fromId == -1) {
	        d = d + env.id;
	        for (var i = 0; i < (env.following).length; i++) {
	            d = d + "," + (env.following)[i].id;
	        }
	    } else {
	    	/*si fromId == 0, on charge le profil de l'utilisateur connecte*/
	        if (fromId == 0) {
	            d = d + env.id;
	        /*sinon, on charge le profil de quelqu'un d'autres et on cherche que ses messages*/
	        } else {
	            d = d + fromId;
	        }
	    }
    }
    
    /*si il y a des mots cles, on l'ajoute à la demande getMessages*/
    if(env.query != undefined){
    	d = d + "&motsCles=" + env.query;
    }

    $.ajax({
        type: "GET",
        url: "message/GetMessage",
        data: d,
        dataType: "text",
        success: function(rep) {
            if (rep.code == undefined) {
            	if(idMin == undefined){
            		env.messages = (JSON.parse(rep, revival_message)).list;
            		affiche_message_body();
            	}
            	else{
            		append_messages((JSON.parse(rep, revival_message)).list);
            	}

            } else {
                alert(rep.message);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        }
    });
}


/*afin de rajouter des messages à la liste des messages affiches (chargement itératif)*/
function append_messages(list_messages){
	
	var messages = "";
	
	var l = env.messages.length;

    for (var i = 0; i < (list_messages).length; i++) {
    	(env.messages).push((list_messages)[i]);
        messages = messages + ((list_messages)[i]).getHtml();
    }
    
    /*le chargement iteratif n'a pas bien marché, donc un appuie sur le bouton "more" par l'utilisateur fait le job*/
    $("body #messages #more").before(messages);
   
    if((env.messages.length % 10 != 0) || (env.messages.length == l)){
    	$("body #messages #more").remove();
    }
	
}



function affiche_message_body() {
    var messages = "";

    for (var i = 0; i < (env.messages).length; i++) {
        messages = messages + ((env.messages)[i]).getHtml();
    }

    tmp = tmp + messages;
    if(env.messages.length >= 10){
	    tmp += '<div id="more">\
					<a href="javascript:void(0);" onClick="javascript:fappeared();">\
						More...\
					</a> \
				</div>';
	    
	    tmp += "</div>";
    }
    $("body").append(tmp);
    ab();

    /*Le span qui contiendra le compteur de caracteres*/
    $("#remainingC").css({
        "position": "relative",
        "float": "right",
        "margin-right": "5px",
        "margin-bottom": "5px",
        "border-style": "solid",
        "border-color": "rgb(241, 89, 42)",
        "border-radius": "20px",
        "width": "42px",
        "height": "20px",
        "text-align": "center",
    });
    
}

/*est appele lors d'un appuie sur le bouton "more" pour afficher plus de messages*/
function fappeared(){
	var idM = (env.messages).length;
    completeMessages(env.key, env.fromId, idM);
}


function deleteMessage(idMessage) {
    var d = "key=" + env.key + "&idMessage=" + idMessage;
    $.ajax({
        type: "GET",
        async: false,
        url: "message/DeleteMessage",
        data: d,
        dataType: "JSON",
        success: function(rep) {
            if (rep.message == undefined) {
                if (env.fromId < 0) {
                    makeMainPanel(-1, undefined, undefined);
                } else {
                    javascript: makeMainPanel(0);

                }

            } else {
                alert(rep.message);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        }
    });
}


/* appele lors d'une recherche par mots cles (submit du formuilaire de la bar de recherche)*/
function getSearch(form){
	var requete = form.search.value;
	
	/*la case users a cote de la bar est coché ou pas*/
	env.checkUsers = form.Users.checked;
	
	/*la case posts a cote de la bar est coche ou pas*/
	if(form.Posts.checked){
		makeMainPanel(env.fromId, requete, env.login_user);
	}
	else{
		getFriendsSearch(requete);
	}
	
	/* PS: Posts coché seul: on recherche tous les posts sur le site contenant les mots cles voulus
	 * 	   Posts + Users coché ensemble : recherche des posts de moi et mes amis seulement contenant les mots cles
	 * 	   Users coché seulement: on recherche une liste d'amis (PAS ENCORE IMPLEMENTE)*/
}


function getFriendsSearch(requete){
	var d = "key=" + env.key + "&login=" + requete;
    $.ajax({
        type: "GET",
        async: false,
        url: "friends/GetFriend",
        data: d,
        dataType: "JSON",
        success: function(rep) {
            if (rep.message == undefined) {
            	env.friendsCherches = new Array();
            	for (var friend in rep) {
                    (env.friendsCherches).push(new Friend(rep[friend].id_user, rep[friend].login, rep[friend].nom, rep[friend].prenom));
                }
            	makeMainPanel(env.fromId, undefined, env.login, 1);

            } else {
                alert(rep.message);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        }
    });
}


/* appele lors d'une recherche par mots cles (submit du formuilaire de la bar de recherche)*/
function getSearchProfile(form){
	var requete = form.search.value;
	
	makeMainPanel(env.fromId, requete, env.login_user);
	
}

function popupw(){
	var tmp = '<div id="popup"> \
		Cochez : <br/> \
		Users et Posts pour chercher dans les posts de vous et vos following <br/> \
		Posts seulement pour chercher tous les messages sur le site <br/> \
		Users seulement pour chercher des utilisateurs\
		</div>';
	
	$("body #search_bar").after(tmp);
}

function popuphide(){
	$("body #popup").remove();
}