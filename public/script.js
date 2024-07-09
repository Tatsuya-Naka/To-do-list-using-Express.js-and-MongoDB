const taskSectionDOM = document.querySelector(".threads");
const inputTaskDOM = document.getElementById("inputTitle");
const formDOM = document.querySelector(".form-section");
let inputTask = "";
// console.log(axios);
const getAllTask = async() => {
    try {
        let allTask = await axios.get("/todo/all");
        console.log(allTask);
        let {data} = allTask;
        
        allTask = data.map((task) => {
            const {_id, title} = task;
            console.log(title);
            console.log(_id);
            return `
                <div class="thread" data-task-id = "${_id}" value="${title}">
                    <div class="group">
                        <i class='bx bx-check-circle'></i>
                        <h3>${title}</h3>
                    </div>
                    <div class="items">
                        <form class="edit-items">
                            <a href="#" id="edit"><i class='bx bxs-edit' ></i></a>
                        </form>
                        <form class="trash-items">
                            <a href="#" id="trash"><i class='bx bxs-trash'></i></a>
                        </form>
                    </div>
                </div>
            `;
        }).join("");
        taskSectionDOM.innerHTML = allTask;
    } catch (err) {
        console.log(err);
    }
};

getAllTask();

inputTaskDOM.addEventListener("change", async(event) => {
    inputTask = event.target.value;
    console.log(inputTask);
});
formDOM.addEventListener("submit", async(event) => {
    event.preventDefault();
    if (inputTask) {
        console.log("create task");
        try {
            await axios.post("/todo/task", {
                title: inputTask,
            });
            // ???
            inputTask = ""; 
            getAllTask();
        } catch(error) {
            console.log(error);
        }
    }
});

// delete
taskSectionDOM.addEventListener("click", async(event) => {
    const target = event.target;
    if (target.closest("#edit")) {
        const thread = target.closest(".thread");
        const taskId = thread.getAttribute("data-task-id");
        const taskTitle = thread.getAttribute("value");
        
        editTask(taskId, taskTitle);
    }
    if (target.closest("#trash")) {
        const thread = target.closest(".thread");
        const taskId = thread.getAttribute("data-task-id");
        if (taskId) {
            event.preventDefault();
            await deleteTask(taskId);
        }
    }
});

const deleteTask = async(id) => {
    try {
        await axios.delete(`/todo/task/${id}`);
        getAllTask();
    } catch(err) {
        console.log(err);
    }
};

//Edit 
const editTask = async(id, title) => {
    console.log("Edit task ID: ", id);
    console.log("Title: ", title);
    // localStorage.setItem('editTaskId', id);
    localStorage.setItem('editTaskTitle', title);
    window.location.href = `./edit.html?id=${id}`
};
