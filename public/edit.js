document.addEventListener("DOMContentLoaded", () => {
    const taskId = getQueryParam('id');

    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    };

    const fetchTaskDetails = async() => {
        try {
            const response = await axios.get(`/todo/task/${taskId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching task details: `, error);
            throw error;
        }
    };
    
    const populateForm = (task) => {
        document.getElementById('taskTitle').value = task.title;
    };

    const handleSubmit = async(event) => {
        event.preventDefault();
        const newTitle = document.getElementById('taskTitle').value;
        try {
            await axios.put(`/todo/task/update/${taskId}`, {title: newTitle});
            window.location.href = "index.html";
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancel = () => {
        window.location.href = "index.html";
    };

    fetchTaskDetails()
        .then(task => {
            populateForm(task);
        })
        .catch(error => {
            console.error("Failed to fetch task details:", error);
        });
    
    // const editForm = document.getElementById('editForm');
    // editForm.addEventListener("submit", handleSubmit);

    const saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', handleSubmit);

    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', handleCancel);
});
