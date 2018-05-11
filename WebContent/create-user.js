function enregistrementF(formulaire) {
    var login = formulaire.pseudo.value;
    var password = formulaire.password.value;
    var prenom = formulaire.prenom.value;
    var nom = formulaire.nom.value;
    var email = formulaire.email.value;
    var dateN = formulaire.date_format.value;
    var ok = verif_formulaire_enregistrement(login, password, prenom, nom, email, dateN);
    if (ok) {
        enregistrement(login, password, email, prenom, nom, dateN);
        return true;
    } else {
        return false;
    }
}

function enregistrement(login, password, email, prenom, nom, dateN){
	
	$.ajax({
		type: "GET",
		url: "user/CreateUser",
		data:"login="+login+"&password="+password+"&nom="+nom+"&prenom="+prenom,
		dataType:"JSON",
		success: function(rep){
		    		if(rep.creationUtilisateur != undefined){
		    			alert("Utilisateur Créé avec succès");
		    			makeLoginPanel();
		    		}
		    		else{
		    			func_erreur(rep.message, "form");
		    		}
		    	},
		error: function(jqXHR , textStatus , errorThrown){
		    		alert(textStatus);
		    	}
	});
}


function verif_formulaire_enregistrement(login, password, prenom, nom, email, dateN) {

    if (login.length < 5) {
        func_erreur("Login trop court", ".forum_title");
        return false;
    } else if (login.length > 20) {
        func_erreur("Login trop long", ".forum_title");
        return false;
    }
    if (password.length < 6) {
        func_erreur("Mot de passe trop court", ".forum_title");
        return false;
    } else if (password.length > 32) {
        func_erreur("Mot de passe trop long", ".forum_title");
        return false;
    }
    if (prenom.length > 20) {
        func_erreur("Prenom trop long", ".forum_title");
        return false;
    }
    if (nom.length > 32) {
        func_erreur("Nom trop long", ".forum_title");
        return false;
    }

    // On a vu cela en clients-serveurs je vous explique
    var re_email = new RegExp("[a-z]+[@][a-z]+[\.][a-z]+");
    if (email.length < 1) {
        func_erreur("Adresse email trop courte.", ".forum_title");
        return false;
    } else if (email.length > 64) {
        func_erreur("Adresse email trop long.", ".forum_title");
        return false;
    } else if (!re_email.exec(email)) {
        func_erreur("L'adresse email saisie n'est pas correcte.", ".forum_title");
        return false;
    }

    return true;
}

function makeConnexionPanel() {
    $("body").load("create_user_addition.html");
}
