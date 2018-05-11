function connexion(formulaire) {
    var login = formulaire.pseudo.value;
    var password = formulaire.password.value;
    var ok = verif_formulaire_connexion(login, password);
    if (ok) {
        connecte(login, password);
        return true;
    } else {
        return false;
    }
}

function verif_formulaire_connexion(login, password) {
    if (login.length == 0) {
        func_erreur("Login obligatoire", ".caption");
        return false;
    } else if (login.length > 20) {
        func_erreur("Login trop long", ".caption");
        return false;
    }
    if(password.length == 0){
        func_erreur("Password obligatoire", ".caption");
        return false;
    } else if (password.length > 20) {
        func_erreur("Password trop long", ".caption");
        return false;
    }
    return true;
}

function func_erreur(msg, element_to_prepend_to) {
    var msg_box = '<div id="msg_err_connexion">' + msg + '</div>';
    var old_msg = $("#msg_err_connexion");
    if (old_msg.length == 0) {
        $(element_to_prepend_to).prepend(msg_box);init
    } else {
        old_msg.replaceWith(msg_box);
    }
    $("#msg_err_connexion").css({"color": "white",
								"background-color":"red",
								 "opacity":0.5,
								 "margin-bottom": "5px",
								 "padding-left": "5px",
								 "font-size": "90%"});


	$("#msg_err_connexion").fadeIn().delay(1000).fadeOut(600);
}

function connecte(login, password){
	$.ajax({
    type: "GET",
    url: "user/Login",
    data:"login="+login+"&password="+password,
    dataType:"JSON",
    success: function(rep){
    				responseConnection(rep, login);
    			},
    error: function(jqXHR , textStatus , errorThrown){
    				alert(textStatus);
    			}
  });
}



function responseConnection(rep, login){
	if(rep.message == undefined){
		env.key = rep.key;
		env.id = rep.id;
		env.login = login;
		getFollowingKey();
	}else{
		func_erreur(rep.message, ".caption");
	}
}

function makeLoginPanel(){
    $("body").load("login.html");
}


function deconnecte(){
	$.ajax({
	    type: "GET",
	    url: "user/Logout",
	    data:"key="+env.key,
	    dataType:"JSON",
	    success: function(rep){
	    			if(rep.Logout != undefined){
	    				init();
	    				makeLoginPanel();
	    			}
	    			else{
	    				alert(rep.message);
	    			}
	    		},
	    error: function(jqXHR , textStatus , errorThrown){
	    				alert(textStatus);
	    			}
	  });
}

////////////////////////////////////////
