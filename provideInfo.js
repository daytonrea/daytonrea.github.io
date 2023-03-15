console.log(window.location.href);
var hrefSave = window.location.href;
if(hrefSave.indexOf("#")) {
    var codeToDecrypt = hrefSave.substring(hrefSave.indexOf("#") + 1, hrefSave.length + 1)
    console.log(codeToDecrypt)
}