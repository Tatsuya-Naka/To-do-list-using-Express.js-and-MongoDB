const taskSectionDOM = document.querySelector(".threads");
const inputTaskDOM = document.getElementById("inputTitle");
const formDOM = document.querySelector(".form-section");
const deleteTaskDOM = document.getElementById("trash");
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
                <div class="thread" data-task-id = "${_id}">
                    <div class="group">
                        <i class='bx bx-check-circle'></i>
                        <h3>${title}</h3>
                    </div>
                    <div class="edit-items">
                        <a href="#"><i class='bx bxs-edit' ></i></a>
                        <a href="#" id="trash" data-task-id="${_id}"><i class='bx bxs-trash'></i></a>
                    </div>
                </div>
            `;
        }).join("");
        taskSectionDOM.innerHTML = allTask;
        
        // delete
        // const deleteButtons = document.querySelectorAll(".trash");
        // deleteButtons.forEach(button => {
        //     button.addEventListener("click", async (event) => {
        //         event.preventDefault();
        //         const taskId = event.target.closest("a").getAttribute("data-task-id");
        //         await deleteTask(taskId);
        //     });
        // });
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
    if (event.target.closest(".edit-items").querySelector("#trash")) {
        try {
            event.preventDefault();
            const taskElement = event.target.closest(".edit-items").querySelector("#trash");
            const taskId = taskElement.getAttribute("data-task-id");
            // console.log(taskId);
            await deleteTask(taskId);
        } catch (err) {
            console.log(err);
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
