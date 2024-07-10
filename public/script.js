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
            const {_id, title, timeStamp} = task;
            console.log(title);
            console.log(_id);
            console.log(timeStamp);
            return `
                <div class="thread" data-task-id = "${_id}" value="${title}" data-timestamp="${timeStamp}">
                    <div class="group">
                        <label class="checkbox">
                            <input type="checkbox" />
                            <span class="checkmark"></span>
                        </label>
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

        const response = await fetch(`/todo/task/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, time }),
        });

        if(!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const updatedTask = await response.json();
        console.log('Updated Task: ', updatedTask);
        window.location.href = `./edit.html?id=${id}`;
    } catch (error) {
        console.error('Error updating task: ', error);
    }
};
