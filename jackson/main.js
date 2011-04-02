$(document).ready(function(){
    $("#sortable").sortable();
    $("#sortable").disableSelection();
    $("#add-new-list").click(addNewList);
    $("#change-size").submit(changeSize);
    changeSize();
});

// do an ajax post to given location with given vars. Return bool indicating 
// whether or not successful.
function doAjaxPost(postLocation, vars) {
    var success = false;
    $.post(postLocation, vars).success(function() {
        success = true;
    }).error(function(){
        alert("Unable to contact server.");
    });
    return error;
}

// AJAX call to add a new list
function addNewList(){
    var name = $('#list-name').val();
    if(!name || name.trim() == "") {
        alert("Please enter a list name");
        return !1;
    }
    doAjaxPost('/replace',{'list-name':name});
    $("#lists").append('<li><b><a href="#list">'+name+'</a></b> <a href="#remove">Remove</a>');
    return !1;
}

// set the width of sortable boxes
function setSortableWidth(numColumns) {
    var width = numColumns*(2+10+10+70);
    $("#sortable").css("width",width+"px");
}

function changeSize() {
    var cols = parseInt($("#cols").val());
    var rows = parseInt($("#rows").val());
    setSortableWidth(cols);
    $("#sortable").html("");
    for(var i=0;i<(rows*cols);i++) {
        $("#sortable").append('<li class="ui-state-default">'+(i+1)+'</li>');
    }
    return !1;
}
