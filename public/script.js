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
            const {_id, title, timeStamp, check} = task;
            console.log(title);
            console.log(_id);
            console.log(timeStamp);

            const textDeco = check ? 'text-decoration: line-through;' : '';
            const changeClassName = check ? 'thread checked' : 'thread';
            return `
                <div class="${changeClassName}" data-task-id = "${_id}" value="${title}" data-timestamp="${timeStamp}">
                    <div class="group">
                        <label class="checkbox">
                            <input type="checkbox" ${check ? 'checked' : ''}/>
                        </label>
                        <h3><span class="deco" style="${textDeco}">${title}</span></h3>
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
        const timeStamp = thread.getAttribute("data-timestamp")
        
        editTask(taskId, taskTitle, timeStamp);
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
const editTask = async(id, title, time) => {
    try {
        console.log("Edit task ID: ", id);
        console.log("Title: ", title);
        console.log("Timestamp: ", time);

        window.location.href = `./edit.html?id=${id}`;
    } catch (error) {
        console.error('Error updating task: ', error);
    }
};

// check
taskSectionDOM.addEventListener("change", async(event) => {
    const checkbox = event.target;
    if (checkbox.type === "checkbox") {
        const thread = checkbox.closest(".thread");
        const taskId = thread.getAttribute("data-task-id");
        
        try {
            await axios.put(`/todo/task/check/${taskId}`, {
                check: checkbox.checked,
            });
            console.log(`Task ${taskId} checkbox updated to ${checkbox.checked}`);
            getAllTask();
        } catch (error) {
            console.log(error);
        }
    }
    else {
        console.log("There are some issues happend right now");
    }
});