const NUMBER_OF_TRYS = 6;
const NUMBER_OF_LETTERS = 5;
let WORDLE;
let __cursor;
let __line;
let __newLine;
let __guess;
let __answer;


/* -------------------------------- Elements -------------------------------- */
const btns = document.querySelectorAll('button');
const board = document.querySelectorAll('.inBord');
const generate = document.querySelector('.generate')
/* ------------------------------------ - ----------------------------------- */


/* -------------------------- guess have a meaning -------------------------- */
async function __wordMeaningful()
{
    let response = await fetch("https://words.dev-apis.com/validate-word", {
        method: 'POST',
        body: JSON.stringify({ word : __guess })
    })
    let result = await response.json();
    console.log(`==> ${result}`);
    console.log(`==> ${result.validWord}`);
    return result.validWord;
}
/* ------------------------------------ - ----------------------------------- */


/* -------------------------------- InitEtat -------------------------------- */
async function newWord()
{
    const url = 'https://random-words5.p.rapidapi.com/getRandom?wordLength=5';
    const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'b290ec570cmshca79ac4355aa1dbp121678jsn9023a98f6945',
		'X-RapidAPI-Host': 'random-words5.p.rapidapi.com'
	    }
    };
    try {
        const response = await fetch(url, options);
        const result = await response.text();
        WORDLE = result.toUpperCase();
    } catch (error) {
        console.error(error);
    }
}

function __init()
{
    let __i = 0;
    __cursor = 0;
    __newLine = true;
    __guess = "";
    __line = 1;
    __answer = false;
    newWord();
    let welcome = setInterval(() => {
        board[__i].className = 'breathAnimation';
        board[__i].innerText = '';
        if (__i == NUMBER_OF_LETTERS * NUMBER_OF_TRYS - 1)
        {
            board.forEach(e => {e.className = 'inBord';})
            clearInterval(welcome);
        }
        __i++;
    }, 20);
}
__init();

/* ------------------------------------ - ----------------------------------- */


/* --------------------------------- Events --------------------------------- */
generate.addEventListener('click', () => {
    __init();
});

btns.forEach(btn => {
    btn.addEventListener('click', (event) => {
        if (__line <= NUMBER_OF_TRYS + 1)
        {
            if (event.target.className)
                action(event.target.className);
            else
                letterHandler(event.target.innerText);
        }
    });
});
document.addEventListener('keydown', (event) => {
    console.log(event.keyCode);
    if (event.keyCode == 27)
        __init();
    else
    {
        if (__line <= NUMBER_OF_TRYS + 1)
        {
            if (event.keyCode >= 65 && event.keyCode <= 90)
            letterHandler(event.key.toUpperCase());
            else
            action(null, event.keyCode);
        }
    }
});
/* ------------------------------------ - ----------------------------------- */


/* ------------------------- handle enter and delete ------------------------ */
async function action(divClass, __key)
{ 
    if (__cursor && (divClass == "delete" || divClass == "fa-solid fa-delete-left" || __key == 8) && __guess.length > 0)
    {
        board[__cursor - 1].innerText = '';
        board[__cursor - 1].classList.remove('breathAnimation');
        __guess = __guess.slice(0, __guess.length - 1)
        __cursor--;
    }   
    if ((divClass == "enter" || __key == 13))
    {        
        let response = await fetch("https://words.dev-apis.com/validate-word", {
            method: 'POST',
            body: JSON.stringify({ word : __guess })
        })
        let result = await response.json();
        meaningful = result.validWord;

        if((__guess.length == NUMBER_OF_LETTERS) && meaningful)
        {
            __coloring(__verifyLetters(__guess));
            __guess = "";
            __newLine = false;
            __line++;
        }
        else
        {
            if(__newLine || !meaningful)
            {
                let __i = 0;
                while (__i < __guess.length)
                {
                    board[__cursor - 1 - __i].classList.remove('breathAnimation');
                    board[__cursor - 1 - __i].classList.add('errorWord');
                    __i++;
                }
                setTimeout(() => {
                    __i = 0;
                    while (__i < __guess.length)
                    {
                        board[__cursor - 1 - __i].classList.remove('errorWord');
                        __i++;
                    }
                }, 100);
            }
        }
    }
}
/* ------------------------------------ - ----------------------------------- */


/* -------------------------- handler input letter -------------------------- */
function letterHandler(letter)
{
    if (__guess.length != NUMBER_OF_LETTERS && __line <= NUMBER_OF_TRYS && !__answer)
    {
        __newLine = true;
        __guess += board[__cursor].innerText = letter;
        board[__cursor].classList.remove('errorWord');
        board[__cursor++].classList.add('breathAnimation');
    }
}
/* ------------------------------------ - ----------------------------------- */


/* ------------------------ verify letters if correct ----------------------- */
function __verifyLetters(__str)
{
    let __i = 0;
    let __wordle = WORDLE.split(''); 
    let __colors = ["NOTEXIST", "NOTEXIST", "NOTEXIST", "NOTEXIST", "NOTEXIST"];
    
    __answer = true;
    while (__i < NUMBER_OF_LETTERS)
    {
        if (__str[__i] == __wordle[__i])
        {
            __wordle[__i] = "";
            __colors[__i] = "CORRECT";
        }
        else
            __answer = false;
        __i++;
    }
    __i = 0
    while (__i < NUMBER_OF_LETTERS)
    {
        if (__wordle.includes(__str[__i]))
        {
            __wordle[__wordle.indexOf(__str[__i])] = "";
            __colors[__i] = "EXIST";
        }
        __i++;
    }
    return __colors;
}
/* ------------------------------------ - ----------------------------------- */


/* ---------------------------- css manipulation ---------------------------- */
function __coloring(__colors)
{
    let __i = __cursor - NUMBER_OF_LETTERS;
    let __j = 0;
    let anim = "verifying";
    if (__answer)
        anim = "win";
    else if (__line == NUMBER_OF_TRYS)
    {
        //lose
    }
    let __coloring = setInterval(() => {
        board[__i++].className = `inBorad ${anim} ${__colors[__j++]}`;
        if(__j == NUMBER_OF_LETTERS)
            clearInterval(__coloring);
    }, 100);
}
/* ------------------------------------ - ----------------------------------- */