//REVIVAL DES MESSAGES
function revival_message(key, value) {

    if (value.contenu != undefined) {
        var c = new Message(value.id_inc, parseInt(value.id_user), value.pseudo_user, value.contenu, new Date(value.date), value.comments);
        return c;
    } else if ((value.id_comment != undefined) && (value.id_user_c != undefined)) {
        var c = new Commentaire(value.id_comment, parseInt(value.id_user_c), value.pseudo_user_c, value.contenu_c, new Date(value.date_c));
        return c;
    } else if (key == "date" || key == "date_c") {
        return new Date(value);
    }

    return value;
}


//REVIVAL DES MESSAGES PRIVES
function revival_messagePrive(key, value) {

    if (value.message != undefined) {
        var c = new MessagePrive(value.id_inc, parseInt(value.idUser), value.login, value.message, new Date(value.date));
        return c;
    } else if (key == "date" || key == "date_c") {
        return new Date(value);
    }

    return value;
}