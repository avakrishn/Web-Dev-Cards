//----------------------------------Global Variables
var i = 0;
var length, URL, currentText;
var canSwitch = true;

//----------------------------------Functions

// functions empties the div that contains the flashcard before invoking AJAX query to repopulate card with properties from the object at index int
function updateCard(int){
    $('.front, .back').empty();
    $.ajax({
        url: URL,
        method: 'GET'
    }).then(function(res){
        length = res.length;
        console.log(res);
        var category = $("<p>").html(res[int].category).addClass('edit').attr('data-name', 'category').attr('data-id', res[int].id);
        var front = $("<p>").html(res[int].front).addClass('edit').attr('data-name', 'front').attr('data-id', res[int].id);
        var back = $("<p>").html(res[int].back).addClass('edit').attr('data-name', 'back').attr('data-id', res[int].id);
        var difficulty = $("<p>").html(res[int].difficulty).addClass('edit').attr('data-name', 'difficulty').attr('data-id', res[int].id);
        $('.front').append(category, front);
        $('.back').append(back, difficulty);
    });
}
 
// onclick of .leftArrow the subtract function is called that decreases the variable i by 1 and then executes the updateCard function with i as its argument
function subtract(){
    if(i > 0){
        i--;
        updateCard(i);
    }
}

// onclick of the .rightArrow the add function is called that increases the variable i by 1 and then executes the updateCard function with i as its argument
function add(){
    if(i <= length-2){
        i++;
        updateCard(i);
    }
}

//function allows user to edit the text on page (when they double click on text)
function editText(){
    currentText = $(this).text();
    // contenteditable allows you to have the user edit the content of the page
    $(this).attr('contenteditable','true');
    canSwitch = false;
    $(this).on('keypress',doneEditText);
}

//when key is pressed if key = return or enter then html is no longer editable by user
// if user presses key enter and there are only white spaces typed then the text reverts back to previous text
function doneEditText(event){
    var y = event.which || event.keyCode;
    if(y == 13){
        $(this).attr('contenteditable','false');
        canSwitch = true;
        if($(this).text().trim().length < 1){
            $(this).text(currentText);
        }
        else{
            
            colkey = $(this).attr('data-name');
            colval = $(this).text();
            idkey = "id"
            idval = $(this).attr('data-id');

            var dataOb = {};
            dataOb[colkey]= colval;
            dataOb["id"] = idval;

            $.ajax({
                url: '/flashcards/edit',
                method: 'PUT',
                data: dataOb
            }).then(function(res){
                console.log(res);
            });
        }
    }
}

// when the page loads and the window is ready, the updateCard function is executed with variable i= 0 as its argument
$(window).ready(function(){
    // window.location.href returns the href (URL) of the current page
    // setting the URL request for ajax query based on the href of the current page
    if (window.location.href.split('/flashcards/')[1] == 'all_cards'){
        URL = '/flashcards/community_cards';
    }else if(window.location.href.split('/flashcards/')[1] == "" ){
        URL = '/flashcards/view_cards'
        $(document).on('click', '.edit', editText);
    }
    console.log(i);
    updateCard(i);

});

// if the left key on keyboard is pressed then the subtract function is run and if the right key on the keyboard is pressed then the add function is run
$(document).on('keydown', function(){
    if(canSwitch){
        switchCards();
    }
});
    
function switchCards(){
    // left arrow
    if ((event.keyCode || event.which) == 37)
    {   
        subtract();
    }
    // right arrow
    if ((event.keyCode || event.which) == 39)
    {
        add();
    }   
}