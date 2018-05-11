function Friend(id, login, nom, prenom) {
    this.id = id;
    this.nom = nom;
    this.prenom = prenom;
    this.login = login;
}

function indexOfFriend(array, friend_id) {
    if ((array == undefined) || (friend_id == undefined)) {
        return -1;
    }

    for (var i = 0; i < array.length; i++) {
        if (array[i].id === friend_id) return i;
    }
    return -1;
}


/*recuperer la liste des following de l'utilsitaeur connecte*/
function getFollowingKey() {
    $.ajax({
        type: "GET",
        url: "friends/GetFriend",
        data: "key=" + env.key + "&idUtilisateur=-1",
        dataType: "JSON",
        async: false,
        success: function(rep) {
            if (rep.message == undefined) {
                for (var friend in rep) {
                    (env.following).push(new Friend(rep[friend].id_user, rep[friend].login, rep[friend].nom, rep[friend].prenom));
                    // (env.following).push(rep[friend].id_user);
                }

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


/*recuperer la liste des online friends*/
function getFollowingOnline() {
    $.ajax({
        type: "GET",
        url: "friends/GetFriend",
        data: "key=" + env.key + "&online=1",
        dataType: "JSON",
        success: function(rep) {
            if (rep.message == undefined) {
                env.following_online = new OnlineFriends();
                for (var friend in rep) {
                    (env.following_online).ajout(new Friend(rep[friend].id_user, rep[friend].login, rep[friend].nom, rep[friend].prenom));
                }

                $("body").append((env.following_online).getHtml());
            } else {
                alert(rep.message);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        }
    });
}


/*charger la page des friends de l'utilistaeur concerne*/
function makeFriendsPanel(fromId, login) {

    $("body").html('<div id="loaded"></div> <div id="loaded2"></div>');
    $("body #loaded").load("profile_page.html");
    $("body #loaded2").load("follow_page.html");
    $("body").append((env.following_online).getHtml());
    env.followers_profile = new Array();
    env.following_profile = new Array();
    //pour garder les amis possibles dans une liste et les recupurer apres 

    alert("Pour follow/Unfollow quelqu'un, accédez au profil de l'utilisateur !");

    /*si fromId undefiend, je cherche mes amis à moi*/
    if ((fromId == undefined) || (fromId == env.id)) {
        env.following_profile = env.following; /*on a deja la liste de following*/

        fromId = env.id;
        login = env.login;

        env.fromId = 0;

        getFollowers(fromId); /*on recupere les followers*/

    } else {
        getFollowers(fromId);
        getFollowing(fromId);
        env.fromId = fromId;
    }

    var profile = getVarProfileHtml(login);

    $("body").append(profile);

    var tmp = "";

    /*on rajoute la liste de followers recuperes a la balise qui les contiendra*/
    for (var friend in env.followers_profile) {

        if (env.followers_profile[friend].id == env.id) {
            tmp = '<div class="items_f"><img id="profilefr" src= "./TWISTER/empty-profile.png" /><a id="profile_namefr" href="javascript:void(0);" onClick="javascript:makeMainPanel(0, undefined, \'' + env.followers_profile[friend].login + '\')" >' + env.followers_profile[friend].login + '</a>';
            tmp = tmp + '</div>';
        } else {
            tmp = '<div class="items_f"><img id="profilefr" src= "./TWISTER/empty-profile.png" /><a id="profile_namefr" href="javascript:void(0);" onClick="javascript:makeMainPanel(' + env.followers_profile[friend].id + ', undefined, \'' + env.followers_profile[friend].login + '\')" >' + env.followers_profile[friend].login + '</a>';


            /*si cet utilisateur n'est pas followe par l'utilisateur connecte, on mettra un bouton follow*/
            if (indexOfFriend(env.following, env.followers_profile[friend].id) == -1) {
                tmp = tmp + '<div class = "item"><a class="but" href="javascript:void(0);" onClick="javascript:makeMainPanel(' + env.followers_profile[friend].id + ', undefined, \'' + env.followers_profile[friend].login + '\')" >Follow</a></div></div>';
            }

            /*sinon on met un boutton unfollow*/
            else {
                tmp = tmp + '<div class = "item"><a class="but" href="javascript:void(0);" onClick="javascript:makeMainPanel(' + env.followers_profile[friend].id + ', undefined, \'' + env.followers_profile[friend].login + '\')" >Unfollow</a></div></div>';
            }
        }
        $("#followers_container").append(tmp);
    }


    /*pareil que lq boucle d'avant*/
    for (var friend in env.following_profile) {

        if (env.following_profile[friend].id == env.id) {
            tmp = '<div class="items_f"><img id="profilefr" src= "./TWISTER/empty-profile.png" /><a id="profile_namefr" href="javascript:void(0);" onClick="javascript:makeMainPanel(0, undefined, \'' + env.following_profile[friend].login + '\')" >' + env.following_profile[friend].login + '</a>';
            tmp = tmp + '</div>';

        } else {

            tmp = '<div class="items_f"><img id="profilefr" src= "./TWISTER/empty-profile.png" /><a id="profile_namefr" href="javascript:void(0);" onClick="javascript:makeMainPanel(' + env.following_profile[friend].id + ', undefined, \'' + env.following_profile[friend].login + '\')" >' + env.following_profile[friend].login + '</a>';

            if (indexOfFriend(env.following, env.following_profile[friend].id) == -1) {
                tmp = tmp + '<div class = "item" id="benni"><a class="butbenni" href="javascript:void(0);" onClick="javascript:makeMainPanel(' + env.following_profile[friend].id + ', undefined, \'' + env.following_profile[friend].login + '\')" >Follow</a></div></div>';
            } else {
                tmp = tmp + '<div class = "item" id="benni"><a class="butbenni" href="javascript:void(0);" onClick="javascript:makeMainPanel(' + env.following_profile[friend].id + ', undefined, \'' + env.following_profile[friend].login + '\')" >Unfollow</a></div></div>'
            }
        }

        $("#following_container").append(tmp);
    }

}


function getVarProfileHtml(login) {
    var profile = "";
    //si env.fromId == 0 on charge le profil de l'utilisateur
    if (env.fromId == 0) {
        profile = '<div id="profile_menu"><div id="profile_photo_menu"><img src= "./TWISTER/empty-profile.png" /></div><div id="profile_items_container"><div id="name_profile">' + env.login + '</div><div class = "profile_menu_items"><a href="./en_cours_de_construction.html">Personal Information</a></div><div class = "profile_menu_items"><a href="javascript:void(0);" onClick="javascript:makeMainPanel(0, undefined, undefined);">Messages</a></div><div class = "profile_menu_items"><a href="javascript:void(0);" onClick="javascript:makeFriendsPanel();">Friends</a></div>\
        			<div class = "profile_menu_items"><a href="javascript:void(0);" onClick="javascript:deconnecte();">Logout</a></div></div></div>';
    } else {
        profile = '<div id="profile_menu"><div id="profile_photo_menu"><img src= "./TWISTER/empty-profile.png" /></div><div id="profile_items_container"><div id="name_profile">' + login + '</div><div class = "profile_menu_items"><a href="./en_cours_de_construction.html">Personal Information</a></div><div class = "profile_menu_items"><a href="javascript:void(0);" onClick="javascript:makeMainPanel(' + env.fromId + ', undefined, \'' + login + '\')">Messages</a></div><div class = "profile_menu_items"><a href="javascript:void(0);" onClick="javascript:makeFriendsPanel(' + env.fromId + ',\'' + login + '\')">Friends</a></div>';
        profile = profile + '<div class = "profile_menu_items"><a href="javascript:void(0);" onClick="javascript:sendPrivateMessage(\''+login+'\')">Private Message</a></div>';
        if (indexOfFriend(env.following, env.fromId) == -1) {
            profile = profile + '<div class = "profile_menu_items"><a href="javascript:void(0);" onClick="javascript:follow()">Follow</a></div></div></div>';
        } else {
            profile = profile + '<div class = "profile_menu_items"><a href="javascript:void(0);" onClick="javascript:unfollow()">Unfollow</a></div></div></div>';
        }
    }

    return profile;
}

function sendPrivateMessage(login){
	$("body #messages").remove();
	$("body #friends_all").remove();
	
	var tmp = '<div id="messages">\
	<form method="get" action="javascript:function q(){ return;}"  onSubmit="javascript:sendMessagePriveAjax(this,\''+login+'\')"><div id="addm"><textarea id="mont" name="contenu" maxlength="300" placeholder="WHATS ON YOUR MIND?" required></textarea><span id="remainingC">300</span></div><div id="submit_button"><input type="submit" value="Send Message" /></div></form>';
	
	getPrivateMessage(env.fromId, tmp);
}

function getPrivateMessage(id, tmp){
	 $.ajax({
	        type: "GET",
	        url: "message/GetMessagePrive",
	        asyc: false,
	        data: "key=" + env.key + "&idUtilisateur=" + id,
	        dataType: "text",
	        success: function(rep) {
	            if (rep.message == undefined) {
	            	env.messages = (JSON.parse(rep, revival_messagePrive)).list;
	            	var messages = '';
	            	for (var i = 0; i < (env.messages).length; i++) {
	                    messages = messages + ((env.messages)[i]).getHtml();
	                }
	            	tmp += messages;
	            	tmp += '</div>';
	            	$("body").append(tmp);
	           	 	ab();
	            } else {
	                alert(rep.message);
	            }
	        },
	        error: function(jqXHR, textStatus, errorThrown) {
	            alert(textStatus);
	        }
	    });
}

function sendMessagePriveAjax(form, login){
	var contenu = form.contenu.value;

    $.ajax({
        type: "GET",
        url: "message/MessagePrive",
        data: "key=" + env.key + "&login=" + env.login + "&message=" + contenu + "&idDest="+ env.fromId+"&loginDest="+login,
        dataType: "JSON",
        success: function(rep) {
            if (rep.message == undefined) {
            	alert("message envoye !");
            	sendPrivateMessage(login);
            } else {
                alert(rep.message);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        }
    });
}


function getFollowers(fromId) {
    var d = "key=" + env.key + "&followers=1";

    if (fromId != undefined) {
        d = d + "&idUtilisateur=" + fromId;
    }

    $.ajax({
        type: "GET",
        async: false,
        url: "friends/GetFriend",
        data: d,
        dataType: "JSON",
        success: function(rep) {
            if (rep.message == undefined) {
                for (var friend in rep) {
                    (env.followers_profile).push(new Friend(rep[friend].id_user, rep[friend].login, rep[friend].nom, rep[friend].prenom));
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


function getFollowing(fromId) {
    var d = "key=" + env.key;

    if (fromId != undefined) {
        d = d + "&idUtilisateur=" + fromId;
    }

    $.ajax({
        type: "GET",
        async: false,
        url: "friends/GetFriend",
        data: d,
        dataType: "JSON",
        success: function(rep) {
            if (rep.message == undefined) {
                for (var friend in rep) {
                    (env.following_profile).push(new Friend(rep[friend].id_user, rep[friend].login, rep[friend].nom, rep[friend].prenom));
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

function follow() {
    var d = "key=" + env.key + "&idFriend=" + env.fromId;
    $.ajax({
        type: "GET",
        async: false,
        url: "friends/NewFriend",
        data: d,
        dataType: "JSON",
        success: function(rep) {
            if (rep.message == undefined) {

                temp = new Friend(env.fromId, env.login_user);
                (env.following).push(temp);
                makeMainPanel(env.fromId, undefined, env.login_user);


            } else {
                alert(rep.message);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        }
    });
}

function unfollow() {
    var d = "key=" + env.key + "&idFriend=" + env.fromId;
    $.ajax({
        type: "GET",
        async: false,
        url: "friends/DeleteFriend",
        data: d,
        dataType: "JSON",
        success: function(rep) {
            if (rep.message == undefined) {

                i = indexOfFriend(env.following, env.fromId);
                temp = env.following[i];
                (env.following).splice(i, 1);
                makeMainPanel(env.fromId, undefined, env.login_user);
            } else {
                alert(rep.message);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        }
    });
}