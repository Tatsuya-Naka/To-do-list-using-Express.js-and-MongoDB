const express = require("express");
const app = express();
const PORT = 3000;
const mongoose = require("mongoose");
const toDo = require("./templates/threads");
require("dotenv").config();

app.use(express.static("public"));
app.use(express.json());

const URL = `mongodb+srv://tatsuNakaKun:${process.env.PASSWORD}@test.0lcnvy3.mongodb.net/toDo?retryWrites=true&w=majority&appName=test`;
mongoose.connect(URL)
    .then(() => {
        console.log("Successfully connected to MongoDB!");
    }).catch((err) => {
        console.error("Failed connecting to MongoDB", err);
    });

// get
app.get("/todo/all", async(req, res) => {
    try {
        const allToDO = await toDo.find({});
        res.status(200).json(allToDO);
        console.log("Successfully get items from MongoDB!");
    } catch(err) {
        console.log(err);
    }
});

app.get("/todo/task/:id", async(req, res) => {
    try {
        const {id} = req.params;
        // const {title} = req.body;
        const task = await toDo.findOne({_id: id});
        if (!task) {
            return res.status(404).json({error: "Task not found"});
        }
        res.status(200).json({title: task.title});
        console.log("Successfully fetched task from MongoDB!", task.title);
    } catch (err) {
        console.log(err);
    }
});

// post
app.post("/todo/task", async(req, res) => {
    try {
        const createTask = await toDo.create(req.body);
        res.status(200).json(createTask);
        console.log("Successfully post items from MongoDB!");
    } catch(err) {
        console.log(err);
    }
});

// delete
app.delete("/todo/task/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const isValid = await toDo.find({id});
        if (isValid) {
            const deletedTask = await toDo.deleteOne({_id: id});

            if (!deletedTask) {
                return res.status(404).json({message: "Task not found"});
            }

            res.status(200).json({message: "Successfully deleted the task", deletedTask});
            console.log("Successfully deleted item from MongoDB!!");
        }
        else {
            console.log("Failed delete the item from MongoDB");
        }
    } catch(err) {
        res.status(500).send(err);
    }
});

//put 
app.put("/todo/task/update/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const {title} = req.body;

        if (!title) {
            return res.status(400).json({error: "Title not found"});
        }
        
        const updatedTask = await toDo.findByIdAndUpdate(id, {title}, {new: true});
        if (!updatedTask) {
            return res.status(400).json({error: "Title not found"});
        }

        res.status(200).json(updatedTask);
        console.log("Successfully updated this item to MongoDB!", updatedTask);
    } catch (err) {
        console.log(err);
    }
});

app.listen(PORT, () => {
    console.log("Successfully connected to your server!");
});