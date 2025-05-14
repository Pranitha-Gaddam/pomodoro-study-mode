import React from "react";
import { FaRegSquare, FaCheckSquare, FaTrash } from "react-icons/fa"; // Importing checkbox icons

const TaskItems = ({ text, id, isComplete, deleteTask, toggle }) => {
    return (
        <div className="flex items-center justify-between bg-white/50 backdrop-blur-md shadow-md p-2 rounded-lg my-2">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggle(id)}>
                {isComplete ? (
                    <FaCheckSquare className="text-green-500 text-sm" />
                ) : (
                    <FaRegSquare className="text-gray-500 text-sm" />
                )}
                <p className={`text-gray-700 ${isComplete ? "line-through text-gray-500" : ""}`}>
                    {text}
                </p>
            </div>
            <FaTrash 
                className="cursor-pointer text-orange-700 opacity-90 hover:opacity-100 text-sm ml-2" 
                onClick={() => deleteTask(id)}
            />
        </div>
    );
};

export default TaskItems;
