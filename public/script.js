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
                        <p>${_id}</p>
                    </div>
                    <div class="edit-items">
                        <a href="#"><i class='bx bxs-edit' ></i></a>
                        <a href="#" id="trash" data-task-id="${_id}"><i class='bx bxs-trash'></i></a>
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
// deleteTaskDOM.addEventListener("change", async(event) => {
//     // console.log("data-task-id");
//     console.log("Thank you!!");
//     // if (event.target.closest(".trash")) {
//     //     event.preventDefault();
//     //     const taskElement = event.target.closest(".thread");
//     //     const taskId = task.Element.getAttribute("data-task-id");
//     //     // console.log("data-task-id");
//     //     try {
//     //         await axios.delete(`/todo/task/delete/${taskId}`);
//     //         getAllTask();
//     //     } catch(err) {
//     //         console.log(err);
//     //     }
//     // }
// });

document.addEventListener("click", async(event) => {
    const deleteIcon = event.target.closest(".trash");
    if (deleteIcon) {
        event.preventDefault();
        // console.log("successfully deleted items from MongoDB!");
        const taskId = deleteIcon.getAttribute("data-task-id");
        try {
            await axios.delete(`/todo/task/${taskId}`);
            getAllTask();
        } catch (err) {
            console.log(err);
        }
    }
})