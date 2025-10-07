const form=document.forms.search;
function handleSubmit(event){
    event.preventDefault();
    const formData=new FormData(event.target);
}
FormDataEvent.addEventListener("submit",handleSubmit)