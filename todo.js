//element seçme işlemi
const form=document.querySelector("#todo-form");
const todoInput=document.querySelector("#todo");
const todoList=document.querySelector(".list-group");
const firstCardBody=document.querySelectorAll(".card-body")[0];
const secondCardBody=document.querySelectorAll(".card-body")[1];
const filter=document.querySelector("#filter");
const clearButton=document.querySelector("#clear-todos");
eventListenners();
function eventListenners(){//tüm event listennerlar
    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosUI)//sayfa yenilendiği zaman çağırılan fonk DOMContentLoaded
    secondCardBody.addEventListener("click",deleteTodo);
    filter.addEventListener("keyup",filterTodos );
    clearButton.addEventListener("click",clearAllTodos);


}
function clearAllTodos(){
    //arayüzden todoları temizleme
    if(confirm("tümünü silmek istediğinize emin misiniz?")){
        //todoList.innerHTML="";//yavaş bir işlemdir.
        while(todoList.firstElementChild!=null){
            todoList.removeChild(todoList.firstElementChild);//todolistin çocuklarından ilk elemanı sil ta ki çocuğu kalmayana kadar. 
        }
        localStorage.removeItem("todos");

    }
}
//ARAMA İŞLEMİ
function filterTodos(e){
    const filterValue=e.target.value.toLowerCase();
    const listItems=document.querySelectorAll(".list-group-item");
    listItems.forEach(function(listItem){
        const text=listItem.textContent.toLowerCase();
        if(text.indexOf(filterValue)===-1){//eğer text ile filter value eşit değilse -1 döner
            //bulunamadı
            listItem.setAttribute("style","display:none !important");
        }
        else{
            listItem.setAttribute("style","display:block");
        }
    })

}
function deleteTodo(e){
    if(e.target.className==="fa fa-remove"){
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success","Todo başarıyla silindi...");
    }
}
function deleteTodoFromStorage(deletetodo){
    let todos=getTodosFromStorage();
    todos.forEach(function(todo,index){
        if(todo===deletetodo){
            todos.splice(index,1);//arrayden değer silme
        }
        localStorage.setItem("todos",JSON.stringify(todos));//storageye güncellenen değeri yükleme.
    })
}
function loadAllTodosUI(){
    let todos=getTodosFromStorage();
    todos.forEach(function(todo){
        addTodoToUI(todo);
    })
}
function addTodo(e){
    const newTodo=todoInput.value.trim();
    if(newTodo==""){//input alanı boş mu boş ise uyarı mesajı 
        showAlert("danger","Lütfen bir todo giriniz!");
        // <div class="alert alert-danger" role="alert">
        //     This is a danger alert—check it out!
        // </div>
    }
    else{
        addTodoToUI(newTodo);// dolu ise arayüze todoyu ekle
        addTodoToStorage(newTodo);
        showAlert("success", newTodo+" başarılı bir şekilde eklendi...");
        
        
    }
    // console.log(newTodo);
    

    e.preventDefault();
}
function getTodosFromStorage(){//storageden bütün todoları alır
    let todos;
    if(localStorage.getItem("todos")===null){//todos adında bir key var mı
        todos=[];
    }
    else{
        todos=JSON.parse(localStorage.getItem("todos"));//arraya çevirdik
    }
    return todos;
}
function addTodoToStorage(newTodo){
    let todos=getTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos",JSON.stringify(todos));

}
function showAlert(type,message){
    const alert=document.createElement("div");
    alert.className=`alert alert-${type}`;
    alert.textContent=message   ;
    firstCardBody.appendChild(alert);
    setTimeout(function(){
        alert.remove();
    },1000)

}
function addTodoToUI(newTodo){//string değeri list item olarak ekler
    // <li class="list-group-item d-flex justify-content-between">
    //     Todo 1
    //     <a href = "#" class ="delete-item">
    //         <i class = "fa fa-remove"></i>
    //     </a>
    // </li> 
    //list item oluşturma
    const listItem=document.createElement("li");
    //link oluşturma
    const link=document.createElement("a");
    //console.log(listItem);
    link.href="#";
    link.className="delete-item";
    link.innerHTML= "<i class = 'fa fa-remove'></i>";
    listItem.className="list-group-item d-flex justify-content-between";
//text node ekleme
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    //todoliste list item ekleme

    todoList.appendChild(listItem);
    todoInput.value="";

}