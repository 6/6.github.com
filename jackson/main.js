$(document).ready(function(){
    $("#add-new-list").click(addNewList);
});

function doAjaxPost(postLocation, vars, toTempDisable, successMessage) {
        $(toTempDisable)
    for(var i=0; i<toTempDisable.length; i++) {
        $(toTempDisable[i]).attr('disabled','true');
    }
    $.post(postLocation, vars).success(function() {
        alert(successMessage);
    }).error(function(){
        alert("Unable to contact server.");
    });
    for(var i=0; i<toTempDisable.length; i++) {
        $(toTempDisable[i]).removeAttr('disabled');
    }
}

// AJAX call to add a new list
function addNewList(){
    var name = $('#list-name').val();
    if(!name || name.trim() == "") {
        alert("Please enter a list name");
        return !1;
    }
    doAjaxPost('/replace',{'list-name':name},['#list-name'],"Hooray!");
    return !1;
}
